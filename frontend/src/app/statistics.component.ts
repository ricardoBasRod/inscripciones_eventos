import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';

interface DatosResponse {
  columns: string[];
  data: Record<string, any>[];
}

interface CourseMonthStat {
  course: string;
  month: string;
  total: number;
}

interface CareerStat {
  career: string;
  registered: number;
  attended: number;
  attendanceRate: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  isLoading = true;
  error: string | null = null;
  tableData: Record<string, any>[] = [];
  columns: string[] = [];
  selectedCourse = '';
  rankingMode: 'top' | 'bottom' = 'top';
  fromDate = '';
  toDate = '';

  readonly monthFormatter = new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' });

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getDatos().subscribe({
      next: (response: DatosResponse) => {
        this.tableData = response.data || [];
        this.columns = response.columns || [];
        this.setInitialDateRange();
        this.selectedCourse = this.courses[0] || '';
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error cargando estadísticas:', err);
        this.error = 'No se pudieron cargar las estadísticas. Verifica que el backend este corriendo.';
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

    return inscriptionColumn || this.findColumn(['curso taller o webinar', 'curso taller webinar', 'curso', 'taller', 'webinar']);
  }
  get dateColumn(): string | null { return this.findColumn(['completion time', 'fecha', 'date', 'timestamp']); }
  get attendanceColumn(): string | null { return this.findColumn(['asistencia', 'asistio', 'asistió', 'presencia', 'attend', 'presente']); }
  get careerColumn(): string | null {
    const careerQuestion = this.columns.find(column => {
      const normalizedColumn = this.normalize(column);
      return normalizedColumn.includes('carrera') && normalizedColumn.includes('apoyas');
    });

    return careerQuestion || this.findColumn(['carrera', 'carreras', 'programa academico', 'programa académico']);
  }
  get courses(): string[] { return this.uniqueValues(this.courseColumn); }
  get attendanceAvailable(): boolean { return !!this.attendanceColumn; }
  get dateRangeLabel(): string { return this.dateColumn || 'No detectada'; }

  get attendedTotal(): number { return this.attendedRows(this.tableData).length; }
  get globalAttendanceRate(): number { return this.tableData.length ? this.percentage(this.attendedTotal, this.tableData.length) : 0; }

  get selectedCourseStats(): CourseMonthStat[] {
    const rows = this.filteredRowsByDate().filter(row => this.value(row, this.courseColumn) === this.selectedCourse);
    return this.monthStats(rows);
  }

  get rankingStats(): CourseMonthStat[] {
    const rows = this.filteredRowsByDate();
    const totals = this.courses.map(course => ({ course, total: rows.filter(row => this.value(row, this.courseColumn) === course).length }));
    const selected = totals.sort((a, b) => this.rankingMode === 'top' ? b.total - a.total : a.total - b.total).slice(0, 10);
    return selected.flatMap(item => this.monthStats(rows.filter(row => this.value(row, this.courseColumn) === item.course)));
  }

  get rankingCourses(): { course: string; total: number }[] {
    const rows = this.filteredRowsByDate();
    return this.courses.map(course => ({ course, total: rows.filter(row => this.value(row, this.courseColumn) === course).length }))
      .sort((a, b) => this.rankingMode === 'top' ? b.total - a.total : a.total - b.total).slice(0, 10);
  }

  get accumulatedTotal(): number { return this.filteredRowsByDate().length; }

  get careerStats(): CareerStat[] {
    const groups = new Map<string, Record<string, any>[]>();
    this.filteredRowsByDate().forEach(row => {
      const career = this.value(row, this.careerColumn) || 'Sin carrera';
      groups.set(career, [...(groups.get(career) || []), row]);
    });
    return [...groups.entries()].map(([career, rows]) => {
      const attended = this.attendedRows(rows).length;
      return { career, registered: rows.length, attended, attendanceRate: this.percentage(attended, rows.length) };
    }).sort((a, b) => b.registered - a.registered);
  }

  percentage(value: number, total: number): number { return total ? Math.round((value / total) * 1000) / 10 : 0; }
  maxValue(values: number[]): number { return Math.max(...values, 1); }
  selectedCourseBarWidth(total: number): number { return total / this.maxValue(this.selectedCourseStats.map(stat => stat.total)) * 100; }
  rankingBarWidth(total: number): number { return total / this.maxValue(this.rankingCourses.map(stat => stat.total)) * 100; }

  private filteredRowsByDate(): Record<string, any>[] {
    if (!this.dateColumn || (!this.fromDate && !this.toDate)) return this.tableData;
    const from = this.fromDate ? new Date(`${this.fromDate}T00:00:00`).getTime() : -Infinity;
    const to = this.toDate ? new Date(`${this.toDate}T23:59:59`).getTime() : Infinity;
    return this.tableData.filter(row => { const time = this.parseDate(row[this.dateColumn!])?.getTime() ?? NaN; return Number.isFinite(time) && time >= from && time <= to; });
  }

  private monthStats(rows: Record<string, any>[]): CourseMonthStat[] {
    const groups = new Map<string, CourseMonthStat>();
    rows.forEach(row => { const date = this.parseDate(row[this.dateColumn!]); if (!date) return; const month = this.monthFormatter.format(date); const key = `${this.value(row, this.courseColumn)}|${date.getFullYear()}-${date.getMonth()}`; const current = groups.get(key); groups.set(key, { course: this.value(row, this.courseColumn), month, total: (current?.total || 0) + 1 }); });
    return [...groups.values()].sort((a, b) => a.month.localeCompare(b.month));
  }

  private attendedRows(rows: Record<string, any>[]): Record<string, any>[] {
    if (!this.attendanceColumn) return [];
    return rows.filter(row => /^(si|sí|yes|true|1|asistio|asistió|asistencia|presente|attended|presencial)$/i.test(this.normalize(String(row[this.attendanceColumn!] ?? '')).trim()));
  }

  private uniqueValues(column: string | null): string[] { return column ? [...new Set(this.tableData.map(row => this.value(row, column)).filter(Boolean))].sort() : []; }
  private value(row: Record<string, any>, column: string | null): string {
    return this.repairEncoding(String(column ? row[column] ?? '' : '').trim());
  }
  private percentageDate(date: Date): string { return date.toISOString().slice(0, 10); }
  private setInitialDateRange(): void { const dates = this.tableData.map(row => this.parseDate(row[this.dateColumn!])).filter((date): date is Date => !!date).sort((a, b) => a.getTime() - b.getTime()); if (dates.length) { this.fromDate = this.percentageDate(dates[0]); this.toDate = this.percentageDate(dates[dates.length - 1]); } }
  private parseDate(value: any): Date | null { if (!value) return null; const date = new Date(value); if (!Number.isNaN(date.getTime())) return date; const match = String(value).match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/); if (!match) return null; const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3]); const parsed = new Date(year, Number(match[2]) - 1, Number(match[1])); return Number.isNaN(parsed.getTime()) ? null : parsed; }

  private findColumn(patterns: string[]): string | null {
    return this.columns.find(column => {
      const normalizedColumn = this.normalize(column);
      return patterns.some(pattern => normalizedColumn.includes(this.normalize(pattern)));
    }) || null;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[¿?.,:;]/g, ' ')
      .replace(/[\u00a0\u2000-\u200a]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private repairEncoding(value: string): string {
    if (!/[ÃÂ]/.test(value)) {
      return value;
    }

    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
  }
}
