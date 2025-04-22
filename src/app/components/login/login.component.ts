import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() showSignupForm = new EventEmitter<void>();

  private readonly secretKey = "MyMovieApp123!";

  loginFormData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
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

    // Get all users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      Swal.fire('Error', 'No accounts found. Please sign up first.', 'error');
      return;
    }

    const users = JSON.parse(storedUsers);
    const loginEmail = this.loginFormData.value.email;
    const loginPassword = this.loginFormData.value.password;

    // Find the user with matching email
    const user = users.find((u: any) => u.email === loginEmail);

    if (!user) {
      Swal.fire('Error', 'No account found with this email.', 'error');
      return;
    }

    // Decrypt and verify password
    const decryptedPassword = this.decryptData(user.password);

    if (decryptedPassword === loginPassword) {
      // Store current user data in localStorage or session for the active session
      // localStorage.setItem('currentUser', JSON.stringify(user));

      this.authService.setUser(user)
      localStorage.setItem('isLoggedIn', JSON.stringify(true));

      this.authService.login();
      this.loginSuccess.emit();
      Swal.fire('Success', 'Logged in successfully!', 'success');
    } else {
      Swal.fire('Error', 'Invalid password', 'error');
    }
  }
}