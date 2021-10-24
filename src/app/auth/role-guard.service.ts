import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data.expectedRoles as string[];

    const token = localStorage.getItem('token');

    const navigateLogin = () => {
      this.router.navigate(['login']).catch(console.error);
    };

    if (token == null || !this.auth.isAuthenticated()) {
      navigateLogin();
      return false;
    }

    const { role } = jwtDecode<User>(token);

    if (!expectedRoles.includes(role)) {
      navigateLogin();
      return false;
    }

    return true;
  }
}
