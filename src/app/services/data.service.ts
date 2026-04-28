import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface DatosResponse {
  success: boolean;
  total: number;
  columns: string[];
  data: any[];
}

export interface ColumnasResponse {
  success: boolean;
  columns: string[];
  data_types: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // URL del backend (modificar según tu configuración)
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos desde el backend (que descarga del Excel en OneDrive)
   */
  downloadFromOneDrive(): Observable<any[]> {
    return this.http.get<DatosResponse>(`${this.apiUrl}/datos`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          console.error('Error al obtener datos:', error);
          return throwError(() => new Error('No se pudo obtener los datos del servidor'));
        })
      );
  }

  /**
   * Obtiene solo las columnas del archivo Excel
   */
  obtenerColumnas(): Observable<string[]> {
    return this.http.get<ColumnasResponse>(`${this.apiUrl}/columnas`)
      .pipe(
        map(response => response.columns || []),
        catchError(error => {
          console.error('Error al obtener columnas:', error);
          return throwError(() => new Error('No se pudo obtener las columnas'));
        })
      );
  }

  /**
   * Obtiene la respuesta completa con metadata
   */
  obtenerDatosCompleto(): Observable<DatosResponse> {
    return this.http.get<DatosResponse>(`${this.apiUrl}/datos`)
      .pipe(
        catchError(error => {
          console.error('Error al obtener datos completo:', error);
          return throwError(() => new Error('Error al conectar con el servidor'));
        })
      );
  }

  /**
   * Carga datos desde una URL personalizada de OneDrive
   */
  cargarDesdeUrlPersonalizada(fileUrl: string): Observable<DatosResponse> {
    return this.http.post<DatosResponse>(`${this.apiUrl}/datos/upload`, { file_url: fileUrl })
      .pipe(
        catchError(error => {
          console.error('Error al cargar archivo:', error);
          return throwError(() => new Error('No se pudo procesar el archivo'));
        })
      );
  }

  /**
   * Verifica la salud del servidor
   */
  healthCheck(): Observable<{ status: string }> {
    return this.http.get<{ status: string }>('http://localhost:8000/health')
      .pipe(
        catchError(() => {
          return throwError(() => new Error('Backend no disponible'));
        })
      );
  }
}
