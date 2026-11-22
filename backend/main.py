"""
FastAPI backend para gestionar registros desde un Excel local.

El frontend mantiene los mismos endpoints: listar registros, descargar Excel y
cargar un Excel con diferencias para actualizar la base local.
"""

from pathlib import Path
from datetime import date, datetime
from typing import Any, Dict, List
import io
import logging
import os
import re
import unicodedata

from dotenv import load_dotenv
from fastapi import Body, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openpyxl import load_workbook
import pandas as pd

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
CURSO_FECHA_COLUMN = "Fecha del curso"
CURSO_HORA_COLUMN = "Hora del curso"
CURSO_PROGRAMADO_RE = re.compile(
    r"^\s*(?P<curso>.+?)\s*-\s*(?P<dia>[a-záéíóúüñ]+)\s+"
    r"(?P<dia_num>\d{1,2})\s+de\s+(?P<mes>[a-záéíóúüñ]+)\s+"
    r"(?P<anio>\d{4})\s*-\s*(?P<hora>\d{1,2}:\d{2})\s*"
    r"(?P<periodo>[ap]\s*\.?\s*m\.?)\s*$",
    re.IGNORECASE,
)

app = FastAPI(
    title="Gestion de Eventos API",
    description="API para gestionar eventos e inscripciones desde Excel local",
    version="4.0.0",
)

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _excel_path() -> Path:
    use_mock_data = _uses_mock_data()
    if use_mock_data:
        configured_path = os.getenv("MOCK_EXCEL_PATH", "../mock_data.xlsx").strip() or "../mock_data.xlsx"
    else:
        configured_path = os.getenv("LOCAL_EXCEL_PATH", "../database.xlsx").strip() or "../database.xlsx"
    path = Path(configured_path)
    if not path.is_absolute():
        path = BASE_DIR / path
    return path.resolve()


def _uses_mock_data() -> bool:
    value = os.getenv("USE_MOCK_DATA", "false").strip().lower()
    if value in {"1", "true", "yes", "on"}:
        return True
    if value in {"0", "false", "no", "off", ""}:
        return False
    raise ValueError("USE_MOCK_DATA debe ser true/false, 1/0, yes/no u on/off.")


def _configured_sheet_name() -> str:
    return os.getenv("EXCEL_SHEET_NAME", "").strip()


def _sheet_to_read() -> str | int:
    return _configured_sheet_name() or 0


def _sheet_to_write(path: Path) -> str:
    configured_sheet_name = _configured_sheet_name()
    if configured_sheet_name:
        return configured_sheet_name[:31]

    if path.exists():
        workbook = load_workbook(path, read_only=True)
        try:
            return workbook.sheetnames[0][:31] if workbook.sheetnames else "Registros"
        finally:
            workbook.close()

    return "Registros"


def _normalizar_df(df: pd.DataFrame, columnas: List[str]) -> List[Dict[str, Any]]:
    resultado: List[Dict[str, Any]] = []
    for _, row in df.iterrows():
        registro: Dict[str, Any] = {}
        for col in columnas:
            valor = row.get(col)
            registro[col] = "" if pd.isna(valor) else str(valor).strip()
        resultado.append(registro)
    return resultado


def _normalizar_columnas(columnas: List[str]) -> List[str]:
    resultado = []
    for col in columnas:
        col_normalizado = str(col)
        for special_space in [
            "\xa0",
            "\u2000",
            "\u2001",
            "\u2002",
            "\u2003",
            "\u2004",
            "\u2005",
            "\u2006",
            "\u2007",
            "\u2008",
            "\u2009",
            "\u200a",
        ]:
            col_normalizado = col_normalizado.replace(special_space, " ")
        col_normalizado = re.sub(r"\s+", " ", col_normalizado).strip()
        resultado.append(col_normalizado)
    return resultado


def _texto_comparable(valor: Any) -> str:
    if valor is None or pd.isna(valor):
        return ""
    texto = str(valor).strip().lower()
    texto = re.sub(r"\s+", " ", texto)
    return texto


def _fecha_comparable(valor: Any) -> str:
    if valor is None or pd.isna(valor):
        return ""

    texto = str(valor).strip()
    if not texto:
        return ""

    fecha = pd.to_datetime(valor, errors="coerce", dayfirst=True)
    if pd.isna(fecha):
        fecha = pd.to_datetime(texto, errors="coerce")
    if pd.isna(fecha):
        return texto.split()[0].replace("/", "-").strip()

    return fecha.strftime("%d-%m-%Y")


