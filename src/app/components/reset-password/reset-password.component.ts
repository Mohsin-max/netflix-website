import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import * as CryptoJS from "crypto-js";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';



@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private readonly secretKey = "MyMovieApp123!";


  constructor(
    private service: ResetPasswordService,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  loading = { send: false, verify: false, reset: false };


  userEmail: string = ''
  otp: string = '';
  receivedOtp: string = '';
  userNewPassword: string = ''
  currentUser: any;
  generateOtpForm: boolean = true
  varificationForm: boolean = false
  resetPasswordForm: boolean = false

  emailForm = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),

  })


  get email() { return this.emailForm.controls['email']; }


  sendOtp() {

    const { email } = this.emailForm.value

    const users = this.storageService.getUser()

    const matchedUser = users.find((user: any) => user.email === this.emailForm.value.email);

    if (matchedUser) {

      this.loading.send = true
      this.service.getOtp(email).subscribe(res => {
        this.loading.send = false

        this.generateOtpForm = false;
        this.varificationForm = true;
        this.receivedOtp = res.otp;
        this.copyOtp()

      })


    } else {

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "email not found",
        showConfirmButton: false,
        timer: 2000
      })


    }
  }



  verifyOtp() {

    const { email } = this.emailForm.value

    this.loading.verify = true

    this.service.verifyOtp(email, this.otp).subscribe({

      next: () => {

        this.loading.verify = false
        this.resetPasswordForm = true
        this.varificationForm = false

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "OTP verified",
          showConfirmButton: false,
          timer: 2000
        });

      },

      error: () => {

        this.loading.verify = false
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Authentication failed, try again",
          showConfirmButton: false,
          timer: 2000
        });

      }

    })

  }

  resetPassword() {

    const { email } = this.emailForm.value

    let user: any;

    const users = this.storageService.getUser()

    if (this.currentUser) {

      this.currentUser = this.storageService.getCurrentUser()
      user = this.currentUser
    }
    else {

      const foundUser = users.find((user: any) => user.email === email);
      user = foundUser;
    }

    if (user) {

      // Encrypt new password
      const encryptedNewPassword = CryptoJS.AES.encrypt(this.userNewPassword, this.secretKey).toString();

      // Update password in currentUser
      user.password = encryptedNewPassword;

      // Update users array in localStorage

      const updatedUsers = users.map((useri: any) => {
        if (useri.email === user.email) {
          return { ...useri, password: encryptedNewPassword };
        }
        return useri;
      });

      // Save updated data back to localStorage
      this.storageService.setCurrentUser(users)
      this.storageService.setUser(updatedUsers)


      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Successfully new password set",
        showConfirmButton: false,
        timer: 2000
      });

      this.router.navigate(['/'])

    }
    else {

      Swal.fire({
        title: "User Not Found!",
        icon: "error"
      });
    }

  }



  copyOtp() {
    navigator.clipboard.writeText(this.receivedOtp);

    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: "Copied OTP"
    });
  }
}
