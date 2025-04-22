import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResetPasswordService } from '../../services/reset-password.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import * as CryptoJS from "crypto-js";
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private readonly secretKey = "MyMovieApp123!";


  constructor(private service: ResetPasswordService, private authService: AuthService) { }

  userEmail: string = ''
  otp: string = '';
  receivedOtp: string = '';
  userNewPassword: string = ''
  currentUser: any;
  generateOtpForm: boolean = true
  varificationForm: boolean = false
  resetPasswordForm: boolean = false

  generateOtp() {

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    users.map(((user: any) => {

      if (user.email == this.userEmail) {

        this.service.getOtp(this.userEmail).subscribe(res => {

          if (res) {

            this.generateOtpForm = false
            this.varificationForm = true
            this.receivedOtp = res.otp

          }


        })

      } else {

        Swal.fire({
          title: "Email not found",
          icon: "error"
        })

      }

    }))




  }

  onOtpInput() {
    this.otp = this.otp.replace(/\D/g, '');
  }

  verifyOtp() {

    if (this.receivedOtp === this.otp) {

      this.service.verifyOtp(this.userEmail, this.otp).subscribe(res => {

        if (res) {
          this.resetPasswordForm = true
          this.varificationForm = false
        }

      })

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
        title: "OTP matched"
      });




    } else {

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
        icon: "error",
        title: "OTP not match"
      });
    }

  }

  resetPassword() {

    let user: any;

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (this.currentUser) {

      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      user = this.currentUser
    }
    else {

      const foundUser = users.find((user: any) => user.email === this.userEmail);
      user = foundUser;
    }
    if (user) {

      // Step 3: Encrypt new password
      const encryptedNewPassword = CryptoJS.AES.encrypt(this.userNewPassword, this.secretKey).toString();

      // Step 4: Update password in currentUser
      user.password = encryptedNewPassword;

      // Step 5: Update users array in localStorage

      const updatedUsers = users.map((useri: any) => {
        if (useri.email === user.email) {
          return { ...useri, password: encryptedNewPassword };
        }
        return user;
      });

      // Step 6: Save updated data back to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Step 7: Show success alert
      Swal.fire({
        title: "Good job!",
        text: "Your New Password has been set!",
        icon: "success"
      });
    }
    else {
      // Step 7: Show success alert
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
