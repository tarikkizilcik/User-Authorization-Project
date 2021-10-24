import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user$: Observable<User>;

  isLoginHidden: boolean = false;

  private subscription$?: Subscription;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = auth.user$;
  }

  ngOnInit(): void {
    this.subscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginHidden = event.url === '/login';
      });
  }

  ngOnDestroy(): void {
    this.subscription$?.unsubscribe();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['login']).catch(console.error);
  }

  onLogin() {
    this.router.navigate(['login']).catch(console.error);
  }
}
