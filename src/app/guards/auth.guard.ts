import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {
  constructor(private router: Router) { }


  canActivate(): boolean {
    let isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || '')

    if (isLoggedIn) {
      return true;
    } else {

      this.router.navigate(['/']);
      return false;
    }
  }
}