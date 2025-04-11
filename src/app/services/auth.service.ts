import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private route: Router) { }

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));

  isLoggedIn$ = this.loggedIn.asObservable();

  logout() {
    // localStorage.setItem('movieCount', '3');
    this.loggedIn.next(false);
    localStorage.removeItem('user');

  }

  login() {
    this.loggedIn.next(true);
  }
}
