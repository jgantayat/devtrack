import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout')
      .then(m => m.MainLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard-page/dashboard-page').then(m => m.DashboardPage) },
      { path: 'tasks', loadComponent: () => import('./features/tasks/tasks-page/tasks-page').then(m => m.TasksPage) },
      { path: 'goals', loadComponent: () => import('./features/goals/goals-page/goals-page').then(m => m.GoalsPage) },
      { path: 'log', loadComponent: () => import('./features/log/log-page/log-page').then(m => m.LogPage) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings-page/settings-page').then(m => m.SettingsPage) },
        {
        path: '**',
        loadComponent: () => import('../app/shared/components/not-found/not-found/not-found')
          .then(m => m.NotFound)
      }
    ]
  }
];
