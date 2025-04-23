import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../services/movie-api.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {
  
  constructor(private route: ActivatedRoute, private service: MovieApiService, private authService: AuthService) { }
  
  isFavorite: boolean = true;
  
  arrMovieDetails: any = {};
  movieVideoKey: any;
  arrMovieCast: any;

  isLoggedin: boolean = false;
  p: number = 1
  pSize: number = 15



  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(res => this.isLoggedin = res)
    
    window.scrollTo(0, 0)
    
    let movie_id = this.route.snapshot.paramMap.get('id');
    
    this.service.getMovieDetailsApi(movie_id).subscribe(res => {
      
      this.arrMovieDetails = res
      const favoriteMoviesId = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
      
      this.isFavorite = favoriteMoviesId.some((movie: any) => movie.id == this.arrMovieDetails.id);

    })

    this.service.getMovieVideoApi(movie_id).pipe(

      map(elem => elem.results.filter((f: any) => f.type == "Teaser"))

    ).subscribe(res => this.movieVideoKey = res[0]?.key)


    this.service.getMovieCastApi(movie_id).subscribe(res => this.arrMovieCast = res.cast)

  }

  getHoursAndMinutes(time: number) {

    const hours = Math.floor(time / 60);
    const min = time % 60

    return `${hours}h ${min}m`

  }


  // removeFromFavorites(movie: any, event: Event) {
  //   event.stopPropagation(); // Prevent navigation when clicking heart

  //   // Remove from array
  //   this.favoriteMovieArr = this.favoriteMovieArr.filter(m => m.id !== movie.id);

  //   // Update localStorage
  //   localStorage.setItem('favoriteMovie', JSON.stringify(this.favoriteMovieArr));

  //   // Show notification
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: "top-end",
  //     showConfirmButton: false,
  //     timer: 2000,
  //     timerProgressBar: true,
  //     didOpen: (toast) => {
  //       toast.onmouseenter = Swal.stopTimer;
  //       toast.onmouseleave = Swal.resumeTimer;
  //     }
  //   });

  //   Toast.fire({
  //     icon: "error",
  //     title: "Removed from Favorites"
  //   });
  // }


  addToFav(event: Event, movie: any) {
    event.stopPropagation();

    let favoriteMoviesId = JSON.parse(localStorage.getItem('favoriteMovieId') || '[]');
    const movieIndex = favoriteMoviesId.findIndex((m: any) => m === movie);

    if (this.isLoggedin) {

      if (movieIndex === -1) {
        // Add to favorites
        favoriteMoviesId.push(movie);
        this.isFavorite = false;
  
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
        this.isFavorite = true;
  
        Swal.fire({
          toast: true,
          position: "top-end",
          // icon: "error",
          title: "Removed from Favorites",
          showConfirmButton: false,
          timer: 2000
        });
      }
  
      localStorage.setItem('favoriteMovieId', JSON.stringify(favoriteMoviesId));

    }else{

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
