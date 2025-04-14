import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounce } from '../../debounce';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(private service: MovieApiService, private authService: AuthService, private router: Router) { }

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

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {

        localStorage.removeItem('user');
        this.authService.logout();

        Swal.fire({
          title: "Logout!",
          icon: "success"
        });
        this.router.navigate(['/']);
      }
    });
  }

  signup() {

    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: 'smooth'
    })
  }
}
