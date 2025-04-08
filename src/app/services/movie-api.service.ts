import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {

  constructor(private http: HttpClient) { }

  baseurl: string = "https://api.themoviedb.org/3";
  apikey: string = "173a8d7812ad61f437e5577c967816c9";

  getBannerApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/trending/all/week?api_key=${this.apikey}`)

  }

  getTrendingApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/trending/movie/day?api_key=${this.apikey}`)

  }

  getActionApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=28`)

  }

  getAdventureApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=12`)

  }

  getAnimationApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=16`)

  }

  getSciFiApi(): Observable<any> {

    return this.http.get(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=878`)

  }

  getSearchedApi(data: any): Observable<any> {

    return this.http.get(`${this.baseurl}/search/movie?api_key=${this.apikey}&query=${data}`)

  }

  getMovieDetailsApi(id: any): Observable<any> {

    return this.http.get(`${this.baseurl}/movie/${id}?api_key=${this.apikey}`)

  }

  getMovieVideoApi(id: any): Observable<any> {

    return this.http.get(`${this.baseurl}/movie/${id}/videos?api_key=${this.apikey}`);

  }

  getMovieCastApi(id: any): Observable<any> {

    return this.http.get(`${this.baseurl}/movie/${id}/credits?api_key=${this.apikey}`)

  }
}
