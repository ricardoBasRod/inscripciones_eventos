#!/usr/bin/env python3
"""
Sincroniza registros desde un Excel nuevo hacia un Excel maestro (OneDrive sync local).

Regla de duplicado:
- Un registro ya existe solo si coinciden ambos campos: id y nombre.
- Los registros no existentes se agregan al final del maestro.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd


REQUIRED_COLUMNS = ("id", "nombre")


def normalize_id(value: object) -> str:
    """Normaliza id para evitar falsos distintos por formato de Excel."""
    if pd.isna(value):
        return ""
    text = str(value).strip()
    # Excel suele convertir enteros a float (ej: 1 -> 1.0)
    if text.endswith(".0"):
        text = text[:-2]
    return text


def normalize_nombre(value: object) -> str:
    if pd.isna(value):
        return ""
    return str(value).strip()


def validate_columns(df: pd.DataFrame, source_name: str) -> None:
    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(
            f"{source_name}: faltan columnas requeridas {missing}. "
            f"Columnas encontradas: {df.columns.tolist()}"
        )


def load_excel(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"No existe el archivo: {path}")
    return pd.read_excel(path)


def build_key(df: pd.DataFrame) -> pd.Series:
    return (
        df["id"].map(normalize_id)
        + "||"
        + df["nombre"].map(normalize_nombre).str.lower()
    )


def sync_excels(master_path: Path, incoming_path: Path, dry_run: bool) -> int:
    master_df = load_excel(master_path)
    incoming_df = load_excel(incoming_path)

    validate_columns(master_df, "Excel maestro")
    validate_columns(incoming_df, "Excel nuevo")

    master_keys = set(build_key(master_df))
    incoming_keys = build_key(incoming_df)

    mask_new = ~incoming_keys.isin(master_keys)
    new_rows = incoming_df.loc[mask_new].copy()

    print(f"Registros maestro: {len(master_df)}")
    print(f"Registros entrantes: {len(incoming_df)}")
    print(f"Registros nuevos a agregar: {len(new_rows)}")

    if new_rows.empty:
        print("No hay cambios. Todo ya existe en el maestro.")
        return 0

    if dry_run:
        print("Modo dry-run activo: no se escribió ningún archivo.")
        return 0

    # Mantener columnas del maestro y agregar cualquier columna extra del entrante al final
    final_columns = list(master_df.columns)
    for col in incoming_df.columns:
        if col not in final_columns:
            final_columns.append(col)

    merged_df = pd.concat([master_df, new_rows], ignore_index=True)
    merged_df = merged_df.reindex(columns=final_columns)
    merged_df.to_excel(master_path, index=False)

    print(f"Archivo actualizado correctamente: {master_path}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Compara dos Excels por (id,nombre) y agrega al maestro "
            "los registros que no existan."
        )
    )
    parser.add_argument(
        "--master",
        required=True,
        help="Ruta del Excel maestro (el de OneDrive sincronizado localmente).",
    )
    parser.add_argument(
        "--incoming",
        required=True,
        help="Ruta del Excel nuevo que deseas importar.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Solo muestra cuántos registros se agregarían, sin escribir cambios.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    master_path = Path(args.master).expanduser().resolve()
    incoming_path = Path(args.incoming).expanduser().resolve()
    return sync_excels(master_path, incoming_path, args.dry_run)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
