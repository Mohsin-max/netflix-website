import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounce } from '../../debounce';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private service: MovieApiService, private authService: AuthService) { }

  searchedMovie: Movie[] = []

  isLoggedIn: any;

  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)

  }



  // it contains a wrapper function.
  debouncedFunc = debounce((event: any) => {

    // The API will be hit, and the user's text will be sent from the event.

    this.service.getSearchedApi(event).subscribe(res => {
      this.searchedMovie = res.results

    })

  }, 500)

  logout() {

    if (confirm('are you sure want to logout')) {

      this.authService.logout();

      window.scrollTo({
        top: 700,
        behavior: 'smooth'
      })

    }

  }



}
