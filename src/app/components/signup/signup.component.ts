import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  @Output() signupSuccess = new EventEmitter<void>();
  @Output() showLoginForm = new EventEmitter<void>();
  private readonly secretKey = "MyMovieApp123!";

  signupFormData = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get username() { return this.signupFormData.controls['username']; }
  get email() { return this.signupFormData.controls['email']; }
  get password() { return this.signupFormData.controls['password']; }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  signup() {
    if (this.signupFormData.invalid) return;

    const encryptedPassword = this.encryptData(this.signupFormData.value.password!);
    const userData = {
      ...this.signupFormData.value,
      password: encryptedPassword
    };

    // Get existing users from localStorage
    const existingUsersJson = localStorage.getItem('users');
    let users = [];

    // If users exist, parse them
    if (existingUsersJson) {
      users = JSON.parse(existingUsersJson);
    }

    // Check if user already exists (optional)
    const userExists = users.some((user: any) => user.email === userData.email);
    if (userExists) {

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "This email is already exist",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    // Add new user to the array
    users.push(userData);

    // Store updated users array back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    this.signupSuccess.emit();
  }
}