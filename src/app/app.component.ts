import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Gestión de Eventos - Inscripciones';
  isLoading = false;
  tableData: any[] = [];
  columns: string[] = [];

  constructor(private dataService: DataService) {}

  downloadData(): void {
    this.isLoading = true;
    // Esta función será conectada a OneDrive posteriormente
    this.dataService.downloadFromOneDrive().subscribe({
      next: (data) => {
        this.tableData = data;
        if (data.length > 0) {
          this.columns = Object.keys(data[0]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error descargando datos:', error);
        this.isLoading = false;
      }
    });
  }
}
