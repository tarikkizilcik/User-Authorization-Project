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

  selectedRole: Role = Role.User;

  permittedRoles: Role[];

  readonly roles: Role[];

  private users!: User[];

  private readonly isPermittedUser: (user: User) => boolean;

  getRoleName = (role: string): string =>
    Object.entries(Role).find(([, val]) => val === role)![0];

  constructor(private auth: AuthService) {
    this.loadUsers();

    this.roles = Object.values(Role);

    const user = auth.getUser()!;

    this.isActionsVisible = [Role.SuperAdmin, Role.Admin].includes(user.role);

    this.isPermittedUser = (u: User) => {
      const roles = permittedRoles.get(user.role)!;
      return roles.has(u.role);
    };

    this.permittedRoles = [...permittedRoles.get(user.role)!];

    this.tableUsers =
      user.role === Role.SuperAdmin
        ? [...this.users]
        : this.users.filter(this.isPermittedUser);
  }

  onClickCreateUser() {
    this.isCreateFormVisible = true;
  }

  onClickRole(value: string) {
    this.selectedRole = Object.values(Role).find((role) => role === value)!;
  }

  onSubmitCreateUserForm() {
    const { username } = this.createUserForm.value;
    const user = { username, role: this.selectedRole as Role };
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

  editUser() {}

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
