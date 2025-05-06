import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})

export class authGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) { }


  canActivate(): boolean {
    let isLoggedIn = this.storageService.getIsLoggedIn()

    if (isLoggedIn) {
      return true;
    } else {

      this.router.navigate(['/']);
      return false;
    }
  }
}