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

  private currentUser = new BehaviorSubject<any>(null)

  currentUser$ = this.currentUser.asObservable()

  constructor() {

    let user = localStorage.getItem('currentUser')

    if (user) this.currentUser.next(JSON.parse(user))

  }

  setUser(user:any){

    localStorage.setItem('currentUser',JSON.stringify(user))

    this.currentUser.next(user)

  }

}
