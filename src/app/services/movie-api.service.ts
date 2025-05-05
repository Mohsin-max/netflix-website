import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResponse } from '../interfaces/movie-response.model';
import { MovieCastCrewResponse } from '../interfaces/movie-cast-crew-response.model';
import { MovieVideoResponse } from '../interfaces/movie-video-response.model';
import { MovieDetails } from '../interfaces/movie-details.model';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {

  constructor(private http: HttpClient) { }

  baseurl: string = "https://api.themoviedb.org/3";
  apikey: string = "173a8d7812ad61f437e5577c967816c9";

  getBannerApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/trending/all/week?api_key=${this.apikey}`)

  }

  getTrendingApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/trending/movie/day?api_key=${this.apikey}`)

  }

  getActionApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=28`)

  }

  getAdventureApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=12`)

  }

  getAnimationApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=16`)

  }

  getSciFiApi(): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/discover/movie?api_key=${this.apikey}&with_genres=878`)

  }

  getSearchedApi(data: any): Observable<MovieResponse> {

    return this.http.get<MovieResponse>(`${this.baseurl}/search/movie?api_key=${this.apikey}&query=${data}`)

  }

  getMovieDetailsApi(id: string): Observable<MovieDetails> {

    return this.http.get<MovieDetails>(`${this.baseurl}/movie/${id}?api_key=${this.apikey}`)

  }

  getMovieVideoApi(id: string): Observable<MovieVideoResponse> {

    return this.http.get<MovieVideoResponse>(`${this.baseurl}/movie/${id}/videos?api_key=${this.apikey}`);

  }

  getMovieCastApi(id: string): Observable<MovieCastCrewResponse> {

    return this.http.get<MovieCastCrewResponse>(`${this.baseurl}/movie/${id}/credits?api_key=${this.apikey}`);

  }
}
