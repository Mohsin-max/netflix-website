import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { CommonModule } from '@angular/common';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Movie } from '../../interfaces/movie';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-animation',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent,RouterModule],
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.scss'
})
export class AnimationComponent implements OnInit {

  constructor(private service: MovieApiService) { }

  arrAnimation: Movie[] = []
  animationData: Movie[] = []

  ngOnInit(): void {

    this.service.getAnimationApi().subscribe(res => {

      this.animationData = res.results

      let index: number = 0;

      let interval = setInterval(() => {

        if (index < this.animationData.length) {

          this.arrAnimation[index] = this.animationData[index]
          index++

        } else {

          clearInterval(interval)

        }

      }, 500);

    })

  }


}
