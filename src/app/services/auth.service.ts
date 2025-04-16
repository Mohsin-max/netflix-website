import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('currentUser'));

  isLoggedIn$ = this.loggedIn.asObservable();

  logout() {
    this.loggedIn.next(false);
    // localStorage.removeItem('user');

  }

  login() {
    this.loggedIn.next(true);
  }
}
