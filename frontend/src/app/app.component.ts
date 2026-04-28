import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

interface DatosResponse {
  success: boolean;
  total: number;
  columns: string[];
  data: Record<string, any>[];
  message?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading = false;
  isExporting = false;
  tableData: Record<string, any>[] = [];
  columns: string[] = [];
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.error = null;

    this.dataService.downloadFromOneDrive().subscribe({
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
}