def _hora_comparable(valor: Any) -> str:
    if valor is None or pd.isna(valor):
        return ""

    texto = re.sub(r"\s+", " ", str(valor).strip().lower()).replace(".", "")
    texto = re.sub(r"\b([ap])\s+m\b", r"\1m", texto)
    for formato in ("%H:%M", "%H:%M:%S", "%I:%M %p"):
        try:
            return datetime.strptime(texto, formato).strftime("%H:%M")
        except ValueError:
            continue
    return ""


def _sin_acentos(texto: str) -> str:
    return "".join(
        caracter
        for caracter in unicodedata.normalize("NFD", texto)
        if unicodedata.category(caracter) != "Mn"
    )


def _parsear_curso_programado(valor: Any) -> tuple[str, str, str]:
    if valor is None or pd.isna(valor):
        raise ValueError("El curso debe incluir nombre, fecha y hora.")

    texto = str(valor).strip()
    match = CURSO_PROGRAMADO_RE.fullmatch(texto)
    if not match:
        raise ValueError(
            "El curso debe tener el formato "
            "'Nombre del curso - miércoles 15 de abril 2026 - 3:00 pm'."
        )

    weekday = _sin_acentos(match.group("dia").lower())
    if weekday not in {"lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"}:
        raise ValueError("El día de la semana no es válido.")

    months = {
        "enero": 1,
        "febrero": 2,
        "marzo": 3,
        "abril": 4,
        "mayo": 5,
        "junio": 6,
        "julio": 7,
        "agosto": 8,
        "septiembre": 9,
        "setiembre": 9,
        "octubre": 10,
        "noviembre": 11,
        "diciembre": 12,
    }
    month = months.get(_sin_acentos(match.group("mes").lower()))
    if month is None:
        raise ValueError("El mes de la fecha del curso no es válido.")

    try:
        course_date = date(
            int(match.group("anio")),
            month,
            int(match.group("dia_num")),
        ).isoformat()
        period = re.sub(r"[\s.]", "", match.group("periodo")).upper()
        course_time = datetime.strptime(
            f"{match.group('hora')} {period}",
            "%I:%M %p",
        ).strftime("%H:%M")
    except ValueError as exc:
        raise ValueError("La fecha u hora del curso no es válida.") from exc

    course_name = match.group("curso").strip()
    if not course_name:
        raise ValueError("El nombre del curso no puede estar vacío.")

    return course_name, course_date, course_time


def _buscar_columna(columnas: List[str], patrones: List[str]) -> str | None:
    columnas_norm = {col: _texto_comparable(col) for col in columnas}
    for patron in patrones:
        patron_norm = _texto_comparable(patron)
        for col, col_norm in columnas_norm.items():
            if patron_norm in col_norm:
                return col
    return None


def _columnas_duplicado(columnas: List[str]) -> Dict[str, str]:
    completion_col = _buscar_columna(columnas, ["completion time"])
    curso_col = _buscar_columna(columnas, ["en que curso", "en que curso, taller", "curso, taller", "curso"])
    matricula_col = _buscar_columna(columnas, ["matricula", "matrícula", "nomina", "nómina"])
    nombre_col = _buscar_columna(columnas, ["nombre completo", "name"])
    fecha_curso_col = _buscar_columna(columnas, [CURSO_FECHA_COLUMN])
    hora_curso_col = _buscar_columna(columnas, [CURSO_HORA_COLUMN])

    faltantes = []
    if not completion_col:
        faltantes.append("Completion time")
    if not curso_col:
        faltantes.append("En que curso")
    if not matricula_col and not nombre_col:
        faltantes.append("Nombre o matricula")

    if faltantes:
        raise HTTPException(
            status_code=400,
            detail=(
                "No se pudieron encontrar las columnas necesarias para validar duplicados: "
                + ", ".join(faltantes)
            ),
        )

    return {
        "completion": completion_col,
        "curso": curso_col,
        "matricula": matricula_col or "",
        "nombre": nombre_col or "",
        "fecha_curso": fecha_curso_col or "",
        "hora_curso": hora_curso_col or "",
    }


