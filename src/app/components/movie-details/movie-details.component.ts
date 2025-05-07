import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { MovieDetails } from '../../interfaces/movie-details.model';
import { movieCastCrew } from '../../interfaces/movie-cast-crew.model';
import { MovieCastCrewResponse } from '../../interfaces/movie-cast-crew-response.model';
import { MovieVideoResponse } from '../../interfaces/movie-video-response.model';
import { MovieVideo } from '../../interfaces/movie-video.model';
import { StorageService } from '../../services/storage.service';
import { getHoursAndMinutes } from '../../utils/hour-min';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  /* ---------- flags / helpers ---------- */
  isLoading = true;                     // skeleton flag
  castLoaders = Array(10);                // 10 dummy cards
  isFavorite = false;
  isLoggedin = false;

  /* ---------- data ---------- */
  arrMovieDetails?: MovieDetails;
  arrMovieCast: movieCastCrew[] = [];
  movieVideoKey: string = '';

  /* ---------- pagination ---------- */
  p = 1;
  pSize = 15;

  constructor(
    private route: ActivatedRoute,
    private service: MovieApiService,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {

    /* login status */
    this.authService.isLoggedIn$
      .subscribe(res => this.isLoggedin = res);

    /* scroll top */
    // window.scrollTo(0, 0);

    const movie_id = this.route.snapshot.paramMap.get('id')!;

    /* ----- MOVIE DETAILS ----- */
    this.service.getMovieDetailsApi(movie_id as string).subscribe((details: MovieDetails) => {
      this.arrMovieDetails = details;
      this.updateFavState(this.arrMovieDetails.id);
      this.checkAllLoaded();
    });

    /* ----- CAST ----- */
    this.service.getMovieCastApi(movie_id as string).subscribe((res: MovieCastCrewResponse) => {
      this.arrMovieCast = res.cast;
      this.checkAllLoaded();
    });

    /* ----- VIDEO KEY ----- */
    this.service.getMovieVideoApi(movie_id as string).subscribe((res: MovieVideoResponse) => {
      const teaser = res.results.find((v: MovieVideo) => v.type === 'Teaser');
      this.movieVideoKey = teaser?.key || '';
      this.checkAllLoaded();   // video done
    });
  }

  /** teenon calls complete huay to skeleton hide */
  loadCounter = 0;
  checkAllLoaded() {
    this.loadCounter++;
    if (this.loadCounter === 3) this.isLoading = false;
  }

  /** runtime */

  hoursAndMintuesFunc(time: number | undefined) {

    return getHoursAndMinutes(time)

  }


  // getHoursAndMinutes(time?: number) {

  //   if (!time) return
  //   const h = Math.floor(time / 60);
  //   const m = time % 60;
  //   return `${h}h ${m}m`;
  // }

  /** fav icon ka current state localStorage se nikala */
  updateFavState(id: number) {
    const favIds: number[] = this.storageService.getFavoriteMovieId();
    this.isFavorite = favIds.includes(id);
  }

  /** add / remove favourite */
  addToFav(event: Event, movieId?: number) {

    if (!movieId) return

    event.stopPropagation();

    if (!this.isLoggedin) {
      this.toast('error', 'Create account first');
      return;
    }

    let favIds: number[] = this.storageService.getFavoriteMovieId();
    const idx = favIds.indexOf(movieId);

    if (idx === -1) {                 // add
      favIds.push(movieId);
      this.isFavorite = true;
      this.toast('success', 'Added to Favorites');
    } else {                          // remove
      favIds.splice(idx, 1);
      this.isFavorite = false;
      // Swal.fire({
      //   toast: true,
      //   position: 'top-end',
      //   title: "Remove form favorites",
      //   timer: 2000
      // })
      this.toast('info', 'Removed from Favorites');
    }

    this.storageService.setFavoriteMovieId(favIds)

  }

  /** sweetalert helper */
  toast(icon: 'success' | 'info' | 'error', title: string) {
    Swal.fire({
      toast: true, position: 'top-end', icon, title,
      showConfirmButton: false, timer: 2000
    });
  }
}
