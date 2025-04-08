import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from "../skeleton-card/skeleton-card.component";
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { Movie } from '../../interfaces/movie';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trending',
  imports: [RouterModule,CommonModule, SkeletonCardComponent, MovieCardComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.scss'
})
export class TrendingComponent implements OnInit {

  constructor(private service: MovieApiService) { }

  arrTrending: Movie[] = []
  trendingData: Movie[] = []

  ngOnInit(): void {

    this.service.getTrendingApi().subscribe(res => {

      this.trendingData = res.results

      let index: number = 0;

      let interval = setInterval(() => {

        if (index < this.trendingData.length) {

          this.arrTrending[index] = this.trendingData[index]
          index++

        } else {

          clearInterval(interval)

        }

      }, 500);

    })

  }

}
