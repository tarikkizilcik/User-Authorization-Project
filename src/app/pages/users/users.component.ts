import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';

const permittedRoles = new Map([
  [Role.SuperAdmin, new Set([Role.SuperAdmin, Role.Admin, Role.User])],
  [Role.Admin, new Set([Role.User])],
]);

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  tableUsers: User[];

  createUserForm = new FormGroup({
    username: new FormControl(''),
    role: new FormControl(''),
  });

  isActionsVisible: boolean;

  isCreateFormVisible: boolean = false;

  private users!: User[];

  private readonly isPermittedUser: (user: User) => boolean;

  constructor(private auth: AuthService) {
    this.loadUsers();

    const user = auth.getUser()!;

    const isSuperAdmin = user.role === Role.SuperAdmin;
    this.isActionsVisible = isSuperAdmin;

    this.isPermittedUser = (u: User) => {
      const roles = permittedRoles.get(user.role)!;
      return roles.has(u.role);
    };

    this.tableUsers = isSuperAdmin
      ? [...this.users]
      : this.users.filter(this.isPermittedUser);
  }

  onClickCreateUser() {
    this.isCreateFormVisible = true;
  }

  onSubmitCreateUserForm() {
    const { username, role } = this.createUserForm.value;
    const user = { username, role };
    this.saveUser(user);
  }

  deleteUser(username: string) {
    const removeItem = (l: User[]) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      l.splice(
        l.findIndex(({ username: uname }) => uname === username),
        1,
      );

    const nRemoved = removeItem(this.tableUsers);
    if (nRemoved.length < 1) return;

    removeItem(this.users);
    this.saveUsers();
  }

  private loadUsers() {
    const loadedUsers = localStorage.getItem('users');
    if (loadedUsers == null) {
      this.users = [];
      return;
    }

    this.users = JSON.parse(loadedUsers) as User[];
  }

  private saveUser(user: User) {
    if (!this.isUsernameValid(user.username)) return;

    this.users.push(user);
    this.saveUsers();

    if (this.isPermittedUser(user)) {
      this.tableUsers.push(user);
    }
  }

  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private isUsernameValid(username: string) {
    return !this.users.some(({ username: uname }) => username === uname);
  }
}
