import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private USER_KEY: string = 'users';
  private FAVORITE_MOVIE_ID: string = 'favoriteMovieId';
  private MOVIE_COUNT: string = 'movieCount';
  private IS_LOGGED_IN: string = 'isLoggedIn';
  private CURRENT_USER: string = 'currentUser';

  setUser(value: any) {

    localStorage.setItem(this.USER_KEY, JSON.stringify(value));

  }

  getUser() {

    return JSON.parse(localStorage.getItem(this.USER_KEY) || '[]');

  }



  setFavoriteMovieId(favMovieId: any) {

    localStorage.setItem(this.FAVORITE_MOVIE_ID, JSON.stringify(favMovieId))
  }

  getFavoriteMovieId() {

    return JSON.parse(localStorage.getItem(this.FAVORITE_MOVIE_ID) || '[]')
  }



  setMovieCount(movieCount: any) {

    localStorage.setItem(this.MOVIE_COUNT, movieCount)
  }

  getMovieCount() {

    return localStorage.getItem(this.MOVIE_COUNT)
  }


  setIsLoggedIn(loginVal: any) {

    localStorage.setItem(this.IS_LOGGED_IN, JSON.stringify(loginVal))


  }

  getIsLoggedIn() {

    return JSON.parse(localStorage.getItem(this.IS_LOGGED_IN) || '');

  }

  setCurrentUser(currentUser: any) {

    localStorage.setItem(this.CURRENT_USER, JSON.stringify(currentUser))

  }

  getCurrentUser() {

    return JSON.parse(localStorage.getItem(this.CURRENT_USER) || '{}')

  }

}
