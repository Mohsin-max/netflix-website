import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieApiService } from '../../services/movie-api.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule,NgxPaginationModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: MovieApiService) { }


  arrMovieDetails: any;
  movieVideoKey: any;
  arrMovieCast: any;

  p: number = 1
  pSize: number = 15

  ngOnInit(): void {

    window.scrollTo(0,0)

    let movie_id = this.route.snapshot.paramMap.get('id');

    this.service.getMovieDetailsApi(movie_id).subscribe(res => this.arrMovieDetails = res)

    this.service.getMovieVideoApi(movie_id).pipe(

      map(elem => elem.results.filter((f: any) => f.type == "Teaser"))

    ).subscribe(res => this.movieVideoKey = res[0].key)


    this.service.getMovieCastApi(movie_id).subscribe(res => {

      this.arrMovieCast = res.cast

    })

  }

  getHoursAndMinutes(time: number) {

    const hours = Math.floor(time / 60);
    const min = time % 60

    return `${hours}h ${min}m`

  }

}
