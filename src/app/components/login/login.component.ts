import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule,ReactiveFormsModule  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  private readonly secretKey = "MyMovieApp123!";

  loginFormData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  get email() { return this.loginFormData.controls['email']; }
  get password() { return this.loginFormData.controls['password']; }

  constructor(private authService: AuthService) { }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  login() {
    if (this.loginFormData.invalid) return;

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      Swal.fire('Error', 'No account found. Please sign up first.', 'error');
      return;
    }

    const userData = JSON.parse(storedUser);
    const decryptedPassword = this.decryptData(userData.password);

    if (
      userData.email === this.loginFormData.value.email &&
      decryptedPassword === this.loginFormData.value.password
    ) {
      this.authService.login();
      this.loginSuccess.emit();
      Swal.fire('Success', 'Logged in successfully!', 'success');
    } else {
      Swal.fire('Error', 'Invalid email or password', 'error');
    }
  }
}