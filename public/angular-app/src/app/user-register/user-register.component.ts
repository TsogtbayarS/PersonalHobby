import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDataService } from '../user-data.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  registerForm: FormGroup;
  registrationSuccessful: boolean = false;
  registrationFailed: boolean = false;
  successMessage: string = "";
  failedMessage: string = "";

  constructor(private fb: FormBuilder, private userService: UserDataService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  ngOnInit(): void {
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.userService.register(formData).subscribe({
        next: () => {
          this.registrationSuccessful = true;
          this.successMessage = environment.successMessage;
        },
        error: () => {
          this.registrationSuccessful = false;
          this.registrationFailed = true;
          this.successMessage = "";
          this.failedMessage = environment.failedMessage;

        }
      })
    }
  }

}
