import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['USER'] },
  },
  {
    path: 'movies/:id',  
    component: MovieDetailsComponent,
    canActivate: [authGuard],
    data: { roles: ['USER' , 'ADMIN'] } 
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
