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

interface CourseSession {
  date: string;
  time: string;
  label: string;
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
  sessionSearchTerm = '';
  selectedSession: CourseSession | null = null;
  showSessionSuggestions = false;
  readonly pageSize = 50;
  availableCourses: string[] = [];
  courseSuggestions: string[] = [];
  matchingCourseCount = 0;
  availableSessions: CourseSession[] = [];
  sessionSuggestions: CourseSession[] = [];
  matchingSessionCount = 0;
  courseRows: CourseRow[] = [];
  visibleCourseRows: CourseRow[] = [];
  currentPage = 0;
  pendingAttendanceCount = 0;
  attendanceChoices: Record<number, '' | 'Asistió' | 'No asistió'> = {};
  attendanceNotes: Record<number, string> = {};
  attendanceDate = this.getTodayDate();

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

  get hasSessionColumns(): boolean {
    return !!this.sessionDateColumn && !!this.sessionTimeColumn;
  }

  private getAvailableCourses(): string[] {
    if (!this.courseColumn) {
      return [];
    }
    return [...new Set(this.tableData.map(row => String(row[this.courseColumn!] ?? '').trim()).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es'));
  }

  private getAvailableSessions(course: string): CourseSession[] {
    const courseColumn = this.courseColumn;
    const dateColumn = this.sessionDateColumn;
    const timeColumn = this.sessionTimeColumn;
    if (!courseColumn || !dateColumn || !timeColumn) {
      return [];
    }

    const sessions = new Map<string, CourseSession>();
    this.tableData.forEach(row => {
      if (String(row[courseColumn] ?? '').trim() !== course) {
        return;
      }

      const date = this.normalizeSessionDate(row[dateColumn]);
      const time = this.normalizeSessionTime(row[timeColumn]);
      if (!date || !time) {
        return;
      }

      const key = `${date} ${time}`;
      if (!sessions.has(key)) {
        sessions.set(key, { date, time, label: this.formatSessionLabel(date, time) });
      }
    });

    return [...sessions.values()].sort((a, b) =>
      `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
    );
  }

  refreshCourseSuggestions(): void {
    const term = this.normalize(this.courseSearchTerm.trim());
    const matches = this.availableCourses.filter(course => !term || this.normalize(course).includes(term));
    this.matchingCourseCount = matches.length;
    this.courseSuggestions = matches.slice(0, 30);
  }

  refreshSessionSuggestions(): void {
    const term = this.normalize(this.sessionSearchTerm.trim());
    const matches = this.availableSessions.filter(session =>
      !term || this.normalize(`${session.label} ${session.date} ${session.time}`).includes(term)
    );
    this.matchingSessionCount = matches.length;
    this.sessionSuggestions = matches.slice(0, 30);
  }

  get canSave(): boolean {
    return !!this.selectedSession &&
      this.courseRows.length > 0 &&
      this.pendingAttendanceCount === 0 &&
      !!this.attendanceDate;
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
    this.availableSessions = [];
    this.sessionSuggestions = [];
    this.sessionSearchTerm = '';
    this.selectedSession = null;
    this.showSessionSuggestions = false;
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
    this.availableSessions = this.getAvailableSessions(course);
    this.sessionSearchTerm = '';
    this.selectedSession = null;
    this.showSessionSuggestions = true;
    this.refreshSessionSuggestions();
    this.courseRows = [];
    this.visibleCourseRows = [];
    this.pendingAttendanceCount = 0;
    this.attendanceChoices = {};
    this.attendanceNotes = {};
    this.currentPage = 0;
  }

  onSessionSearchChange(): void {
    this.selectedSession = null;
    this.courseRows = [];
    this.visibleCourseRows = [];
    this.currentPage = 0;
    this.pendingAttendanceCount = 0;
    this.attendanceChoices = {};
    this.attendanceNotes = {};
    this.savedMessage = null;
    this.error = null;
    this.showSessionSuggestions = true;
    this.refreshSessionSuggestions();
  }

  chooseSession(session: CourseSession): void {
    this.selectedSession = session;
    this.sessionSearchTerm = session.label;
    this.showSessionSuggestions = false;
    this.savedMessage = null;
    this.error = null;

    const courseColumn = this.courseColumn;
    const dateColumn = this.sessionDateColumn;
    const timeColumn = this.sessionTimeColumn;
    this.courseRows = courseColumn && dateColumn && timeColumn
      ? this.tableData.reduce<CourseRow[]>((rows, row, index) => {
        const sameCourse = String(row[courseColumn] ?? '').trim() === this.selectedCourse;
        const sameDate = this.normalizeSessionDate(row[dateColumn]) === session.date;
        const sameTime = this.normalizeSessionTime(row[timeColumn]) === session.time;
        if (sameCourse && sameDate && sameTime) {
          rows.push({ row, index });
        }
        return rows;
      }, [])
      : [];

    this.attendanceDate = this.getExistingAttendanceDate(this.courseRows) || session.date;
    this.courseRows.sort((a, b) =>
      this.getStudentName(a.row).localeCompare(this.getStudentName(b.row), 'es', { sensitivity: 'base' })
    );
    this.loadAttendanceChoices();
  }

  private loadAttendanceChoices(): void {
    const attendanceColumn = this.attendanceColumn;
    const notesColumn = this.notesColumn;
    this.attendanceChoices = {};
    this.attendanceNotes = {};
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
    if (!this.canSave || !this.selectedSession || this.isSaving) {
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
    const attendanceDate = this.attendanceDate;
    const selectedSession = this.selectedSession;
    const selectedCourse = this.selectedCourse;
    this.dataService.saveAttendance(
      selectedCourse,
      attendanceDate,
      selectedSession.date,
      selectedSession.time,
      updates
    ).subscribe({
      next: response => {
        if (!this.columns.includes(response.attendance_column)) {
          this.columns = [...this.columns, response.attendance_column];
        }
        if (!this.columns.includes(response.date_column)) {
          this.columns = [...this.columns, response.date_column];
        }
        if (!this.columns.includes(response.notes_column)) {
          this.columns = [...this.columns, response.notes_column];
        }
        updates.forEach(update => {
          this.tableData[update.row_index][response.attendance_column] = update.attendance;
          this.tableData[update.row_index][response.date_column] = attendanceDate;
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

  private normalizeSessionDate(value: any): string | null {
    const match = String(value ?? '').trim().match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/);
    if (!match) {
      return null;
    }

    const [, year, month, day] = match;
    const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (
      parsedDate.getUTCFullYear() !== Number(year) ||
      parsedDate.getUTCMonth() !== Number(month) - 1 ||
      parsedDate.getUTCDate() !== Number(day)
    ) {
      return null;
    }
    return `${year}-${month}-${day}`;
  }

  private normalizeSessionTime(value: any): string | null {
    const text = String(value ?? '').trim().toLowerCase().replace(/[.\s]/g, '');
    const meridiemMatch = text.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
    if (meridiemMatch) {
      let hour = Number(meridiemMatch[1]);
      const minute = Number(meridiemMatch[2]);
      if (hour < 1 || hour > 12 || minute > 59) {
        return null;
      }
      if (meridiemMatch[3] === 'pm' && hour !== 12) {
        hour += 12;
      } else if (meridiemMatch[3] === 'am' && hour === 12) {
        hour = 0;
      }
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    const twentyFourHourMatch = text.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (!twentyFourHourMatch) {
      return null;
    }
    const hour = Number(twentyFourHourMatch[1]);
    const minute = Number(twentyFourHourMatch[2]);
    if (hour > 23 || minute > 59) {
      return null;
    }
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  private formatSessionLabel(date: string, time: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const dateLabel = new Intl.DateTimeFormat('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(year, month - 1, day)));
    const timeLabel = new Intl.DateTimeFormat('es-MX', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(2026, 0, 1, hour, minute)));
    return `${dateLabel.charAt(0).toLocaleUpperCase('es-MX')}${dateLabel.slice(1)} - ${timeLabel}`;
  }

  private getTodayDate(): string {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
  }

  private getExistingAttendanceDate(rows: CourseRow[]): string | null {
    const dateColumn = this.columns.find(column => this.normalize(column) === 'fecha_asistencia');
    if (!dateColumn) {
      return null;
    }

    for (const { row } of rows) {
      const value = String(row[dateColumn] ?? '').trim();
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/);
      if (!match) {
        continue;
      }

      const [, year, month, day] = match;
      const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (
        parsedDate.getUTCFullYear() === Number(year) &&
        parsedDate.getUTCMonth() === Number(month) - 1 &&
        parsedDate.getUTCDate() === Number(day)
      ) {
        return `${year}-${month}-${day}`;
      }
    }

    return null;
  }

  private updateVisibleRows(): void {
    const start = this.currentPage * this.pageSize;
    this.visibleCourseRows = this.courseRows.slice(start, start + this.pageSize);
  }

  private get attendanceColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'asistencia') || null;
  }

  private get sessionDateColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'fecha del curso') || null;
  }

  private get sessionTimeColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'hora del curso') || null;
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
