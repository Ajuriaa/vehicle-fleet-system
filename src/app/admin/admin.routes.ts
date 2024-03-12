import { Routes } from '@angular/router';
import { AdminRouterComponent, DashboardComponent } from './containers';

export const adminRoutes: Routes = [{
  path: '',
  component: AdminRouterComponent,
  children: [
    {
      path: 'home',
      title: 'Inicio',
      component: DashboardComponent
    },
  ]
}];
