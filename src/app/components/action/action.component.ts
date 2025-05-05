import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from "../skeleton-card/skeleton-card.component";
import { MovieCardComponent } from "../movie-card/movie-card.component";
import { Movie } from '../../interfaces/movie.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-action',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent, RouterModule],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})
export class ActionComponent implements OnInit {

  constructor(private service: MovieApiService) { }

  arrAction: Movie[] = []
  actionData: Movie[] = []

  ngOnInit(): void {

    this.service.getActionApi().subscribe(res => {

      this.actionData = res.results

      let index: number = 0;

      let interval = setInterval(() => {

        if (index < this.actionData.length) {

          this.arrAction[index] = this.actionData[index]
          index++
        } else {

          clearInterval(interval)

        }
      }, 500);

    })

  }

}
