import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  constructor(private userservice: UserService, private authService: AuthService) { }


  isLoggedIn: any;
  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)
    
  }


  signupFormData: FormGroup = new FormGroup({

    'username': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),

  })


  get username() {

    return this.signupFormData.controls['username']

  }
  get email() {

    return this.signupFormData.controls['email']

  }
  get password() {

    return this.signupFormData.controls['password']

  }


  signup() {

    this.userservice.postUserData(this.signupFormData.value).subscribe(res => {

      if (res) {

        this.signupFormData.reset()
        this.authService.login()

      }

    })

  }

}
