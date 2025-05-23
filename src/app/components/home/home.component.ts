import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { MovieResponse } from '../../interfaces/movie-response.model';
import { Movie } from '../../interfaces/movie.model';
import { StorageService } from '../../services/storage.service';
import { LocationUpgradeModule } from '@angular/common/upgrade';


@Component({
  selector: 'app-home',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent, RouterModule, SignupComponent, LoginComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
  private readonly secretKey = "MyMovieApp123!";

  // Movie Data Arrays
  bannerData: Movie[] = [];
  trendingData: Movie[] = [];
  actionData: Movie[] = [];
  adventureData: Movie[] = [];
  animationData: Movie[] = [];
  sciFiData: Movie[] = [];

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

  resetFilter() {

    this.hideShowAccordion = true

    this.filteredarray = [];
    this.hideShowAccordion = true;

    this.advanceFilterForm.reset({
      status: '',
      fromDate: '',
      toDate: '',
      language: '',
      country: '',
      genre: '',
      search: ''
    });

    // this.advanceFilterForm.reset();
  }

  hideShowAccordion: boolean = true

  years: any[] = [];

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

  isAnyFieldFilled: boolean = false;

  isLoading: boolean = false;

  badgesVal: any;



  constructor(
    private service: MovieApiService,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  advanceFilterForm = new FormGroup({
    status: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    language: new FormControl(''),
    country: new FormControl(''),
    genre: new FormControl(''),
    search: new FormControl('')
  });


  private destroy$ = new Subject<void>()

  ngOnInit(): void {


    this.advanceFilterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {

      const { status, fromDate, toDate, language, country, genre, search } = values;

      // Agar koi bhi ek field filled hai
      if (status || fromDate || toDate || language || country || genre || search) {
        this.isAnyFieldFilled = true;
      } else {
        this.isAnyFieldFilled = false;
      }
    });

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }

    this.checkAuthStatus();
    this.loadInitialData();
    this.loadMovieCount();

    // this.genreChange()  

    // Only load other movies if logged in or movieCount < 3
    if (this.isLoggedIn || this.movieCount < 3) {
      this.loadAllMovies();
    }
  }

  results: any[] = []
  advanceFilterFormSubmit() {

    this.hideShowAccordion = false
    this.modal.hide();
    this.isModalOpen = false;
    this.isLoading = true; // 🚀 Start loading spinner

    this.badgesVal = this.advanceFilterForm.value

    const { status, fromDate, toDate, language, country, genre, search } = this.advanceFilterForm.value;
    this.filteredarray = []; // Clear previous results

    if (search == '') {

      const requests = this.allMovies.map(m => this.service.getMovieDetailsApi(m.id));

      forkJoin(requests).subscribe(responses => {

        responses.forEach(res => {
          const releaseYear = parseInt(res.release_date?.slice(0, 4));
          const fromYear = Number(fromDate);
          const toYear = Number(toDate);

          const statusMatch = status ? res.status === status : true;
          const yearMatch = fromDate && toDate ? (releaseYear >= fromYear && releaseYear <= toYear) : true;
          const languageMatch = language ? res.original_language === language : true;
          const countryMatch = country ? res.origin_country[0].toLowerCase() === country.toLowerCase() : true
          const genreMatch = genre ? res.genres.some((g: any) => g.name.toLowerCase() === genre.toLowerCase()) : true;

          if (statusMatch && yearMatch && languageMatch && genreMatch && countryMatch) {

            const alreadyExists = this.filteredarray.some(m => m.id === res.id);
            if (!alreadyExists) this.filteredarray.push(res);

          }
        });

        this.isLoading = false; // ❌ Stop loading spinner

      });

    } else if (search !== '') {

      this.service.getSearchedApi(search).subscribe(res => {

        this.filteredarray = res.results
        this.isLoading = false; // ❌ Stop loading spinner

      })

    }

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
    const count = this.storageService.getMovieCount();
    this.movieCount = count ? parseInt(this.decryptData(count)) : 0;
  }

  saveMovieCount() {
    this.storageService.setMovieCount(this.encryptData(this.movieCount.toString()))

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
    this.service.getBannerApi().subscribe((res: MovieResponse) => this.bannerData = res.results);
    this.service.getTrendingApi().subscribe((res: MovieResponse) => {
      this.trendingData = res.results;
      this.arrTrending = new Array(res.results.length).fill(false);
      this.showDelayedCards(this.arrTrending);
    });
  }

  loadAllMovies() {
    if (this.isLoggedIn || this.movieCount < 3) {

      this.service.getActionApi().subscribe((res: MovieResponse) => {
        this.actionData = res.results;
        this.arrAction = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAction);
        this.updateCombinedMovies(); // ✅ update combined
      });

      this.service.getAdventureApi().subscribe((res: MovieResponse) => {
        this.adventureData = res.results;
        this.arrAdventure = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAdventure);
        this.updateCombinedMovies();
      });

      this.service.getAnimationApi().subscribe((res: MovieResponse) => {
        this.animationData = res.results;
        this.arrAnimation = new Array(res.results.length).fill(false);
        this.showDelayedCards(this.arrAnimation);
        this.updateCombinedMovies();
      });

      this.service.getSciFiApi().subscribe((res: MovieResponse) => {
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
      showConfirmButton: false,
      position: "top-end",
      icon: "success",
      title: "Account created! Please login.",
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

  modal: any; // Bootstrap modal ka reference
  isModalOpen = false; // Modal ka status track karenge

  @HostListener('document:keydown', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isLoggedIn) {

      if (event.ctrlKey && event.key === 'q') {

        event.preventDefault();
        this.toggleModal();
      }
    }
  }

  toggleModal() {
    const modalElement = document.getElementById('shortcutModal');
    if (modalElement) {
      if (!this.modal) {
        this.modal = new (window as any).bootstrap.Modal(modalElement);
      }

      if (this.isModalOpen) {
        this.modal.hide();
        this.isModalOpen = false;
      } else {
        this.modal.show();
        this.isModalOpen = true;
      }
    }
  }

  ngOnDestroy(): void {

    this.destroy$.next()
    this.destroy$.complete()

  }

}