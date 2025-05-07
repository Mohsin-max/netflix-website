import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { debounce } from '../../utils/debounce';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule, Location } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Movie } from '../../interfaces/movie.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from "crypto-js";
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {


  private readonly secretKey = "MyMovieApp123!";

  // This function will prevent dropdown from closing on text selection
  onDropdownMenuMouseDown(event: MouseEvent): void {
    event.stopPropagation();
  }

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  dropdownVisible: boolean = false;

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown() {
    this.dropdownVisible = false;
  }

  // This will run on any global click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }


  constructor(
    private service: MovieApiService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private storageService: StorageService
  ) { }

  searchedMovie: Movie[] = []

  isLoggedIn: any;

  selectedGenre: string = 'All'

  user: any;

  currentLocation: string = ''

  decryptedPasswod: any = ''

  hasSearched: boolean = false

  ngOnInit(): void {


    this.authService.currentUser$.subscribe(res => {

      this.user = res

      if (this.user && this.user.password) {

        const bytes = CryptoJS.AES.decrypt(this.user.password, this.secretKey);
        this.decryptedPasswod = bytes.toString(CryptoJS.enc.Utf8);
      }

    })

    this.router.events.subscribe(event => {


      if (event instanceof NavigationEnd) {

        this.currentLocation = this.location.path()

        this.searchedMovie = []
      }


    })

    this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status)

  }

  // it contains a wrapper function.
  debouncedFunc = debounce((event: any) => {
    const query = event;

    // If input is empty, reset both variables
    if (query === '') {
      this.searchedMovie = [];
      this.hasSearched = false;
      return;
    }

    this.service.getSearchedApi(query).subscribe({
      next: (res) => {
        this.searchedMovie = res.results;

        // If no results found
        if (this.searchedMovie.length === 0) {
          this.hasSearched = true;
        } else {
          this.hasSearched = false;
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.searchedMovie = [];
        this.hasSearched = true;
      }
    });
  }, 500);




  logout() {

    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.storageService.setIsLoggedIn(false);
        localStorage.removeItem('currentUser');
        this.authService.logout();

        Swal.fire({
          position: "top-end",
          timer: 2000,
          toast: true,
          title: "Logout!",
          icon: "success",
          showConfirmButton: false
        });

        this.router.navigate(['/']);
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

  changePassword() {
    Swal.fire({
      title: 'Enter Passwords',
      html:
        `<input type="password" id="password1" class="swal2-input" placeholder="Current Password">` +
        `<input type="password" id="password2" class="swal2-input" placeholder="New Password">`,
      focusConfirm: false,
      showCancelButton: true,
      width: '400px',
      confirmButtonText: 'Submit',
      preConfirm: () => {
        const password1 = (document.getElementById('password1') as HTMLInputElement).value;
        const password2 = (document.getElementById('password2') as HTMLInputElement).value;

        if (!password1 || !password2) {
          Swal.showValidationMessage('Both fields are required!');
          return false;
        }

        if (this.decryptedPasswod !== password1) {
          Swal.showValidationMessage("Current password is incorrect!");
          return false;
        }

        return { password1, password2 };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newPassword = result.value.password2;

        // Encrypt new password
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword, this.secretKey).toString();

        // Update currentUser
        this.user.password = encryptedPassword;
        this.authService.setUser(this.user)

        // Update users array
        const users = this.storageService.getUser();
        const updatedUsers = users.map((user: any) => {
          if (user.email === this.user.email) {
            return { ...user, password: encryptedPassword };
          }
          return user;
        });

        this.storageService.setUser(updatedUsers);

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Password changed successfully!",
          showConfirmButton: false,
          timer: 2000
        });


      }
    });
  }

}

