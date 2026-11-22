import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';

interface DatosResponse {
  columns: string[];
  data: Record<string, any>[];
}

interface MonthlyCourseStat {
  course: string;
  registered: number;
  attended: number;
  absent: number;
}

interface MonthlyAttendanceStat {
  month: string;
  monthKey: string;
  registered: number;
  attended: number;
  absent: number;
  courses: MonthlyCourseStat[];
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
  fromDate = '';
  toDate = '';
  careerFromDate = '';
  careerToDate = '';
  showMonthlyBreakdown = false;
  expandedCareerAreas = new Set<string>();

  readonly monthFormatter = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' });
  private cachedPeriodAttended = 0;
  private cachedPeriodAbsent = 0;
  private cachedPeriodTotal = 0;
  private cachedCareerStats: CareerStat[] = [];
  private cachedCareerDetails = new Map<string, CareerStat[]>();
  private cachedCareerRows = new Map<CareerProgram, Record<string, any>[]>();
  private cachedMonthlyStats: MonthlyAttendanceStat[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getDatos().subscribe({
      next: (response: DatosResponse) => {
        this.tableData = response.data || [];
        this.columns = response.columns || [];
        this.setInitialDateRange();
        this.setInitialCareerDateRange();
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
  get dateColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'fecha_asistencia') || null;
  }
  get attendanceColumn(): string | null {
    return this.columns.find(column => this.normalize(column) === 'asistencia') ||
      this.columns.find(column => {
        const normalizedColumn = this.normalize(column);
        return normalizedColumn !== 'fecha_asistencia' &&
          normalizedColumn !== 'notas_asistencia' &&
          ['asistencia', 'asistio', 'presencia', 'attend', 'presente']
            .some(pattern => normalizedColumn.includes(pattern));
      }) || null;
  }
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
  get attendanceAvailable(): boolean { return !!this.attendanceColumn; }
  get dateRangeLabel(): string { return this.dateColumn || 'No detectada'; }
  get dateRangeInvalid(): boolean { return !!this.fromDate && !!this.toDate && this.fromDate > this.toDate; }
  get careerDateRangeInvalid(): boolean {
    return !!this.careerFromDate && !!this.careerToDate && this.careerFromDate > this.careerToDate;
  }

  get periodAttended(): number { return this.cachedPeriodAttended; }
  get periodAbsent(): number { return this.cachedPeriodAbsent; }
  get periodTotal(): number { return this.cachedPeriodTotal; }
  get monthlyStats(): MonthlyAttendanceStat[] { return this.cachedMonthlyStats; }
  get careerStats(): CareerStat[] { return this.cachedCareerStats; }

  percentage(value: number, total: number): number { return total ? Math.round((value / total) * 1000) / 10 : 0; }

  refreshStatistics(): void {
    const periodRows = this.filteredRowsByDate(this.fromDate, this.toDate);
    const careerRangeRows = this.filteredRowsByDate(this.careerFromDate, this.careerToDate);
    const monthlyStats = new Map<string, MonthlyAttendanceStat>();
    const careerRows = new Map<string, Record<string, any>[]>();
    const programRows = new Map<CareerProgram, Record<string, any>[]>();

    CAREER_AREAS.forEach(area => careerRows.set(area, []));
    careerRows.set('Otras carreras', []);
    careerRows.set('Colaborador Externo Tec', []);

    careerRangeRows.forEach(row => {
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
    });

    periodRows.forEach(row => {
      const course = this.value(row, this.courseColumn) || 'Sin curso';
      const date = this.parseDate(this.dateColumn ? row[this.dateColumn] : null);
      if (!date) {
        return;
      }
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthStat = monthlyStats.get(monthKey) || {
        monthKey,
        month: this.monthFormatter.format(date),
        registered: 0,
        attended: 0,
        absent: 0,
        courses: []
      };
      let courseStat = monthStat.courses.find(item => item.course === course);
      if (!courseStat) {
        courseStat = { course, registered: 0, attended: 0, absent: 0 };
        monthStat.courses.push(courseStat);
      }

      const attended = this.isAttended(row);
      const absent = this.isAbsent(row);
      monthStat.registered++;
      monthStat.attended += attended ? 1 : 0;
      monthStat.absent += absent ? 1 : 0;
      courseStat.registered++;
      courseStat.attended += attended ? 1 : 0;
      courseStat.absent += absent ? 1 : 0;
      monthlyStats.set(monthKey, monthStat);
    });

    this.cachedPeriodTotal = periodRows.length;
    this.cachedPeriodAttended = this.attendedRows(periodRows).length;
    this.cachedPeriodAbsent = periodRows.filter(row => this.isAbsent(row)).length;
    this.cachedMonthlyStats = [...monthlyStats.values()]
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
    this.cachedMonthlyStats.forEach(month =>
      month.courses.sort((a, b) => a.course.localeCompare(b.course, 'es'))
    );
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
    this.expandedCareerAreas.forEach(area => this.cacheCareerDetails(area));
  }

  private filteredRowsByDate(fromDate: string, toDate: string): Record<string, any>[] {
    if (!this.dateColumn) return [];
    if (fromDate && toDate && fromDate > toDate) return [];
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : -Infinity;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : Infinity;
    return this.tableData.filter(row => { const time = this.parseDate(row[this.dateColumn!])?.getTime() ?? NaN; return Number.isFinite(time) && time >= from && time <= to; });
  }

  private attendedRows(rows: Record<string, any>[]): Record<string, any>[] {
    return this.attendanceColumn ? rows.filter(row => this.isAttended(row)) : [];
  }

  private isAttended(row: Record<string, any>): boolean {
    return !!this.attendanceColumn &&
      /^(si|yes|true|1|asistio|asistencia|presente|attended|presencial)$/.test(
        this.normalize(String(row[this.attendanceColumn] ?? '')).trim()
      );
  }

  private isAbsent(row: Record<string, any>): boolean {
    return !!this.attendanceColumn &&
      /^(no|false|0|no asistio|ausente|absent)$/.test(
        this.normalize(String(row[this.attendanceColumn] ?? '')).trim()
      );
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
        this.cacheCareerDetails(area);
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

  private value(row: Record<string, any>, column: string | null): string {
    return this.repairEncoding(String(column ? row[column] ?? '' : '').trim());
  }
  private percentageDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private setInitialDateRange(): void {
    if (!this.dateColumn) return;
    const dates = this.tableData
      .map(row => this.parseDate(row[this.dateColumn!]))
      .filter((date): date is Date => !!date)
      .sort((a, b) => a.getTime() - b.getTime());
    if (dates.length) {
      this.fromDate = this.percentageDate(dates[0]);
      this.toDate = this.percentageDate(dates[dates.length - 1]);
    }
  }

  private setInitialCareerDateRange(): void {
    const year = new Date().getFullYear();
    this.careerFromDate = `${year}-01-01`;
    this.careerToDate = `${year}-12-31`;
  }

  private parseDate(value: any): Date | null {
    if (!value) return null;
    const text = String(value).trim();
    const isoDate = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoDate) {
      return this.createValidDate(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]));
    }
    const localDate = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (localDate) {
      const year = Number(localDate[3].length === 2 ? `20${localDate[3]}` : localDate[3]);
      return this.createValidDate(year, Number(localDate[2]), Number(localDate[1]));
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private createValidDate(year: number, month: number, day: number): Date | null {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
      ? date
      : null;
  }

  private cacheCareerDetails(area: string): void {
    this.cachedCareerDetails.set(
      area,
      CAREER_PROGRAMS
        .filter(program => program.area === area)
        .map(program => this.createCareerStat(program.name, this.cachedCareerRows.get(program) || []))
    );
  }

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
