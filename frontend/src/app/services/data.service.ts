import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getDatos(): Observable<DatosResponse> {
    return this.http.get<DatosResponse>(`${this.apiUrl}/datos`).pipe(
      catchError(error => {
        console.error('Error en DataService:', error);
        throw error;
      })
    );
  }

  downloadExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/datos/excel`, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('Error descargando Excel:', error);
        throw error;
      })
    );
  }

  uploadExcel(file: File): Observable<DatosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<DatosResponse>(`${this.apiUrl}/datos/upload-excel`, formData).pipe(
      catchError(error => {
        console.error('Error subiendo Excel:', error);
        throw error;
      })
    );
  }

  obtenerColumnas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/columnas`).pipe(
      catchError(error => {
        console.error('Error obteniendo columnas:', error);
        throw error;
      })
    );
  }

  cargarDesdeUrlPersonalizada(fileUrl: string): Observable<DatosResponse> {
    return this.http.post<DatosResponse>(`${this.apiUrl}/datos/upload`, { url: fileUrl }).pipe(
      catchError(error => {
        console.error('Error cargando archivo:', error);
        throw error;
      })
    );
  }

  healthCheck(): Observable<any> {
    return this.http.get('http://localhost:8000/health').pipe(
      catchError(error => {
        console.error('Backend no disponible:', error);
        throw error;
      })
    );
  }
}
