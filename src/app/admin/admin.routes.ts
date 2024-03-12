import { Routes } from '@angular/router';
import {
  AdminRouterComponent, DashboardComponent, DriversComponent,
  GasComponent, LogComponent, MaintenanceComponent, VehiclesComponent
} from './containers';

export const adminRoutes: Routes = [{
  path: '',
  component: AdminRouterComponent,
  children: [
    {
      path: 'dashboard',
      title: 'Inicio',
      component: DashboardComponent
    },
    {
      path: 'drivers',
      title: 'Conductores',
      component: DriversComponent
    },
    {
      path: 'gas',
      title: 'Combustible',
      component: GasComponent
    },
    {
      path: 'vehicles',
      title: 'Vehículos',
      component: VehiclesComponent
    },
    {
      path: 'log',
      title: 'Bitácora',
      component: LogComponent
    },
    {
      path: 'maintenance',
      title: 'Mantenimiento',
      component: MaintenanceComponent
    },
  ]
}];
