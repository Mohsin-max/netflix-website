import { Component, HostListener, Input } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, SkeletonCardComponent, MovieCardComponent, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  constructor(private service: MovieApiService, private authService: AuthService) { }

  arrTrending: Movie[] = []
  trendingData: Movie[] = []

  arrAction: Movie[] = []
  actionData: Movie[] = []

  arrAdventure: Movie[] = []
  adventureData: Movie[] = []

  arrAnimation: Movie[] = []
  animationData: Movie[] = []

  arrSciFi: Movie[] = []
  sciFiData: Movie[] = []

  arrThriller: Movie[] = []
  thrillerData: Movie[] = []

  bannerData: Movie[] = [];

  combinedData: Movie[] = []


  userData: any;

  isLoggedIn: any;


  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)

    let data = localStorage.getItem('user') || '';

    this.userData = data

    this.service.getBannerApi().subscribe(res => this.bannerData = res.results)

    this.service.getTrendingApi().subscribe(res => {

      this.trendingData = res.results
      this.showDelayedCard(this.arrTrending, this.trendingData)

    })


    if (this.userData) {

      this.loadAllMovies()

    }


  }

  showDelayedCard(singleDataArr: Movie[], allDataArr: Movie[]) {

    let index: number = 0;

    let interval = setInterval(() => {

      if (index < allDataArr.length) {

        singleDataArr[index] = allDataArr[index]
        index++

      } else {

        clearInterval(interval)

      }

    }, 500);


  }

  // USER FORM GROUP

  signupFormData: FormGroup = new FormGroup({

    'username': new FormControl('', [Validators.required]),
    'email': new FormControl('', [Validators.required]),
    'password': new FormControl('', [Validators.required]),

  })

  // ALL GETERS

  get username() {

    return this.signupFormData.controls['username']

  }
  get email() {

    return this.signupFormData.controls['email']

  }
  get password() {

    return this.signupFormData.controls['password']

  }



  // SCROLLING LOCK FUNCTION

  // @HostListener('window:scroll', ['$event']) onScroll(event: Event) {

  //   const scrollPosition = window.pageYOffset
  //   const maxScroll = window.innerHeight * 1

  //   if (!this.isLoggedIn) {

  //     if (scrollPosition > maxScroll) {

  //       window.scrollTo({
  //         top: maxScroll,
  //         behavior: 'instant'
  //       })

  //     }
  //   }


  // }

  // SIGN UP FUNCTION

  signup() {


    localStorage.setItem('user', JSON.stringify(this.signupFormData.value))
    this.authService.login()
    this.signupFormData.reset()
    this.loadAllMovies()

  }

  loadAllMovies() {
    this.service.getActionApi().subscribe(res => {
      this.actionData = res.results
      this.showDelayedCard(this.arrAction, this.actionData)
      this.combinedData.push(...this.actionData)
    })

    this.service.getAdventureApi().subscribe(res => {
      this.adventureData = res.results
      this.showDelayedCard(this.arrAdventure, this.adventureData)
      this.combinedData.push(...this.adventureData)
    })

    this.service.getAnimationApi().subscribe(res => {
      this.animationData = res.results
      this.showDelayedCard(this.arrAnimation, this.animationData)
      this.combinedData.push(...this.animationData)
    })

    this.service.getSciFiApi().subscribe(res => {
      this.sciFiData = res.results
      this.showDelayedCard(this.arrSciFi, this.sciFiData)
      this.combinedData.push(...this.sciFiData)
    })
  }


}
