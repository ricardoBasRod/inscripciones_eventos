import { Routes } from '@angular/router';
import { EventManagementComponent } from './event-management.component';
import { StatisticsComponent } from './statistics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'gestion-eventos', pathMatch: 'full' },
  { path: 'gestion-eventos', component: EventManagementComponent },
  { path: 'estadisticas', component: StatisticsComponent },
  { path: '**', redirectTo: 'gestion-eventos' }
];
