import { Routes } from '@angular/router';
import { LoginComponent } from './auth';
import { CreateLogComponent } from './admin/components';

export const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  { path: 'test', title: 'Login', component: CreateLogComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
];
