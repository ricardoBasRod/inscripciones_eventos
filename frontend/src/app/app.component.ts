import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';

interface DatosResponse {
  success: boolean;
  total: number;
  columns: string[];
  data: Record<string, any>[];
  message?: string;
  summary?: CargaResumen;
}

interface CargaResumen {
  total_mongodb: number;
  total_subido: number;
  insertados: number;
  actualizados: number;
  sin_cambios: number;
  diferentes?: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = false;
  isExporting = false;
  isUploading = false;
  searchTerm = '';
  tableData: Record<string, any>[] = [];
  columns: string[] = [];
  error: string | null = null;
  loadSummary: CargaResumen | null = null;
  expandedColumns = new Set<string>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.dataService.getDatos().subscribe({
      next: (response: DatosResponse) => {
        this.tableData = response.data;
        this.columns = response.columns;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando datos:', err);
        this.error = 'Error al cargar los datos. Verifica que el backend este corriendo.';
        this.isLoading = false;
      }
    });
  }

  downloadExcel(): void {
    this.isExporting = true;
    this.error = null;

    this.dataService.downloadExcel().subscribe({
      next: (file: Blob) => {
        const blobUrl = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = 'registros_eventos.xlsx';
        anchor.click();
        window.URL.revokeObjectURL(blobUrl);
        this.isExporting = false;
      },
      error: (err: any) => {
        console.error('Error descargando Excel:', err);
        this.error = 'Error al descargar el archivo Excel.';
        this.isExporting = false;
      }
    });
  }

  openFilePicker(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const fileName = selectedFile.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      this.error = 'Selecciona un archivo Excel valido (.xlsx o .xls).';
      target.value = '';
      return;
    }

    this.isUploading = true;
    this.error = null;
    this.loadSummary = null;

    this.dataService.uploadExcel(selectedFile).subscribe({
      next: (response: DatosResponse) => {
        this.tableData = response.data;
        this.columns = response.columns;
        this.loadSummary = response.summary || null;
        this.isUploading = false;
        target.value = '';
      },
      error: (err: any) => {
        console.error('Error subiendo Excel:', err);
        this.error = err?.error?.detail || 'No se pudo cargar el archivo Excel.';
        this.isUploading = false;
        target.value = '';
      }
    });
  }

  getColumnLabel(column: string): string {
    if (this.expandedColumns.has(column)) {
      return column;
    }
    return this.shortenColumnName(column);
  }

  isColumnExpanded(column: string): boolean {
    return this.expandedColumns.has(column);
  }

  toggleColumnExpansion(column: string): void {
    if (this.expandedColumns.has(column)) {
      this.expandedColumns.delete(column);
    } else {
      this.expandedColumns.add(column);
    }
  }

  getFilteredRows(): Record<string, any>[] {
    const term = this.normalizeSearchValue(this.searchTerm.trim());
    if (!term) {
      return this.tableData;
    }

    const nombreCols = this.columns.filter(c => c.toLowerCase().includes('nombre'));
    const matriculaCols = this.columns.filter(c => c.toLowerCase().includes('matricula'));
    const targetCols = [...new Set([...nombreCols, ...matriculaCols])];
    const colsToSearch = targetCols.length > 0 ? targetCols : this.columns;

    return this.tableData.filter((row) =>
      colsToSearch.some((col) =>
        this.normalizeSearchValue(String(row[col] ?? '')).includes(term)
      )
    );
  }

  shouldShowColumnToggle(column: string): boolean {
    return column.trim().length > 20;
  }

  private shortenColumnName(column: string): string {
    const words = column
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length <= 3 && column.length <= 20) {
      return column;
    }

    const threeWords = words.slice(0, 3).join(' ');
    if (threeWords.length <= 20) {
      return threeWords;
    }

    return threeWords.slice(0, 20).trim();
  }

  private normalizeSearchValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
