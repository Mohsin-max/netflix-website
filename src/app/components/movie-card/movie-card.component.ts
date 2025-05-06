import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
Location
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../interfaces/movie.model';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

  @Input() movieDetails?: Movie;

  isFavorite: boolean = false;

  users: any;
  currentRoute: string = ''
  constructor(private location: Location, private authService: AuthService, private storageService: StorageService) { }

  ngOnInit() {

    this.authService.isLoggedIn$.subscribe(res => this.users = res)

    const favoriteMoviesId = this.storageService.getFavoriteMovieId()
    this.isFavorite = favoriteMoviesId.some((movieId: number) => movieId === this.movieDetails?.id);

    this.currentRoute = this.location.path()

  }

  addToFav(event: Event, movie?: number) {

    if (!movie) return

    event.stopPropagation();

    if (this.users) {

      let favoriteMoviesId = this.storageService.getFavoriteMovieId();
      const movieIndex = favoriteMoviesId.findIndex((m: any) => m === movie);


      if (movieIndex === -1) {
        // Add to favorites
        favoriteMoviesId.push(movie);
        this.isFavorite = true;

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Added to Favorites",
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        // Remove from favorites
        favoriteMoviesId.splice(movieIndex, 1);
        this.isFavorite = false;

        Swal.fire({
          toast: true,
          position: "top-end",
          // icon: "error",
          title: "Removed from Favorites",
          showConfirmButton: false,
          timer: 2000
        });
      }

      this.storageService.setFavoriteMovieId(favoriteMoviesId)

    } else {

      // Swal.fire('Signup Required', 'Create an account to watch movies!', 'info');

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Create account first",
        showConfirmButton: false,
        timer: 2000
      });


    }

  }
}