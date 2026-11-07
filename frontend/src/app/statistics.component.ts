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

interface CareerProgram {
  name: string;
  code: string;
  area: string;
}

const CAREER_PROGRAMS: CareerProgram[] = [
  { name: 'Ingeniería en Tecnologías Computacionales', code: 'ITC', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Inteligencia Artificial', code: 'IIA', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Robótica y Sistemas Digitales', code: 'IRS', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Biomédica', code: 'IMD', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Biotecnología', code: 'IBT', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Mecatrónica', code: 'IMT', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Mecánica', code: 'IM', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Industrial y de Sistemas', code: 'IIS', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Civil', code: 'IC', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Innovación y Desarrollo', code: 'IID', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Alimentos', code: 'IAL', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Desarrollo de Sustentabilidad', code: 'IDS', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería Química', code: 'IQ', area: 'Ingeniería y Ciencias' },
  { name: 'Ingeniería en Nanotecnología', code: 'INA', area: 'Ingeniería y Ciencias' },
  { name: 'Licenciatura en Ciencia de Datos', code: 'LCD', area: 'Ingeniería y Ciencias' },
  { name: 'Licenciatura en Biociencias', code: 'LBC', area: 'Ingeniería y Ciencias' },
  { name: 'Licenciatura en Física Industrial', code: 'LFI', area: 'Ingeniería y Ciencias' },
  { name: 'Licenciatura en Estrategia y Transformación de Negocios', code: 'LAE', area: 'Negocios' },
  { name: 'Licenciatura en Inteligencia de Negocios', code: 'LIT', area: 'Negocios' },
  { name: 'Licenciatura en Negocios Internacionales', code: 'LIN', area: 'Negocios' },
  { name: 'Licenciatura en Finanzas', code: 'LAF', area: 'Negocios' },
  { name: 'Licenciatura en Mercadotecnia', code: 'LEM', area: 'Negocios' },
  { name: 'Licenciatura en Contaduría Pública y Finanzas', code: 'LCPF', area: 'Negocios' },
  { name: 'Licenciatura en Emprendimiento', code: 'LDE', area: 'Negocios' },
  { name: 'Arquitectura', code: 'ARQ', area: 'Arquitectura, Arte y Diseño' },
  { name: 'Licenciatura en Arte Digital', code: 'LAD', area: 'Arquitectura, Arte y Diseño' },
  { name: 'Licenciatura en Diseño', code: 'LDI', area: 'Arquitectura, Arte y Diseño' },
  { name: 'Licenciatura en Urbanismo', code: 'LUB', area: 'Arquitectura, Arte y Diseño' },
  { name: 'Licenciatura en Derecho', code: 'LED', area: 'Ciencias Sociales y Gobierno' },
  { name: 'Licenciatura en Relaciones Internacionales', code: 'LRI', area: 'Ciencias Sociales y Gobierno' },
  { name: 'Licenciatura en Economía', code: 'LEC', area: 'Ciencias Sociales y Gobierno' },
  { name: 'Licenciatura en Gobierno y Transformación Pública', code: 'LTP', area: 'Ciencias Sociales y Gobierno' },
  { name: 'Licenciatura en Comunicación', code: 'LC', area: 'Estudios Creativos y Humanidades' },
  { name: 'Licenciatura en Letras', code: 'LLE', area: 'Estudios Creativos y Humanidades' },
  { name: 'Licenciatura en Tecnología y Producción Musical', code: 'LTM', area: 'Estudios Creativos y Humanidades' },
  { name: 'Licenciatura en Periodismo', code: 'LPE', area: 'Estudios Creativos y Humanidades' },
  { name: 'Licenciatura en Innovación Educativa', code: 'LED', area: 'Estudios Creativos y Humanidades' },
  { name: 'Médico Cirujano', code: 'MC', area: 'Salud' },
  { name: 'Médico Cirujano Odontólogo', code: 'MO', area: 'Salud' },
  { name: 'Licenciatura en Nutrición y Bienestar Integral', code: 'LNB', area: 'Salud' },
  { name: 'Licenciatura en Psicología Clínica y de la Salud', code: 'LPS', area: 'Salud' }
];

