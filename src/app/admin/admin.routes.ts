import { Routes } from '@angular/router';
import {
  AdminRouterComponent, DashboardComponent, DriversComponent,
  LogComponent, MaintenanceComponent, RequestsComponent,
  VehiclesComponent, VehicleComponent,
  RequestComponent,
  LogsComponent,
  CarLogsComponent
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
      path: 'car-logs',
      title: 'Listado Bitácoras',
      component: CarLogsComponent
    },
    {
      path: 'logs/:vehicleId',
      title: 'Bitácoras',
      component: LogsComponent
    },
    {
      path: 'log/:id',
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
    },
    {
      path: 'request/:id',
      title: 'Solicitud',
      component: RequestComponent
    }
  ]
}];
