import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() showSignupForm = new EventEmitter<void>();

  private readonly secretKey = "MyMovieApp123!";

  loginFormData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  get email() { return this.loginFormData.controls['email']; }
  get password() { return this.loginFormData.controls['password']; }

  constructor(private authService: AuthService, private storageService: StorageService) { }

  storedUsers: any[] = []

  ngOnInit(): void {

    this.storedUsers = this.storageService.getUser()

  }


  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  login() {
    if (this.loginFormData.invalid) return;

    if (!this.storedUsers) {
      Swal.fire('Error', 'No accounts found. Please sign up first.', 'info');
      return;
    }

    const users = this.storedUsers;
    const loginEmail = this.loginFormData.value.email;
    const loginPassword = this.loginFormData.value.password;

    const user = users.find((u: any) => u.email === loginEmail);

    // ADD THIS CHECK 👇
    if (!user) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Account not found",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }

    const decryptedPassword = this.decryptData(user.password);

    if (decryptedPassword === loginPassword) {
      this.authService.setUser(user)
      this.storageService.setIsLoggedIn(true)
      this.storageService.setCurrentUser(user)

      this.authService.login();
      this.loginSuccess.emit();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Logged in successfully",
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Invalid password",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
}