import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

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
  arrMovieDetails: any = {};
  arrMovieCast: any[] = [];
  movieVideoKey = '';

  /* ---------- pagination ---------- */
  p = 1;
  pSize = 15;

  constructor(
    private route: ActivatedRoute,
    private service: MovieApiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    /* login status */
    this.authService.isLoggedIn$
      .subscribe(res => this.isLoggedin = res);

    /* scroll top */
    // window.scrollTo(0, 0);

    const movie_id = this.route.snapshot.paramMap.get('id')!;

    /* ----- MOVIE DETAILS ----- */
    this.service.getMovieDetailsApi(movie_id).subscribe(details => {
      this.arrMovieDetails = details;
      this.updateFavState(details.id);
      this.checkAllLoaded();
    });

    /* ----- CAST ----- */
    this.service.getMovieCastApi(movie_id).subscribe(res => {
      this.arrMovieCast = res.cast;
      this.checkAllLoaded();
    });

    /* ----- VIDEO KEY ----- */
    this.service.getMovieVideoApi(movie_id).subscribe(res => {
      const teaser = res.results.find((v: any) => v.type === 'Teaser');
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
  getHoursAndMinutes(time: number) {
    const h = Math.floor(time / 60);
    const m = time % 60;
    return `${h}h ${m}m`;
  }

  /** fav icon ka current state localStorage se nikala */
  updateFavState(id: number) {
    const favIds: number[] = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
    this.isFavorite = favIds.includes(id);
  }

  /** add / remove favourite */
  addToFav(event: Event, movieId: number) {
    event.stopPropagation();

    if (!this.isLoggedin) {
      this.toast('error', 'Create account first');
      return;
    }

    let favIds: number[] = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
    const idx = favIds.indexOf(movieId);

    if (idx === -1) {                 // add
      favIds.push(movieId);
      this.isFavorite = true;
      this.toast('success', 'Added to Favorites');
    } else {                          // remove
      favIds.splice(idx, 1);
      this.isFavorite = false;
      Swal.fire({
        toast: true,
        position: 'top-end',
        title: "Removeform favorites",
        timer: 2000
      })
      // this.toast('', 'Removed from Favorites');
    }
    localStorage.setItem('favoriteMovieId', JSON.stringify(favIds));
  }

  /** sweetalert helper */
  toast(icon: 'success' | 'info' | 'error', title: string) {
    Swal.fire({
      toast: true, position: 'top-end', icon, title,
      showConfirmButton: false, timer: 2000
    });
  }
}
