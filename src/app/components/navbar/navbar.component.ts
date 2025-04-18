import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { debounce } from '../../debounce';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule, Location } from '@angular/common';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(
    private service: MovieApiService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) { }

  searchedMovie: Movie[] = []

  isLoggedIn: any;

  selectedGenre: string = 'All'

  currentLocation: string = ''

  ngOnInit(): void {


    this.router.events.subscribe(event=>{


      if (event instanceof NavigationEnd) {
        
        this.currentLocation = this.location.path()
      }

    })


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

        localStorage.setItem('isLoggedIn', JSON.stringify(false));
        localStorage.removeItem('currentUser');
        this.authService.logout();

        Swal.fire({
          title: "Logout!",
          icon: "success"
        });
        // this.router.navigate(['/']);
      }
    });
  }

  signup() {

    window.scrollTo({
      top: window.innerHeight * 1.5,
      behavior: 'smooth'
    })
    this.router.navigate(['/']);
  }


  genreChange() {

    this.authService.sendNavVal(this.selectedGenre)

  }

}
