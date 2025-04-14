import { Component, HostListener } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import * as CryptoJS from "crypto-js";

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, SkeletonCardComponent, MovieCardComponent, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly secretKey = "MyMovieApp123!";

  constructor(private service: MovieApiService, private authService: AuthService, private route: Router) { }

  // Movie data arrays
  arrTrending: Movie[] = [];
  trendingData: Movie[] = [];
  arrAction: Movie[] = [];
  actionData: Movie[] = [];
  arrAdventure: Movie[] = [];
  adventureData: Movie[] = [];
  arrAnimation: Movie[] = [];
  animationData: Movie[] = [];
  arrSciFi: Movie[] = [];
  sciFiData: Movie[] = [];
  bannerData: Movie[] = [];

  // User related
  userData: any;
  isLoggedIn: boolean = false;
  showSignupForm: boolean = true;

  // Encrypt data
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Decrypt data
  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Movie count with encryption
  get movieCount(): number {
    const encryptedCount = localStorage.getItem('movieCount');
    if (!encryptedCount) return 0;
    
    try {
      return parseInt(this.decryptData(encryptedCount)) || 0;
    } catch (e) {
      console.error('Decryption failed', e);
      return 0;
    }
  }

  set movieCount(value: number) {
    const encrypted = this.encryptData(value.toString());
    localStorage.setItem('movieCount', encrypted);
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadInitialData();

    if (!this.isLoggedIn && this.movieCount >= 3) {
      this.showSignupForm = true;
    } else {
      this.showSignupForm = false;
    }
  }

  checkAuthStatus() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      const encryptedUser = localStorage.getItem('user');
      this.userData = encryptedUser ? JSON.parse(this.decryptData(encryptedUser)) : '';

      if (!status) {
        const count = this.movieCount;
        this.showSignupForm = count >= 3;
      }

      if (status) {
        this.showSignupForm = false;
      }
    });
  }

  // Signup Form
  signupFormData: FormGroup = new FormGroup({
    'username': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),
  });

  get username() { return this.signupFormData.controls['username']; }
  get email() { return this.signupFormData.controls['email']; }
  get password() { return this.signupFormData.controls['password']; }

  signup() {
    // Encrypt sirf password ko karo
    const encryptedPassword = this.encryptData(this.signupFormData.value.password);
  
    // Baqi user data as it is rakh lo
    const userData = {
      ...this.signupFormData.value,
      password: encryptedPassword
    };
  
    // Sirf password encrypted hai, poora object JSON.stringify karke localStorage mein save karo
    localStorage.setItem('user', JSON.stringify(userData));
  
    this.authService.login();
    this.signupFormData.reset();
    this.showSignupForm = false;
  }
  

  // Rest of your existing methods remain the same
  loadInitialData() {
    this.service.getBannerApi().subscribe(res => this.bannerData = res.results);
    this.service.getTrendingApi().subscribe(res => {
      this.trendingData = res.results;
      this.showDelayedCard(this.arrTrending, this.trendingData);
    });
    this.loadAllMovies();
  }

  clickedMovie() {
    if (!this.isLoggedIn) this.movieCount = this.movieCount + 1;
    if (this.movieCount >= 3) this.showSignupForm = true;
  }

  showDelayedCard(singleDataArr: Movie[], allDataArr: Movie[]) {
    let index: number = 0;
    let interval = setInterval(() => {
      if (index < allDataArr.length) {
        singleDataArr[index] = allDataArr[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  }

  loadAllMovies() {
    this.service.getActionApi().subscribe(res => {
      this.actionData = res.results;
      this.showDelayedCard(this.arrAction, this.actionData);
    });

    this.service.getAdventureApi().subscribe(res => {
      this.adventureData = res.results;
      this.showDelayedCard(this.arrAdventure, this.adventureData);
    });

    this.service.getAnimationApi().subscribe(res => {
      this.animationData = res.results;
      this.showDelayedCard(this.arrAnimation, this.animationData);
    });

    this.service.getSciFiApi().subscribe(res => {
      this.sciFiData = res.results;
      this.showDelayedCard(this.arrSciFi, this.sciFiData);
    });
  }

  bannerWatchBtn(val: any) {
    if (this.showSignupForm) {
      Swal.fire("Create account first");
    } else {
      this.route.navigate([`/movie-details/${val}`]);
    }
  }
}