def _datos_duplicado(row: Dict[str, Any], columnas_dup: Dict[str, str]) -> Dict[str, str]:
    return {
        "fecha": _fecha_comparable(row.get(columnas_dup["completion"])),
        "curso": _texto_comparable(row.get(columnas_dup["curso"])),
        "matricula": _texto_comparable(row.get(columnas_dup["matricula"])) if columnas_dup["matricula"] else "",
        "nombre": _texto_comparable(row.get(columnas_dup["nombre"])) if columnas_dup["nombre"] else "",
        "fecha_curso": _texto_comparable(row.get(columnas_dup["fecha_curso"])) if columnas_dup["fecha_curso"] else "",
        "hora_curso": _texto_comparable(row.get(columnas_dup["hora_curso"])) if columnas_dup["hora_curso"] else "",
    }


def _es_misma_persona(a: Dict[str, str], b: Dict[str, str]) -> bool:
    misma_matricula = bool(a["matricula"] and b["matricula"] and a["matricula"] == b["matricula"])
    mismo_nombre = bool(a["nombre"] and b["nombre"] and a["nombre"] == b["nombre"])
    return misma_matricula or mismo_nombre


def _es_registro_duplicado(a: Dict[str, str], b: Dict[str, str]) -> bool:
    return bool(
        a["fecha"]
        and b["fecha"]
        and a["fecha"] == b["fecha"]
        and a["curso"]
        and b["curso"]
        and a["curso"] == b["curso"]
        and a["fecha_curso"] == b["fecha_curso"]
        and a["hora_curso"] == b["hora_curso"]
        and _es_misma_persona(a, b)
    )


def _buscar_duplicado(
    row: Dict[str, Any],
    registros: List[Dict[str, Any]],
    columnas_dup: Dict[str, str],
) -> Dict[str, Any] | None:
    datos_row = _datos_duplicado(row, columnas_dup)
    for registro in registros:
        datos_registro = _datos_duplicado(registro, columnas_dup)
        if _es_registro_duplicado(datos_row, datos_registro):
            return registro
    return None


def _leer_excel_local() -> pd.DataFrame:
    path = _excel_path()
    if not path.exists():
        raise HTTPException(
            status_code=500,
            detail=f"No existe el archivo Excel local: {path}",
        )

    logger.info("Leyendo Excel local: %s", path)
    configured_sheet_name = _configured_sheet_name()
    try:
        df = pd.read_excel(path, sheet_name=_sheet_to_read())
    except ValueError as e:
        if configured_sheet_name and "Worksheet named" in str(e):
            logger.warning("No se encontro la hoja '%s'. Leyendo la primera hoja.", configured_sheet_name)
            df = pd.read_excel(path, sheet_name=0)
        else:
            raise

    df.columns = [str(col).strip() for col in df.columns.tolist()]
    return df


def _guardar_excel_local(registros: List[Dict[str, Any]], columnas: List[str]) -> None:
    df = pd.DataFrame(registros, columns=columnas)
    _guardar_dataframe_local(df)


def _guardar_dataframe_local(df: pd.DataFrame) -> None:
    path = _excel_path()
    path.parent.mkdir(parents=True, exist_ok=True)

    sheet_name = _sheet_to_write(path)
    logger.info("Guardando %s registros en Excel local: %s", len(df), path)

    with pd.ExcelWriter(path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name=sheet_name)


def _validar_archivo(file: UploadFile) -> None:
    if not file.filename:
        raise HTTPException(status_code=400, detail="No se recibio archivo.")

    nombre = file.filename.lower()
    if not (nombre.endswith(".xlsx") or nombre.endswith(".xls")):
        raise HTTPException(status_code=400, detail="El archivo debe ser Excel (.xlsx o .xls).")


def _leer_excel_subido(contenido: bytes) -> pd.DataFrame:
    configured_sheet_name = _configured_sheet_name()
    try:
        return pd.read_excel(io.BytesIO(contenido), sheet_name=_sheet_to_read())
    except ValueError as e:
        if configured_sheet_name and "Worksheet named" in str(e):
            return pd.read_excel(io.BytesIO(contenido), sheet_name=0)
        raise


