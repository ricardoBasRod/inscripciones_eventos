import io
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import pandas as pd
from fastapi import HTTPException, UploadFile

from backend import main


COURSE_COLUMN = "En qué curso, taller o webinar te quieres inscribir?"
ENROLLMENT_COLUMNS = [
    "Completion time",
    COURSE_COLUMN,
    "Número de matrícula o nómina",
    "Nombre completo del estudiante o colaborador del Tec",
]


class CourseScheduleTests(unittest.TestCase):
    def test_parse_course_name_date_and_time(self):
        self.assertEqual(
            main._parsear_curso_programado(
                "SW0002 - WEBINAR Solidworks diseño básico CSWA - miércoles 15 de abril 2026 - 3:00 pm"
            ),
            ("SW0002 - WEBINAR Solidworks diseño básico CSWA", "2026-04-15", "15:00"),
        )

    def test_import_splits_schedule_and_distinguishes_course_sessions(self):
        existing_course = (
            "SW0002 - WEBINAR Solidworks diseño básico CSWA - miércoles 15 de abril 2026 - 3:00 pm"
        )
        incoming_course = (
            "SW0002 - WEBINAR Solidworks diseño básico CSWA - miércoles 22 de abril 2026 - 3:00 pm"
        )
        base = pd.DataFrame(
            [["2026-03-01 10:00:00", existing_course, "123", "Ana Pérez"]],
            columns=ENROLLMENT_COLUMNS,
        )
        incoming = pd.DataFrame(
            [
                ["2026-03-01 10:00:00", existing_course, "123", "Ana Pérez"],
                ["2026-03-01 10:00:00", incoming_course, "123", "Ana Pérez"],
            ],
            columns=ENROLLMENT_COLUMNS,
        )
        upload = UploadFile(filename="inscripciones.xlsx", file=io.BytesIO(b"xlsx"))

        with tempfile.TemporaryDirectory() as temporary_directory:
            workbook_path = Path(temporary_directory) / "database.xlsx"
            with patch.object(main, "_leer_excel_local", return_value=base), patch.object(
                main, "_leer_excel_subido", return_value=incoming
            ), patch.object(main, "_excel_path", return_value=workbook_path):
                response = main.cargar_excel_diferencial(upload)
            saved_workbook = pd.read_excel(workbook_path)

        self.assertEqual(response["summary"]["insertados"], 1)
        self.assertEqual(response["summary"]["duplicados"], 1)
        self.assertEqual(response["data"][0][COURSE_COLUMN], "SW0002 - WEBINAR Solidworks diseño básico CSWA")
        self.assertEqual(response["data"][0][main.CURSO_FECHA_COLUMN], "2026-04-15")
        self.assertEqual(response["data"][0][main.CURSO_HORA_COLUMN], "15:00")
        self.assertEqual(response["data"][1][main.CURSO_FECHA_COLUMN], "2026-04-22")
        self.assertEqual(response["data"][1][main.CURSO_HORA_COLUMN], "15:00")
        self.assertIn(main.CURSO_FECHA_COLUMN, response["columns"])
        self.assertIn(main.CURSO_HORA_COLUMN, response["columns"])
        self.assertIn(main.CURSO_FECHA_COLUMN, saved_workbook.columns)
        self.assertIn(main.CURSO_HORA_COLUMN, saved_workbook.columns)
        self.assertEqual(saved_workbook.loc[1, COURSE_COLUMN], "SW0002 - WEBINAR Solidworks diseño básico CSWA")
        self.assertEqual(saved_workbook.loc[1, main.CURSO_FECHA_COLUMN], "2026-04-22")

    def test_import_rejects_course_without_schedule(self):
        base = pd.DataFrame(columns=ENROLLMENT_COLUMNS)
        incoming = pd.DataFrame(
            [["2026-03-01 10:00:00", "SW0002 - WEBINAR Solidworks diseño básico CSWA", "123", "Ana Pérez"]],
            columns=ENROLLMENT_COLUMNS,
        )
        upload = UploadFile(filename="inscripciones.xlsx", file=io.BytesIO(b"xlsx"))

        with patch.object(main, "_leer_excel_local", return_value=base), patch.object(
            main, "_leer_excel_subido", return_value=incoming
        ), patch.object(main, "_guardar_excel_local") as save:
            with self.assertRaises(HTTPException) as error:
                main.cargar_excel_diferencial(upload)

        self.assertEqual(error.exception.status_code, 400)
        self.assertIn("fila 2", error.exception.detail)
        save.assert_not_called()

    def test_import_accepts_source_columns_after_schedule_columns_exist(self):
        course_name = "SW0002 - WEBINAR Solidworks diseño básico CSWA"
        base_columns = ENROLLMENT_COLUMNS + [main.CURSO_FECHA_COLUMN, main.CURSO_HORA_COLUMN]
        base = pd.DataFrame(
            [["2026-03-01 10:00:00", course_name, "123", "Ana Pérez", "2026-04-15", "15:00"]],
            columns=base_columns,
        )
        incoming = pd.DataFrame(
            [[
                "2026-03-01 10:00:00",
                f"{course_name} - miércoles 15 de abril 2026 - 3:00 pm",
                "123",
                "Ana Pérez",
            ]],
            columns=ENROLLMENT_COLUMNS,
        )
        upload = UploadFile(filename="inscripciones.xlsx", file=io.BytesIO(b"xlsx"))

        with patch.object(main, "_leer_excel_local", return_value=base), patch.object(
            main, "_leer_excel_subido", return_value=incoming
        ), patch.object(main, "_guardar_excel_local") as save:
            response = main.cargar_excel_diferencial(upload)

        self.assertEqual(response["summary"]["duplicados"], 1)
        self.assertEqual(response["summary"]["insertados"], 0)
        save.assert_not_called()

    def test_attendance_save_validates_selected_session(self):
        course_column = COURSE_COLUMN
        columns = [course_column, main.CURSO_FECHA_COLUMN, main.CURSO_HORA_COLUMN]
        data = pd.DataFrame(
            [["SW0002 - WEBINAR Solidworks diseño básico CSWA", "2026-04-15", "15:00"]],
            columns=columns,
        )
        payload = {
            "course": "SW0002 - WEBINAR Solidworks diseño básico CSWA",
            "attendance_date": "2026-04-15",
            "session_date": "2026-04-15",
            "session_time": "15:00",
            "updates": [{"row_index": 0, "attendance": "Asistió", "notes": ""}],
        }

        with patch.object(main, "_leer_excel_local", return_value=data), patch.object(
            main, "_guardar_dataframe_local"
        ) as save:
            response = main.guardar_asistencia(payload)

        self.assertEqual(response["updated"], 1)
        self.assertEqual(save.call_args.args[0].iloc[0]["Asistencia"], "Asistió")

    def test_attendance_save_rejects_a_row_from_another_session(self):
        columns = [COURSE_COLUMN, main.CURSO_FECHA_COLUMN, main.CURSO_HORA_COLUMN]
        data = pd.DataFrame(
            [["SW0002 - WEBINAR Solidworks diseño básico CSWA", "2026-04-22", "15:00"]],
            columns=columns,
        )
        payload = {
            "course": "SW0002 - WEBINAR Solidworks diseño básico CSWA",
            "attendance_date": "2026-04-15",
            "session_date": "2026-04-15",
            "session_time": "15:00",
            "updates": [{"row_index": 0, "attendance": "Asistió", "notes": ""}],
        }

        with patch.object(main, "_leer_excel_local", return_value=data), patch.object(
            main, "_guardar_dataframe_local"
        ) as save:
            with self.assertRaises(HTTPException) as error:
                main.guardar_asistencia(payload)

        self.assertEqual(error.exception.status_code, 400)
        self.assertIn("sesión seleccionada", error.exception.detail)
        save.assert_not_called()


if __name__ == "__main__":
    unittest.main()
