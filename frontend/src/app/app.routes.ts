import { Routes } from '@angular/router';
import { EventManagementComponent } from './event-management.component';
import { StatisticsComponent } from './statistics.component';
import { AttendanceComponent } from './attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'gestion-eventos', pathMatch: 'full' },
  { path: 'gestion-eventos', component: EventManagementComponent },
  { path: 'toma-asistencia', component: AttendanceComponent },
  { path: 'estadisticas', component: StatisticsComponent },
  { path: '**', redirectTo: 'gestion-eventos' }
];
