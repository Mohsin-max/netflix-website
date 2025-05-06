import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})

export class AuthService  {

  constructor(private storageService: StorageService) { 

    
    let user = this.storageService.getCurrentUser();

    if (user) this.currentUser.next(user)

  }

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

  setUser(user: any) {

    // localStorage.setItem('currentUser',JSON.stringify(user))


    this.currentUser.next(user)

  }

}