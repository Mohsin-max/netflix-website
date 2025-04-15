import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-favorite',
  imports: [RouterModule, CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  favoriteMovieArr: any[] = []

  constructor(private router: Router) { }



  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favorites = localStorage.getItem('favoriteMovie');
    this.favoriteMovieArr = favorites ? JSON.parse(favorites).reverse() : [];
  }

  navigateToDetails(movieId: number) {
    this.router.navigate([`/movie-details/${movieId}`]);
  }


  removeFromFavorites(movie: any, event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking heart
    
    // Remove from array
    this.favoriteMovieArr = this.favoriteMovieArr.filter(m => m.id !== movie.id);
    
    // Update localStorage
    localStorage.setItem('favoriteMovie', JSON.stringify(this.favoriteMovieArr));
    
    // Show notification
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    
    Toast.fire({
      icon: "error",
      title: "Removed from Favorites"
    });
  }



}
