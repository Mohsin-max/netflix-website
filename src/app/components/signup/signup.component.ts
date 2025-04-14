import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, ReactiveFormsModule,],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  @Output() signupSuccess = new EventEmitter<void>();
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

    localStorage.setItem('user', JSON.stringify(userData));
    this.signupSuccess.emit();
  }
}