@app.get("/")
async def root():
    return {
        "message": "Gestion de Eventos API",
        "version": "4.0.0",
        "storage": "local_excel",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    try:
        df = _leer_excel_local()
        return {
            "status": "healthy",
            "storage": "local_excel",
            "path": str(_excel_path()),
            "rows": len(df),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel local no disponible: {str(e)}")


@app.get("/api/datos")
def obtener_datos():
    try:
        df = _leer_excel_local()
        columnas = df.columns.tolist()
        datos = _normalizar_df(df, columnas)
        return {
            "success": True,
            "total": len(datos),
            "columns": columnas,
            "data": datos,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al obtener datos del Excel local: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {str(e)}")


@app.get("/api/datos/excel")
def descargar_datos_excel():
    try:
        df = _leer_excel_local()
        output = io.BytesIO()
        sheet_name = _sheet_to_write(_excel_path())
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=sheet_name)
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="registros_excel_local.xlsx"'},
        )
    except Exception as e:
        logger.error("Error al exportar datos: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error al exportar datos: {str(e)}")


@app.post("/api/datos/excel")
def descargar_datos_filtrados_excel(payload: Dict[str, Any] = Body(...)):
    try:
        columnas = [str(col) for col in payload.get("columns", [])]
        datos = payload.get("data", [])
        if not columnas or not isinstance(datos, list):
            raise HTTPException(status_code=400, detail="No se recibieron datos validos para exportar.")

        df = pd.DataFrame(datos, columns=columnas)
        output = io.BytesIO()
        sheet_name = _sheet_to_write(_excel_path())
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name=sheet_name)
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="registros_eventos_filtrados.xlsx"'},
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al exportar datos filtrados: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error al exportar datos filtrados: {str(e)}")


