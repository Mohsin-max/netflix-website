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


    // this.users = JSON.parse(localStorage.getItem('currentUser') || '[]')
    this.users = JSON.parse(localStorage.getItem('isLoggedIn') || '')
    // console.log(JSON.parse(this.users),"moviecard");
    
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovie') || '[]');
    this.isFavorite = favoriteMovies.some((movie: any) => movie.id === this.movieDetails.id);

    this.currentRoute = this.location.path()

  }

  addToFav(event: Event, movie: any) {
    event.stopPropagation();

    if (this.users) {

      let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovie') || '[]');
      const movieIndex = favoriteMovies.findIndex((m: any) => m.id === movie.id);

      if (movieIndex === -1) {
        // Add to favorites
        favoriteMovies.push(movie);
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
        favoriteMovies.splice(movieIndex, 1);
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

      localStorage.setItem('favoriteMovie', JSON.stringify(favoriteMovies));

    } else {

      Swal.fire('Signup Required', 'Create an account to watch movies!', 'info');


    }

  }
}