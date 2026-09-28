import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-overview.component').then(
        (m) => m.DashboardOverviewComponent
      ),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/patients-page.component').then(
        (m) => m.PatientsPageComponent
      ),
  },
  {
    path: 'components',
    loadComponent: () =>
      import('./features/components-showcase/components-showcase.component').then(
        (m) => m.ComponentsShowcaseComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
