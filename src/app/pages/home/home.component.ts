import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isUsersButtonVisible: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    const user = this.auth.getUser()!;
    this.isUsersButtonVisible = [Role.Admin, Role.SuperAdmin].includes(
      user.role,
    );
  }

  onHomeClicked = () => {
    this.router.navigate(['/users']).catch(console.error);
  };
}