@app.post("/api/asistencia")
def guardar_asistencia(payload: Dict[str, Any] = Body(...)):
    try:
        curso = payload.get("course")
        fecha_asistencia = payload.get("attendance_date")
        fecha_sesion = payload.get("session_date")
        hora_sesion = payload.get("session_time")
        updates = payload.get("updates")
        if not isinstance(curso, str) or not curso.strip():
            raise HTTPException(status_code=400, detail="Se debe indicar un curso.")
        if not isinstance(fecha_asistencia, str):
            raise HTTPException(status_code=400, detail="Se debe indicar una fecha de asistencia valida.")
        try:
            fecha_asistencia_valida = date.fromisoformat(fecha_asistencia)
        except ValueError:
            raise HTTPException(status_code=400, detail="La fecha de asistencia debe tener formato AAAA-MM-DD.")
        if fecha_asistencia_valida.isoformat() != fecha_asistencia:
            raise HTTPException(status_code=400, detail="La fecha de asistencia debe tener formato AAAA-MM-DD.")
        if (fecha_sesion is None) != (hora_sesion is None):
            raise HTTPException(status_code=400, detail="La fecha y hora de la sesión deben enviarse juntas.")
        fecha_sesion_valida = None
        if fecha_sesion is not None:
            if not isinstance(fecha_sesion, str):
                raise HTTPException(status_code=400, detail="La fecha de la sesión no es válida.")
            try:
                fecha_sesion_valida = date.fromisoformat(fecha_sesion)
            except ValueError:
                raise HTTPException(status_code=400, detail="La fecha de la sesión debe tener formato AAAA-MM-DD.")
            if fecha_sesion_valida.isoformat() != fecha_sesion:
                raise HTTPException(status_code=400, detail="La fecha de la sesión debe tener formato AAAA-MM-DD.")
            if not isinstance(hora_sesion, str) or not re.fullmatch(r"(?:[01]\d|2[0-3]):[0-5]\d", hora_sesion):
                raise HTTPException(status_code=400, detail="La hora de la sesión debe tener formato HH:MM.")
        if not isinstance(updates, list) or not updates:
            raise HTTPException(status_code=400, detail="No se recibieron asistencias para guardar.")

        df = _leer_excel_local()
        columnas = [str(col).strip() for col in df.columns.tolist()]
        df.columns = columnas
        curso_col = _buscar_columna(columnas, ["en que curso", "curso, taller", "curso"])
        if not curso_col:
            raise HTTPException(status_code=400, detail="No se encontro la columna del curso.")
        fecha_sesion_col = _buscar_columna(columnas, [CURSO_FECHA_COLUMN]) if fecha_sesion_valida else None
        hora_sesion_col = _buscar_columna(columnas, [CURSO_HORA_COLUMN]) if fecha_sesion_valida else None
        if fecha_sesion_valida and (not fecha_sesion_col or not hora_sesion_col):
            raise HTTPException(
                status_code=400,
                detail="El Excel no contiene las columnas de fecha y hora del curso.",
            )

        notas_col = next(
            (col for col in columnas if _texto_comparable(col) == "notas_asistencia"),
            None,
        )
        fecha_col = next(
            (col for col in columnas if _texto_comparable(col) == "fecha_asistencia"),
            None,
        )
        registros_actualizados: Dict[int, Dict[str, str]] = {}
        for update in updates:
            if not isinstance(update, dict):
                raise HTTPException(status_code=400, detail="El formato de asistencia no es valido.")

            row_index = update.get("row_index")
            asistencia = update.get("attendance")
            notas = update.get("notes")
            if isinstance(row_index, bool) or not isinstance(row_index, int) or row_index < 0:
                raise HTTPException(status_code=400, detail="El indice de un registro no es valido.")
            if asistencia not in ("Asistió", "No asistió"):
                raise HTTPException(status_code=400, detail="La asistencia debe ser 'Asistió' o 'No asistió'.")
            if notas is not None and not isinstance(notas, str):
                raise HTTPException(status_code=400, detail="Las notas de asistencia deben ser texto.")
            if row_index in registros_actualizados:
                raise HTTPException(status_code=400, detail="Hay registros repetidos en la solicitud.")
            if row_index >= len(df):
                raise HTTPException(status_code=400, detail="Uno de los registros ya no existe en el Excel.")
            if _texto_comparable(df.iloc[row_index][curso_col]) != _texto_comparable(curso):
                raise HTTPException(status_code=400, detail="El curso de un registro no coincide con el curso seleccionado.")
            if fecha_sesion_valida:
                fecha_registro = _fecha_comparable(df.iloc[row_index][fecha_sesion_col])
                fecha_seleccionada = fecha_sesion_valida.strftime("%d-%m-%Y")
                hora_registro = _hora_comparable(df.iloc[row_index][hora_sesion_col])
                if fecha_registro != fecha_seleccionada or hora_registro != hora_sesion:
                    raise HTTPException(
                        status_code=400,
                        detail="Un registro no corresponde a la fecha y hora de la sesión seleccionada.",
                    )

            if notas is None:
                valor_nota = df.iloc[row_index][notas_col] if notas_col else ""
                notas = "" if pd.isna(valor_nota) else str(valor_nota)
            registros_actualizados[row_index] = {"attendance": asistencia, "notes": notas}

        asistencia_col = next(
            (col for col in columnas if _texto_comparable(col) == "asistencia"),
            None,
        )
        if asistencia_col is None:
            asistencia_col = "Asistencia"
            columnas.append(asistencia_col)
            df[asistencia_col] = ""
        else:
            df[asistencia_col] = df[asistencia_col].fillna("").astype(str)

        if notas_col is None:
            notas_col = "notas_asistencia"
            df[notas_col] = ""
        else:
            df[notas_col] = df[notas_col].fillna("").astype(str)
        if fecha_col is None:
            fecha_col = "fecha_asistencia"
            df[fecha_col] = ""
        else:
            df[fecha_col] = df[fecha_col].astype("object").where(df[fecha_col].notna(), "")
        columnas = [col for col in columnas if col != fecha_col] + [fecha_col]
        columnas = [col for col in columnas if col != notas_col] + [notas_col]

        for row_index, values in registros_actualizados.items():
            df.at[df.index[row_index], asistencia_col] = values["attendance"]
            df.at[df.index[row_index], notas_col] = values["notes"]
            df.at[df.index[row_index], fecha_col] = fecha_asistencia_valida.isoformat()

        _guardar_dataframe_local(df[columnas])
        return {
            "success": True,
            "message": "Asistencia guardada en el Excel.",
            "attendance_column": asistencia_col,
            "date_column": fecha_col,
            "notes_column": notas_col,
            "updated": len(registros_actualizados),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al guardar la asistencia: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error al guardar la asistencia: {str(e)}")


@app.post("/api/datos/upload-excel")
def cargar_excel_diferencial(file: UploadFile = File(...)):
    try:
        _validar_archivo(file)

        contenido = file.file.read()
        if not contenido:
            raise HTTPException(status_code=400, detail="El archivo Excel esta vacio.")

        df_base = _leer_excel_local()
        columnas_base = _normalizar_columnas(df_base.columns.tolist())
        df_base.columns = columnas_base
        df_subido = _leer_excel_subido(contenido)
        columnas_subidas = _normalizar_columnas(df_subido.columns.tolist())
        df_subido.columns = columnas_subidas

        columnas_base_fuente = [
            columna for columna in columnas_base
            if columna not in {CURSO_FECHA_COLUMN, CURSO_HORA_COLUMN}
        ]
        formatos_aceptados = [columnas_base_fuente]
        if columnas_base != columnas_base_fuente:
            formatos_aceptados.append(columnas_base)
        if columnas_subidas not in formatos_aceptados:
            raise HTTPException(
                status_code=400,
                detail=(
                    "El formato del archivo no coincide con el Excel base. "
                    f"Columnas esperadas: {columnas_base_fuente}. "
                    f"Columnas recibidas: {columnas_subidas}."
                ),
            )

        columnas_finales = list(columnas_base)
        for columna in (CURSO_FECHA_COLUMN, CURSO_HORA_COLUMN):
            if columna not in columnas_finales:
                columnas_finales.append(columna)

        columnas_dup = _columnas_duplicado(columnas_finales)
        curso_col = columnas_dup["curso"]
        base_norm = _normalizar_df(df_base, columnas_base)
        base_necesita_guardado = bool(len(df_subido) and columnas_finales != columnas_base)
        for row_base in base_norm:
            for columna in (CURSO_FECHA_COLUMN, CURSO_HORA_COLUMN):
                row_base.setdefault(columna, "")
            if not len(df_subido):
                continue
            try:
                curso, fecha_curso, hora_curso = _parsear_curso_programado(row_base.get(curso_col))
            except ValueError:
                continue
            fecha_actual = row_base.get(CURSO_FECHA_COLUMN) or ""
            hora_actual = row_base.get(CURSO_HORA_COLUMN) or ""
            if (
                row_base.get(curso_col) != curso
                or fecha_actual != fecha_curso
                or hora_actual != hora_curso
            ):
                base_necesita_guardado = True
            row_base[curso_col] = curso
            row_base[CURSO_FECHA_COLUMN] = fecha_curso
            row_base[CURSO_HORA_COLUMN] = hora_curso

        subido_norm = _normalizar_df(df_subido, columnas_subidas)
        for row_number, row_subido in enumerate(subido_norm, start=2):
            try:
                curso, fecha_curso, hora_curso = _parsear_curso_programado(row_subido.get(curso_col))
            except ValueError as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"El formato del curso en la fila {row_number} no es válido: {exc}",
                )
            row_subido[curso_col] = curso
            row_subido[CURSO_FECHA_COLUMN] = fecha_curso
            row_subido[CURSO_HORA_COLUMN] = hora_curso

        datos_actualizados = list(base_norm)
        insertados = 0
        duplicados = 0

        for row_subido in subido_norm:
            if _buscar_duplicado(row_subido, datos_actualizados, columnas_dup) is None:
                datos_actualizados.append(row_subido)
                insertados += 1
            else:
                duplicados += 1

        if insertados > 0 or base_necesita_guardado:
            _guardar_excel_local(datos_actualizados, columnas_finales)

        return {
            "success": True,
            "message": (
                "Cambios guardados en el Excel local."
                if insertados > 0
                else (
                    "Se separaron los datos del curso en el Excel local; "
                    "no se detectaron registros nuevos."
                    if base_necesita_guardado
                    else "No se detectaron registros nuevos respecto al Excel base."
                )
            ),
            "columns": columnas_finales,
            "summary": {
                "total_base": len(base_norm),
                "total_subido": len(subido_norm),
                "insertados": insertados,
                "actualizados": 0,
                "sin_cambios": duplicados,
                "duplicados": duplicados,
                "diferentes": insertados,
                "criterio_duplicado": "misma persona por nombre o matricula + mismo curso + fecha/hora del curso + misma fecha de Completion time",
            },
            "data": datos_actualizados,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error al cargar Excel diferencial: %s", str(e))
        raise HTTPException(status_code=400, detail=f"Error al procesar archivo: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    logger.info(
        "Iniciando con datos %s: %s",
        "de prueba" if _uses_mock_data() else "reales",
        _excel_path(),
    )
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
