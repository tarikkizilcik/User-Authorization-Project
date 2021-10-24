import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl(''),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSubmitLogin() {
    const { username } = this.loginForm.value;

    this.auth.login(username);

    this.router.navigate(['/']).catch(console.error);
  }
}
