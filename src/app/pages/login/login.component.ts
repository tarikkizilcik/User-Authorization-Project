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

  async onSubmitLogin() {
    const { username } = this.loginForm.value;

    const isLoggedIn = await this.auth.login(username);

    if (isLoggedIn) {
      this.router.navigate(['/']).catch(console.error);
    }
  }
}
