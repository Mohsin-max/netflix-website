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
    this.checkAuthStatus();
    this.loadInitialData();
  }

  checkAuthStatus() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (!status) {
        this.loadMovieCount();
        this.showSignupForm = this.movieCount >= 3;
        this.showLoginForm = false;
      } else {
        this.showSignupForm = false;
        this.showLoginForm = false;
        this.loadAllMovies();
      }
    });
  }

  loadMovieCount() {
    const encryptedCount = localStorage.getItem('movieCount');
    if (encryptedCount) {
      this.movieCount = parseInt(this.decryptData(encryptedCount)) || 0;
    }
  }

  saveMovieCount() {
    const encrypted = this.encryptData(this.movieCount.toString());
    localStorage.setItem('movieCount', encrypted);
  }

  encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  loadInitialData() {
    this.service.getBannerApi().subscribe(res => this.bannerData = res.results);
    this.service.getTrendingApi().subscribe(res => {
      this.trendingData = res.results;
      this.arrTrending = new Array(res.results.length).fill(false);
      this.showDelayedCards(this.arrTrending);
    });
  }

  loadAllMovies() {

    if (this.isLoggedIn) {

      this.service.getActionApi().subscribe(res => {
        this.actionData = res.results;
        this.arrAction = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAction);
      });

      this.service.getAdventureApi().subscribe(res => {
        this.adventureData = res.results;
        this.arrAdventure = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAdventure);
      });

      this.service.getAnimationApi().subscribe(res => {
        this.animationData = res.results;
        this.arrAnimation = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAnimation);
      });

      this.service.getSciFiApi().subscribe(res => {
        this.sciFiData = res.results;
        this.arrSciFi = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrSciFi);
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
      }
    }
  }

  onSignupSuccess() {
    this.showSignupForm = false;
    this.showLoginForm = true;
    this.movieCount = 0;
    this.saveMovieCount();
    Swal.fire('Success', 'Account created! Please login.', 'success');
  }

  onLoginSuccess() {
    this.showLoginForm = false;
    this.isLoggedIn = true;
    this.loadAllMovies();
  }

  bannerWatchBtn(movieId: any) {
    if (!this.isLoggedIn && this.movieCount >= 3) {
      Swal.fire('Signup Required', 'Create an account to watch movies!', 'info');
      this.showSignupForm = true;
    } else {
      this.router.navigate([`/movie-details/${movieId}`]);
    }
  }
}