import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { CommonModule } from '@angular/common';
import { Movie } from '../../interfaces/movie.model';
import { RouterModule } from '@angular/router';
import { MovieResponse } from '../../interfaces/movie-response.model';

@Component({
  selector: 'app-scifi',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent, RouterModule],
  templateUrl: './scifi.component.html',
  styleUrl: './scifi.component.scss'
})
export class ScifiComponent implements OnInit {

  constructor(private service: MovieApiService) { }

  arrScifi: Movie[] = []
  scifiData: Movie[] = []

  ngOnInit(): void {

    this.service.getSciFiApi().subscribe((res: MovieResponse) => {

      this.scifiData = res.results

      let index: number = 0;

      let interval = setInterval(() => {

        if (index < this.scifiData.length) {

          this.arrScifi[index] = this.scifiData[index]
          index++

        } else {

          clearInterval(interval)

        }

      }, 500);

    })

  }


}
