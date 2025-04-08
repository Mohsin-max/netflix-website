import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  constructor(private userService: UserService, private authService: AuthService) { }

  userData: any[] = []
  isLoggedIn: any;

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)

  }

  loginFormData: FormGroup = new FormGroup({

    'email': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),

  })

  get email() {

    return this.loginFormData.controls['email']

  }
  get password() {

    return this.loginFormData.controls['password']

  }



  login() {

    let { email, password } = this.loginFormData.value

    this.userService.getUserData().pipe(
      map(user => user.filter((f: any) => f.email == email && f.password == password))
    ).subscribe(res => {

      this.loginFormData.reset()

      this.authService.login()

    })


  }
}
