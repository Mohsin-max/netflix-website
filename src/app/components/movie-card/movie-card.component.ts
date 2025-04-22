import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
Location
import Swal from 'sweetalert2';
@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {

  @Input() movieDetails: any

  isFavorite: boolean = false;

  users: any;
  currentRoute: string = ''
  constructor(private location: Location) { }

  ngOnInit() {

    this.users = JSON.parse(localStorage.getItem('isLoggedIn') || 'false')

    const favoriteMoviesId = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
    this.isFavorite = favoriteMoviesId.some((movieId: any) => movieId === this.movieDetails.id);

    this.currentRoute = this.location.path()

  }

  addToFav(event: Event, movie: any) {
    event.stopPropagation();

    if (this.users) {

      let favoriteMoviesId = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
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
          icon: "error",
          title: "Removed from Favorites",
          showConfirmButton: false,
          timer: 2000
        });
      }

      localStorage.setItem('favoriteMovieId', JSON.stringify(favoriteMoviesId));

    } else {

      Swal.fire('Signup Required', 'Create an account to watch movies!', 'info');


    }

  }
}