const CAREER_AREAS = [...new Set(CAREER_PROGRAMS.map(program => program.area))];
const EMPTY_CAREER_STATS: CareerStat[] = [];

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
  expandedCareerAreas = new Set<string>();

  readonly monthFormatter = new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric' });
  private cachedCourses: string[] = [];
  private cachedAttendedTotal = 0;
  private cachedGlobalAttendanceRate = 0;
  private cachedAccumulatedTotal = 0;
  private cachedCareerStats: CareerStat[] = [];
  private cachedCareerDetails = new Map<string, CareerStat[]>();
  private cachedCareerRows = new Map<CareerProgram, Record<string, any>[]>();
  private cachedSelectedCourseStats = new Map<string, CourseMonthStat[]>();
  private cachedSelectedCourseMax = new Map<string, number>();
  private cachedRankingCourses: Record<'top' | 'bottom', { course: string; total: number }[]> = {
    top: [],
    bottom: []
  };
  private cachedRankingStats: Record<'top' | 'bottom', CourseMonthStat[]> = {
    top: [],
    bottom: []
  };
  private cachedRankingMax: Record<'top' | 'bottom', number> = {
    top: 1,
    bottom: 1
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getDatos().subscribe({
      next: (response: DatosResponse) => {
        this.tableData = response.data || [];
        this.columns = response.columns || [];
        this.cachedCourses = this.uniqueValues(this.courseColumn);
        this.cachedAttendedTotal = this.attendedRows(this.tableData).length;
        this.cachedGlobalAttendanceRate = this.percentage(this.cachedAttendedTotal, this.tableData.length);
        this.setInitialDateRange();
        this.selectedCourse = this.cachedCourses[0] || '';
        this.refreshStatistics();
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
  get participantTypeColumn(): string | null {
    return this.columns.find(column => this.normalize(column).includes('identifica mejor')) ||
      this.findColumn(['tipo de participante', 'tipo de persona', 'perfil del participante']);
  }
  get courses(): string[] { return this.cachedCourses; }
  get attendanceAvailable(): boolean { return !!this.attendanceColumn; }
  get dateRangeLabel(): string { return this.dateColumn || 'No detectada'; }

  get attendedTotal(): number { return this.cachedAttendedTotal; }
  get globalAttendanceRate(): number { return this.cachedGlobalAttendanceRate; }
  get selectedCourseStats(): CourseMonthStat[] { return this.cachedSelectedCourseStats.get(this.selectedCourse) || []; }
  get rankingStats(): CourseMonthStat[] { return this.cachedRankingStats[this.rankingMode]; }
  get rankingCourses(): { course: string; total: number }[] { return this.cachedRankingCourses[this.rankingMode]; }
  get accumulatedTotal(): number { return this.cachedAccumulatedTotal; }
  get careerStats(): CareerStat[] { return this.cachedCareerStats; }

  percentage(value: number, total: number): number { return total ? Math.round((value / total) * 1000) / 10 : 0; }
  maxValue(values: number[]): number { return Math.max(...values, 1); }
  selectedCourseBarWidth(total: number): number { return total / (this.cachedSelectedCourseMax.get(this.selectedCourse) || 1) * 100; }
  rankingBarWidth(total: number): number { return total / this.cachedRankingMax[this.rankingMode] * 100; }

  refreshStatistics(): void {
    const rows = this.filteredRowsByDate();
    const courseRows = new Map<string, Record<string, any>[]>();
    const monthlyStats = new Map<string, Map<string, CourseMonthStat>>();
    const careerRows = new Map<string, Record<string, any>[]>();
    const programRows = new Map<CareerProgram, Record<string, any>[]>();
    const courseTotals: { course: string; total: number }[] = [];

    CAREER_AREAS.forEach(area => careerRows.set(area, []));
    careerRows.set('Otras carreras', []);
    careerRows.set('Colaborador Externo Tec', []);

    rows.forEach(row => {
      const course = this.value(row, this.courseColumn);
      const rowsForCourse = courseRows.get(course) || [];
      rowsForCourse.push(row);
      courseRows.set(course, rowsForCourse);

      const career = this.value(row, this.careerColumn);
      const program = this.findCareerProgram(career);
      const isStudent = this.isStudent(row, program);
      const careerGroup = isStudent
        ? program?.area || 'Otras carreras'
        : 'Colaborador Externo Tec';
      careerRows.get(careerGroup)!.push(row);
      if (program && isStudent) {
        const rowsForProgram = programRows.get(program) || [];
        rowsForProgram.push(row);
        programRows.set(program, rowsForProgram);
      }

      const date = this.parseDate(this.dateColumn ? row[this.dateColumn] : null);
      if (!date) {
        return;
      }
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const courseMonths = monthlyStats.get(course) || new Map<string, CourseMonthStat>();
      const current = courseMonths.get(monthKey);
      courseMonths.set(monthKey, {
        course,
        month: this.monthFormatter.format(date),
        total: (current?.total || 0) + 1
      });
      monthlyStats.set(course, courseMonths);
    });

    this.cachedAccumulatedTotal = rows.length;
    this.cachedCareerStats = CAREER_AREAS.map(area =>
      this.createCareerStat(area, careerRows.get(area)!)
    );
    this.cachedCareerStats.push(
      ...['Otras carreras', 'Colaborador Externo Tec']
        .map(group => this.createCareerStat(group, careerRows.get(group)!))
        .filter(stat => stat.registered > 0)
    );
    this.cachedCareerRows = programRows;
    this.cachedCareerDetails.clear();

    this.cachedSelectedCourseStats.clear();
    this.cachedSelectedCourseMax.clear();
    this.cachedCourses.forEach(course => {
      const stats = [...(monthlyStats.get(course)?.values() || [])]
        .sort((a, b) => a.month.localeCompare(b.month));
      this.cachedSelectedCourseStats.set(course, stats);
      this.cachedSelectedCourseMax.set(course, this.maxValue(stats.map(stat => stat.total)));
      courseTotals.push({ course, total: courseRows.get(course)?.length || 0 });
    });

    const topCourses = [...courseTotals]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
    const bottomCourses = [...courseTotals]
      .sort((a, b) => a.total - b.total)
      .slice(0, 10);
    this.cachedRankingCourses = { top: topCourses, bottom: bottomCourses };
    this.cachedRankingStats = {
      top: topCourses.flatMap(item => this.getMonthlyStats(monthlyStats, item.course)),
      bottom: bottomCourses.flatMap(item => this.getMonthlyStats(monthlyStats, item.course))
    };
    this.cachedRankingMax = {
      top: this.maxValue(topCourses.map(item => item.total)),
      bottom: this.maxValue(bottomCourses.map(item => item.total))
    };
  }

  private filteredRowsByDate(): Record<string, any>[] {
    if (!this.dateColumn || (!this.fromDate && !this.toDate)) return this.tableData;
    const from = this.fromDate ? new Date(`${this.fromDate}T00:00:00`).getTime() : -Infinity;
    const to = this.toDate ? new Date(`${this.toDate}T23:59:59`).getTime() : Infinity;
    return this.tableData.filter(row => { const time = this.parseDate(row[this.dateColumn!])?.getTime() ?? NaN; return Number.isFinite(time) && time >= from && time <= to; });
  }

  private getMonthlyStats(
    monthlyStats: Map<string, Map<string, CourseMonthStat>>,
    course: string
  ): CourseMonthStat[] {
    return [...(monthlyStats.get(course)?.values() || [])]
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private attendedRows(rows: Record<string, any>[]): Record<string, any>[] {
    if (!this.attendanceColumn) return [];
    return rows.filter(row => /^(si|sí|yes|true|1|asistio|asistió|asistencia|presente|attended|presencial)$/i.test(this.normalize(String(row[this.attendanceColumn!] ?? '')).trim()));
  }

  private createCareerStat(career: string, rows: Record<string, any>[]): CareerStat {
    const attended = this.attendedRows(rows).length;
    return { career, registered: rows.length, attended, attendanceRate: this.percentage(attended, rows.length) };
  }

  isCareerArea(area: string): boolean {
    return CAREER_AREAS.includes(area);
  }

  toggleCareerArea(area: string): void {
    const expanded = new Set(this.expandedCareerAreas);
    if (expanded.has(area)) {
      expanded.delete(area);
    } else {
      if (!this.cachedCareerDetails.has(area)) {
        this.cachedCareerDetails.set(
          area,
          CAREER_PROGRAMS
            .filter(program => program.area === area)
            .map(program => this.createCareerStat(program.name, this.cachedCareerRows.get(program) || []))
        );
      }
      expanded.add(area);
    }
    this.expandedCareerAreas = expanded;
  }

  careersForArea(area: string): CareerStat[] {
    return this.expandedCareerAreas.has(area)
      ? this.cachedCareerDetails.get(area) || EMPTY_CAREER_STATS
      : EMPTY_CAREER_STATS;
  }

  private isStudent(row: Record<string, any>, program?: CareerProgram): boolean {
    return this.participantTypeColumn
      ? this.normalize(this.value(row, this.participantTypeColumn)).startsWith('estudiante')
      : !!program;
  }

  private findCareerProgram(career: string): CareerProgram | undefined {
    const normalizedCareer = this.normalize(career).replace(/\s*\([a-z]{2,4}\)\s*$/, '').trim();
    const matchingPrograms = CAREER_PROGRAMS.filter(program =>
      this.normalize(program.name) === normalizedCareer || this.normalize(program.code) === normalizedCareer
    );
    return matchingPrograms.length === 1 ? matchingPrograms[0] : undefined;
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
