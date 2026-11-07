import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, AsistenciaUpdate } from './services/data.service';

interface DatosResponse {
  columns: string[];
  data: Record<string, any>[];
}

interface CourseRow {
  row: Record<string, any>;
  index: number;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  savedMessage: string | null = null;
  columns: string[] = [];
  tableData: Record<string, any>[] = [];
  courseSearchTerm = '';
  selectedCourse = '';
  showCourseSuggestions = false;
  readonly pageSize = 50;
  availableCourses: string[] = [];
  courseSuggestions: string[] = [];
  matchingCourseCount = 0;
  courseRows: CourseRow[] = [];
  visibleCourseRows: CourseRow[] = [];
  currentPage = 0;
  pendingAttendanceCount = 0;
  attendanceChoices: Record<number, '' | 'Asistió' | 'No asistió'> = {};
  attendanceNotes: Record<number, string> = {};

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.getDatos().subscribe({
      next: (response: DatosResponse) => {
        this.columns = response.columns || [];
        this.tableData = response.data || [];
        this.availableCourses = this.getAvailableCourses();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando registros para asistencia:', err);
        this.error = 'No se pudieron cargar los registros. Verifica que el backend esté corriendo.';
        this.isLoading = false;
      }
    });
  }

  get courseColumn(): string | null {
    const inscriptionColumn = this.columns.find(column => {
      const normalizedColumn = this.normalize(column);
      return normalizedColumn.includes('inscrib') &&
        (normalizedColumn.includes('curso') || normalizedColumn.includes('taller') || normalizedColumn.includes('webinar'));
    });
    return inscriptionColumn || this.findColumn(['en que curso', 'curso taller o webinar', 'curso taller webinar', 'curso', 'taller', 'webinar']);
  }

  get nameColumn(): string | null {
    return this.findColumn(['nombre completo del estudiante', 'nombre completo', 'name', 'nombre']);
  }

  get registrationColumn(): string | null {
    return this.findColumn(['matricula', 'matrícula', 'nomina', 'nómina']);
  }

  private getAvailableCourses(): string[] {
    if (!this.courseColumn) {
      return [];
    }
    return [...new Set(this.tableData.map(row => String(row[this.courseColumn!] ?? '').trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'));
  }

  refreshCourseSuggestions(): void {
    const term = this.normalize(this.courseSearchTerm.trim());
    const matches = this.availableCourses.filter(course => !term || this.normalize(course).includes(term));
    this.matchingCourseCount = matches.length;
    this.courseSuggestions = matches.slice(0, 30);
  }

  get canSave(): boolean {
    return this.courseRows.length > 0 && this.pendingAttendanceCount === 0;
  }

  get totalPages(): number {
    return Math.ceil(this.courseRows.length / this.pageSize);
  }

  get firstVisibleRow(): number {
    return this.courseRows.length ? this.currentPage * this.pageSize + 1 : 0;
  }

  get lastVisibleRow(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.courseRows.length);
  }

  onCourseSearchChange(): void {
    this.selectedCourse = '';
    this.courseRows = [];
    this.visibleCourseRows = [];
    this.currentPage = 0;
    this.pendingAttendanceCount = 0;
    this.attendanceChoices = {};
    this.attendanceNotes = {};
    this.savedMessage = null;
    this.error = null;
    this.showCourseSuggestions = true;
    this.refreshCourseSuggestions();
  }

  chooseCourse(course: string): void {
    this.courseSearchTerm = course;
    this.selectedCourse = course;
    this.showCourseSuggestions = false;
    this.savedMessage = null;
    this.error = null;
    this.attendanceChoices = {};
    const attendanceColumn = this.attendanceColumn;
    const notesColumn = this.notesColumn;
    const courseColumn = this.courseColumn;
    this.courseRows = courseColumn
      ? this.tableData.reduce<CourseRow[]>((rows, row, index) => {
        if (String(row[courseColumn] ?? '').trim() === course) {
          rows.push({ row, index });
        }
        return rows;
      }, [])
      : [];
    this.courseRows.sort((a, b) =>
      this.getStudentName(a.row).localeCompare(this.getStudentName(b.row), 'es', { sensitivity: 'base' })
    );
    this.pendingAttendanceCount = 0;
    this.courseRows.forEach(({ row, index }) => {
      const storedAttendance = String(attendanceColumn ? row[attendanceColumn] ?? '' : '').trim();
      this.attendanceChoices[index] = storedAttendance === 'Asistió' || storedAttendance === 'No asistió'
        ? storedAttendance
        : '';
      this.attendanceNotes[index] = notesColumn ? String(row[notesColumn] ?? '') : '';
      if (!this.attendanceChoices[index]) {
        this.pendingAttendanceCount++;
      }
    });
    this.currentPage = 0;
    this.updateVisibleRows();
  }

  setPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.updateVisibleRows();
  }

  setAttendance(index: number, attendance: '' | 'Asistió' | 'No asistió'): void {
    const previous = this.attendanceChoices[index] || '';
    if (previous === attendance) {
      return;
    }

    this.attendanceChoices[index] = attendance;
    if (!previous && attendance) {
      this.pendingAttendanceCount--;
    } else if (previous && !attendance) {
      this.pendingAttendanceCount++;
    }
  }

  setAllAttendance(attendance: 'Asistió' | 'No asistió'): void {
    this.courseRows.forEach(({ index }) => {
      this.attendanceChoices[index] = attendance;
    });
    this.pendingAttendanceCount = 0;
  }

  saveAttendance(): void {
    if (!this.canSave || this.isSaving) {
      return;
    }

    const updates: AsistenciaUpdate[] = [];
    for (const { index } of this.courseRows) {
      const attendance = this.attendanceChoices[index];
      if (attendance !== 'Asistió' && attendance !== 'No asistió') {
        return;
      }
      updates.push({ row_index: index, attendance, notes: this.attendanceNotes[index] || '' });
    }

    this.isSaving = true;
    this.error = null;
    this.savedMessage = null;
    this.dataService.saveAttendance(this.selectedCourse, updates).subscribe({
      next: response => {
        if (!this.columns.includes(response.attendance_column)) {
          this.columns = [...this.columns, response.attendance_column];
        }
        if (!this.columns.includes(response.notes_column)) {
          this.columns = [...this.columns, response.notes_column];
        }
        updates.forEach(update => {
          this.tableData[update.row_index][response.attendance_column] = update.attendance;
          this.tableData[update.row_index][response.notes_column] = update.notes;
        });
        this.isSaving = false;
        void this.router.navigate(['/gestion-eventos']);
      },
      error: (err: any) => {
        console.error('Error guardando la asistencia:', err);
        this.error = err?.error?.detail || 'No se pudo guardar la asistencia.';
        this.isSaving = false;
      }
    });
  }

  getStudentName(row: Record<string, any>): string {
    return this.nameColumn ? String(row[this.nameColumn] ?? '').trim() : 'Sin nombre';
  }

  getRegistration(row: Record<string, any>): string {
    return this.registrationColumn ? String(row[this.registrationColumn] ?? '').trim() : '';
  }

  private updateVisibleRows(): void {
    const start = this.currentPage * this.pageSize;
    this.visibleCourseRows = this.courseRows.slice(start, start + this.pageSize);
  }

  private get attendanceColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'asistencia') || null;
  }

  private get notesColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'notas_asistencia') || null;
  }

  private findColumn(patterns: string[]): string | null {
    for (const pattern of patterns) {
      const match = this.columns.find(column => this.normalize(column).includes(this.normalize(pattern)));
      if (match) {
        return match;
      }
    }
    return null;
  }

  private normalize(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
