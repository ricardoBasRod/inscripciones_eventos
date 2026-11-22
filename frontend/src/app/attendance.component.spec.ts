import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { DataService } from './services/data.service';

describe('AttendanceComponent sessions', () => {
  let fixture: ComponentFixture<AttendanceComponent>;
  let component: AttendanceComponent;

  const course = 'SW0002 - WEBINAR Solidworks diseño básico CSWA';
  const columns = [
    'En qué curso, taller o webinar te quieres inscribir?',
    'Fecha del curso',
    'Hora del curso',
    'Nombre completo del estudiante o colaborador del Tec',
    'Número de matrícula o nómina',
    'Asistencia',
    'notas_asistencia',
    'fecha_asistencia'
  ];
  const data = [
    {
      [columns[0]]: course,
      [columns[1]]: '2026-04-15',
      [columns[2]]: '15:00',
      [columns[3]]: 'Ana Ejemplo',
      [columns[4]]: 'M-001'
    },
    {
      [columns[0]]: course,
      [columns[1]]: '2026-04-15',
      [columns[2]]: '15:00',
      [columns[3]]: 'Beatriz Ejemplo',
      [columns[4]]: 'M-002'
    },
    {
      [columns[0]]: course,
      [columns[1]]: '2026-04-22',
      [columns[2]]: '16:00',
      [columns[3]]: 'Carlos Ejemplo',
      [columns[4]]: 'M-003'
    },
    {
      [columns[0]]: 'Otro curso',
      [columns[1]]: '2026-04-15',
      [columns[2]]: '15:00',
      [columns[3]]: 'Diana Ejemplo',
      [columns[4]]: 'M-004'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceComponent],
      providers: [
        { provide: DataService, useValue: { getDatos: () => of({ columns, data }) } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('requires selecting a course and session before showing that session roster', () => {
    const courseInput = fixture.nativeElement.querySelector('#course-search') as HTMLInputElement;
    courseInput.value = course;
    courseInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const courseOption = fixture.nativeElement.querySelector('#course-suggestions button') as HTMLButtonElement;
    expect(courseOption.textContent).toContain(course);
    courseOption.click();
    fixture.detectChanges();

    expect(component.selectedCourse).toBe(course);
    expect(component.availableSessions.length).toBe(2);
    expect(component.courseRows.length).toBe(0);

    const sessionInput = fixture.nativeElement.querySelector('#session-search') as HTMLInputElement;
    sessionInput.value = '2026-04-22';
    sessionInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.sessionSuggestions.length).toBe(1);

    const sessionOption = fixture.nativeElement.querySelector('#session-suggestions button') as HTMLButtonElement;
    expect(sessionOption.textContent).toContain('22 de abril');
    sessionOption.click();
    fixture.detectChanges();

    expect(component.selectedSession?.date).toBe('2026-04-22');
    expect(component.selectedSession?.time).toBe('16:00');
    expect(component.courseRows.map(item => item.index)).toEqual([2]);
    expect(component.attendanceDate).toBe('2026-04-22');
  });
});
