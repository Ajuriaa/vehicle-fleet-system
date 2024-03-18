import { Routes } from '@angular/router';
import {
  AdminRouterComponent, DashboardComponent, DriversComponent,
  LogComponent, MaintenanceComponent, RequestsComponent,
  VehiclesComponent, VehicleComponent
} from './containers';
import { DriverComponent } from './containers/driver/driver.component';

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
    {
      path: 'requests',
      title: 'Solicitudes',
      component: RequestsComponent
    },
    {
      path: 'vehicle/:id',
      title: 'Vehículo',
      component: VehicleComponent
    },
    {
      path: 'driver/:id',
      title: 'Conductor',
      component: DriverComponent
    }
  ]
}];
