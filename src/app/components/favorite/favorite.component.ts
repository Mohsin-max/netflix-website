import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MovieApiService } from '../../services/movie-api.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-favorite',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  favoriteMovieArr: any[] = []
  GlobalfavoriteMovieArr: any[] = []
  favoritesId: any[] = []

  constructor(
    private router: Router,
    private service: MovieApiService,
    private authService: AuthService,
    private storageService: StorageService
  ) { }



  ngOnInit() {

    this.loadFavorites();
    this.genreChange()

  }


  // load initially all favorites
  loadFavorites() {

    this.favoritesId = this.storageService.getFavoriteMovieId();

    for (let i = 0; i < this.favoritesId.length; i++) {
      this.service.getMovieDetailsApi(this.favoritesId[i]).subscribe(res => {
        this.GlobalfavoriteMovieArr.push(res)
        this.favoriteMovieArr = this.GlobalfavoriteMovieArr

      });
    }

  }


  genreChange() {

    this.authService.selectdGenre$.subscribe((res) => {

      const filteredarray = []

      if (res === 'All') {

        this.favoriteMovieArr = this.GlobalfavoriteMovieArr;

      }
      else {

        for (let i = 0; i < this.GlobalfavoriteMovieArr.length; i++) {

          const isGenrePresent = this.GlobalfavoriteMovieArr[i].genres.some((genre: any) => genre.name === (res));
          if (isGenrePresent) {
            filteredarray.push(this.GlobalfavoriteMovieArr[i])
          }


        }
        this.favoriteMovieArr = filteredarray;
      }



    })

  }

  navigateToDetails(movieId: number) {
    this.router.navigate([`/movie-details/${movieId}`]);
  }


  removeFromFavorites(movie: any, event: Event) {
    event.stopPropagation(); // Prevent navigation when clicking heart

    // Remove from array.
    this.favoritesId = this.favoritesId.filter(m => m !== movie);

    // Update localStorage
    this.storageService.setFavoriteMovieId(this.favoritesId)


    // Show notification
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Removed from Favorites",
      showConfirmButton: false,
      timer: 2000
    });

    this.favoriteMovieArr = [];
    this.GlobalfavoriteMovieArr = [];
    this.loadFavorites();
  }

}
