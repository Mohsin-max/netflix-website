// import { Component, HostListener, Input } from '@angular/core';
// import { MovieApiService } from '../../services/movie-api.service';
// import { CommonModule } from '@angular/common';
// import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
// import { MovieCardComponent } from '../movie-card/movie-card.component';
// import { NgxPaginationModule } from 'ngx-pagination';
// import { RouterModule } from '@angular/router';
// import { Movie } from '../../interfaces/movie';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-home',
//   imports: [RouterModule, CommonModule, SkeletonCardComponent, MovieCardComponent, NgxPaginationModule, ReactiveFormsModule],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss'
// })

// export class HomeComponent {

//   constructor(private service: MovieApiService, private authService: AuthService) { }

//   arrTrending: Movie[] = []
//   trendingData: Movie[] = []

//   arrAction: Movie[] = []
//   actionData: Movie[] = []

//   arrAdventure: Movie[] = []
//   adventureData: Movie[] = []

//   arrAnimation: Movie[] = []
//   animationData: Movie[] = []

//   arrSciFi: Movie[] = []
//   sciFiData: Movie[] = []

//   arrThriller: Movie[] = []
//   thrillerData: Movie[] = []

//   bannerData: Movie[] = [];

//   combinedData: Movie[] = []


//   userData: any;

//   isLoggedIn: any;

//   movieCount: any = parseInt(localStorage.getItem('movieCount') || '0')

//   showSignupForm: boolean = false


//   ngOnInit(): void {

//     console.log(this.movieCount);

//     this.checkUserStatus();


//     if (this.movieCount >= 3) {

//       this.showSignupForm = true

//     }


//     this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)

//     let data = localStorage.getItem('user') || '';

//     this.userData = data

//     this.service.getBannerApi().subscribe(res => this.bannerData = res.results)

//     this.service.getTrendingApi().subscribe(res => {

//       this.trendingData = res.results
//       this.showDelayedCard(this.arrTrending, this.trendingData)

//     })

//     this.loadAllMovies()



//     // if (this.userData) {

//     //   this.loadAllMovies()

//     // }


//   }

//   checkUserStatus() {
//     const user = localStorage.getItem('user');
//     if (user) {
//       this.authService.login(); // login status true kar do
//       this.showSignupForm = false;
//     } else {
//       if (this.movieCount >= 3) {
//         this.showSignupForm = true;
//       }
//     }
//   }

//   showDelayedCard(singleDataArr: Movie[], allDataArr: Movie[]) {

//     let index: number = 0;

//     let interval = setInterval(() => {

//       if (index < allDataArr.length) {

//         singleDataArr[index] = allDataArr[index]
//         index++

//       } else {

//         clearInterval(interval)

//       }

//     }, 500);


//   }

//   // USER FORM GROUP

//   signupFormData: FormGroup = new FormGroup({

//     'username': new FormControl('', [Validators.required]),
//     'email': new FormControl('', [Validators.required]),
//     'password': new FormControl('', [Validators.required]),

//   })

//   // ALL GETERS

//   get username() {

//     return this.signupFormData.controls['username']

//   }
//   get email() {

//     return this.signupFormData.controls['email']

//   }
//   get password() {

//     return this.signupFormData.controls['password']

//   }



//   // SCROLLING LOCK FUNCTION

//   // @HostListener('window:scroll', ['$event']) onScroll(event: Event) {

//   //   const scrollPosition = window.pageYOffset
//   //   const maxScroll = window.innerHeight * 1

//   //   if (!this.isLoggedIn) {

//   //     if (scrollPosition > maxScroll) {

//   //       window.scrollTo({
//   //         top: maxScroll,
//   //         behavior: 'instant'
//   //       })

//   //     }
//   //   }


//   // }

//   // SIGN UP FUNCTION

// signup() {
//   if (this.signupFormData.valid) {
//     localStorage.setItem('user', JSON.stringify(this.signupFormData.value));
//     this.authService.login();
//     this.showSignupForm = false; // form hide after signup
//   }
// }

//   loadAllMovies() {
//     this.service.getActionApi().subscribe(res => {
//       this.actionData = res.results
//       this.showDelayedCard(this.arrAction, this.actionData)
//       this.combinedData.push(...this.actionData)
//     })

//     this.service.getAdventureApi().subscribe(res => {
//       this.adventureData = res.results
//       this.showDelayedCard(this.arrAdventure, this.adventureData)
//       this.combinedData.push(...this.adventureData)
//     })

//     this.service.getAnimationApi().subscribe(res => {
//       this.animationData = res.results
//       this.showDelayedCard(this.arrAnimation, this.animationData)
//       this.combinedData.push(...this.animationData)
//     })

//     this.service.getSciFiApi().subscribe(res => {
//       this.sciFiData = res.results
//       this.showDelayedCard(this.arrSciFi, this.sciFiData)
//       this.combinedData.push(...this.sciFiData)
//     })
//   }


//   clickedMovie() {

//     this.movieCount += 1
//     localStorage.setItem("movieCount", JSON.stringify(this.movieCount))


//     if (this.movieCount >= 3) this.showSignupForm = true

//   }

// }












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

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, SkeletonCardComponent, MovieCardComponent, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

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

  // Movie click tracking
  get movieCount(): number {
    const count = localStorage.getItem('movieCount');
    return count ? parseInt(count) : 0;
  }
  set movieCount(value: number) {
    localStorage.setItem('movieCount', value.toString());
  }

  showSignupForm: boolean = true;

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadInitialData();

    // Show form if user is not logged in and already watched 3 movies
    if (!this.isLoggedIn && this.movieCount >= 3) {
      this.showSignupForm = true;

    } else {

      this.showSignupForm = false;
    }
  }

  checkAuthStatus() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.userData = localStorage.getItem('user') || '';

      if (!status) {
        const count = this.movieCount;
        this.showSignupForm = count >= 3;
      }

      // When user logs in hide kro signup form
      if (status) {
        this.showSignupForm = false;
      }
    });
  }

  loadInitialData() {
    this.service.getBannerApi().subscribe(res => this.bannerData = res.results);
    this.service.getTrendingApi().subscribe(res => {
      this.trendingData = res.results;
      this.showDelayedCard(this.arrTrending, this.trendingData);
    });

    // Load all movies
    this.loadAllMovies();
  }

  clickedMovie() {
    if (!this.isLoggedIn) this.movieCount = this.movieCount + 1

    // Show signup form after 3 movies

    if (this.movieCount >= 3) this.showSignupForm = true;
  }

  // @HostListener('window:scroll', ['$event']) onScroll(event: Event) { 

  //   const scrollPosition = window.pageYOffset
  //   const maxScroll = window.innerHeight * 1.2

  //   if (!this.isLoggedIn) {

  //     if (scrollPosition > maxScroll) {

  //       window.scrollTo({
  //         top: maxScroll,
  //         behavior: 'instant'
  //       })

  //     }
  //   }


  // }


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
    localStorage.setItem('user', JSON.stringify(this.signupFormData.value));
    this.authService.login();
    this.signupFormData.reset();
    // this.movieCount = 0; 
    this.showSignupForm = false;
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
      
    }else{

      this.route.navigate([`/movie-details/${val}`])

    }
  }
}