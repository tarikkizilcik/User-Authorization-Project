import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwtDecode from 'jwt-decode';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user.model';

const dummyToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MzUwNzIxNjgsImV4cCI6MTY2NjYwODE5MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiU3VwZXIgQWRtaW4iLCJyb2xlIjoic3VwZXItYWRtaW4ifQ.CHbD7tx5TlT3PM59fRyHZH4m-GpmEHccHie4yr36Pd8';
const superAdminUsername = 'root';

const decodeToken = (token: string): User => jwtDecode<User>(token);

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user?: User;

  private readonly userSubject: ReplaySubject<User> = new ReplaySubject<User>(
    1,
  );

  readonly user$: Observable<User> = this.userSubject;

  constructor(public jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    if (token != null && !this.jwtHelper.isTokenExpired(token)) {
      this.user = decodeToken(token);
      this.userSubject.next(this.user);
    }
  }

  isAuthenticated(): boolean {
    return this.user != null;
  }

  getUser(): User | undefined {
    return this.user;
  }

  login(username: string): boolean {
    let user: User;

    if (username === superAdminUsername) {
      user = decodeToken(dummyToken);
    } else {
      const usersItem = localStorage.getItem('users');
      if (usersItem == null) return false;

      const users = JSON.parse(usersItem) as User[];
      const foundUser = users.find(({ username: uname }) => uname === username);

      if (foundUser == null) return false;

      user = foundUser;
    }

    // TODO Get the real JWT
    localStorage.setItem('token', dummyToken);

    this.user = user;
    this.userSubject.next(user);

    return true;
  }

  logout(): boolean {
    if (this.user == null) return false;

    this.user = undefined;
    this.userSubject.next(undefined);

    localStorage.removeItem('token');

    return true;
  }
}
