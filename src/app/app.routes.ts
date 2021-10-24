import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RoleGuardService } from './auth/role-guard.service';
import { UsersComponent } from './pages/users/users.component';
import { LoginGuardService } from './auth/login-guard.service';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [RoleGuardService],
    data: {
      expectedRoles: ['super-admin', 'admin'],
    },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
