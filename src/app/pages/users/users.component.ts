import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

type User = {
  username: string;
  role: string;
};

const permittedRoles = ['user'];

const isPermittedUser = (user: User) => permittedRoles.includes(user.role);

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

  constructor(private auth: AuthService) {
    this.loadUsers();

    const user = auth.getUser();

    const isSuperAdmin = user?.role === 'super-admin';
    this.isActionsVisible = isSuperAdmin;

    this.tableUsers = isSuperAdmin
      ? [...this.users]
      : this.users.filter(isPermittedUser);
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

    if (isPermittedUser(user)) {
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
