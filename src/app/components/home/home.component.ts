import { Component } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import * as CryptoJS from "crypto-js";
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from "../skeleton-card/skeleton-card.component";
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { SignupComponent } from "../signup/signup.component";
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent, RouterModule, SignupComponent, LoginComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private readonly secretKey = "MyMovieApp123!";

  // Movie Data Arrays
  trendingData: any[] = [];
  actionData: any[] = [];
  adventureData: any[] = [];
  animationData: any[] = [];
  sciFiData: any[] = [];
  bannerData: any[] = [];

  allMovies: any[] = [];
  filteredarray: any[] = []

  updateCombinedMovies() {
    this.allMovies = [
      ...this.actionData,
      ...this.adventureData,
      ...this.animationData,
      ...this.sciFiData
    ];
  }


  hideShowAccordion: boolean = true

  // Skeleton Loaders
  arrTrending: boolean[] = [];
  arrAction: boolean[] = [];
  arrAdventure: boolean[] = [];
  arrAnimation: boolean[] = [];
  arrSciFi: boolean[] = [];

  // User State
  isLoggedIn: boolean = false;
  showSignupForm: boolean = false;
  showLoginForm: boolean = false;
  movieCount: number = 0;

  constructor(
    private service: MovieApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    console.log(this.allMovies);

    this.checkAuthStatus();
    this.loadInitialData();
    this.loadMovieCount();

    this.genreChange()

    // Only load other movies if logged in or movieCount < 3
    if (this.isLoggedIn || this.movieCount < 3) {
      this.loadAllMovies();
    }
  }

  genreChange() {
    this.authService.selectdGenre$.subscribe((res: any) => {

      if (res === "All") {
        this.hideShowAccordion = true;
        this.filteredarray = [];
      } else {
        this.hideShowAccordion = false;

        this.filteredarray = this.allMovies.filter(movie =>
          movie.genres.some((genre: any) => genre.name === res)
        );
      }

      console.log(this.filteredarray);
    });
  }

  checkAuthStatus() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (status) {
        // User is logged in
        this.showSignupForm = false;
        this.showLoginForm = false;
        this.loadAllMovies();
      } else {
        // User is logged out
        this.loadMovieCount();
        this.showSignupForm = this.movieCount >= 3;
        this.showLoginForm = false;

        // Clear other movie categories when showing forms
        if (this.showSignupForm || this.showLoginForm) {
          this.clearMovieData();
        }
      }
    });
  }

  loadMovieCount() {
    const count = localStorage.getItem('movieCount');
    this.movieCount = count ? parseInt(this.decryptData(count)) : 0;
  }

  saveMovieCount() {
    localStorage.setItem('movieCount', this.encryptData(this.movieCount.toString()));
  }

  clearMovieData() {
    this.actionData = [];
    this.adventureData = [];
    this.animationData = [];
    this.sciFiData = [];
  }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  loadInitialData() {
    // Always load banner and trending data
    this.service.getBannerApi().subscribe(res => this.bannerData = res.results);
    this.service.getTrendingApi().subscribe(res => {
      this.trendingData = res.results;
      this.arrTrending = new Array(res.results.length).fill(false);
      this.showDelayedCards(this.arrTrending);
    });
  }

  loadAllMovies() {
    if (this.isLoggedIn || this.movieCount < 3) {

      this.service.getActionApi().subscribe(res => {
        this.actionData = res.results;
        this.arrAction = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAction);
        this.updateCombinedMovies(); // ✅ update combined
      });

      this.service.getAdventureApi().subscribe(res => {
        this.adventureData = res.results;
        this.arrAdventure = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAdventure);
        this.updateCombinedMovies();
      });

      this.service.getAnimationApi().subscribe(res => {
        this.animationData = res.results;
        this.arrAnimation = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAnimation);
        this.updateCombinedMovies();
      });

      this.service.getSciFiApi().subscribe(res => {
        this.sciFiData = res.results;
        this.arrSciFi = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrSciFi);
        this.updateCombinedMovies();
      });
    }
  }


  showDelayedCards(arr: boolean[]) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < arr.length) {
        arr[index] = true;
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);
  }

  clickedMovie() {
    if (!this.isLoggedIn) {
      this.movieCount++;
      this.saveMovieCount();
      if (this.movieCount >= 3) {
        this.showSignupForm = true;
        this.showLoginForm = false;
        this.clearMovieData();
      }
    }
  }

  onSignupSuccess() {
    this.showSignupForm = false;
    this.showLoginForm = true;
    // Swal.fire('Success', 'Account created! Please login.', 'success');
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Account created! Please login.",
      showConfirmButton: false,
      timer: 2000
    });

  }

  onLoginSuccess() {
    this.showLoginForm = false;
    this.loadAllMovies();
  }

  bannerWatchBtn(movieId: any) {
    if (!this.isLoggedIn) {
      if (this.movieCount >= 3) {
        // Swal.fire('Signup Required', 'Create an account to watch movies!', 'info');
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: "Create an account to watch movies!",
          showConfirmButton: false,
          timer: 2000
        });
        this.showSignupForm = true;
        this.clearMovieData();
      } else {
        this.router.navigate([`/movie-details/${movieId}`]);
      }
    } else {
      this.router.navigate([`/movie-details/${movieId}`]);
    }
  }

  toggleToLogin() {
    this.showSignupForm = false;
    this.showLoginForm = true;
  }

  toggleToSignup() {
    this.showLoginForm = false;
    this.showSignupForm = true;
  }
}