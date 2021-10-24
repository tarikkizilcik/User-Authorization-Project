import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { AuthService } from './auth.service';

type User = {
  role: string;
};

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data.expectedRole as string;

    const token = localStorage.getItem('token');

    if (
      token == null ||
      !this.auth.isAuthenticated() ||
      jwtDecode<User>(token).role !== expectedRole
    ) {
      this.router.navigate(['login']).catch(console.error);
      return false;
    }

    return true;
  }
}
