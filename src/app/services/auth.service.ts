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

  private selectdGenre = new BehaviorSubject<string>('All')

  selectdGenre$ = this.selectdGenre.asObservable();

  sendNavVal(val: any) {

    this.selectdGenre.next(val)

  }

}
