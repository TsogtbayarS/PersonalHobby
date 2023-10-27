import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFailed: boolean = false;
  failedMessage: string = "";
  constructor(private fb: FormBuilder, private userService: UserDataService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }
  get name(): string {
    if (this.userService.user !== null) {
      return this.userService.user?.username;
    }
    else {
      return "";
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {

    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.userService.login(formData).subscribe({
        next: (response) => {
          this.userService.setToken(response);
          this.loginFailed = false;
          this.failedMessage = "";
        },
        error: (err) => {
          this.failedMessage = err.error.message;
          this.loginFailed = true;

        },
        complete: () => {
        }
      })
    }
  }
  onLogout() {
    this.userService.clearToken();
  }
}
