import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly user?: User;

  constructor(public jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    if (token != null && !this.jwtHelper.isTokenExpired(token)) {
      this.user = jwtDecode<User>(token);
    }
  }

  isAuthenticated(): boolean {
    return this.user != null;
  }

  getUser(): User | undefined {
    return this.user;
  }
}
