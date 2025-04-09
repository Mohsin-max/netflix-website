import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private route:Router) { }

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('user'));

  isLoggedIn$ = this.loggedIn.asObservable();

  logout() {
    localStorage.removeItem('user');
    this.loggedIn.next(false); // Emit false to all listeners
  }

  login() {
    this.loggedIn.next(true);  // sab ko bata do login ho gaya
  }
}
