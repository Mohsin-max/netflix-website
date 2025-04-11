import { Component, OnInit } from '@angular/core';
import { MovieApiService } from '../../services/movie-api.service';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { Movie } from '../../interfaces/movie';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adventure',
  imports: [CommonModule, SkeletonCardComponent, MovieCardComponent,RouterModule],
  templateUrl: './adventure.component.html',
  styleUrl: './adventure.component.scss'
})
export class AdventureComponent implements OnInit {

  constructor(private service: MovieApiService) { }

  arrAdventure: Movie[] = []
  adventureData: Movie[] = []

  ngOnInit(): void {

    this.service.getAdventureApi().subscribe(res => {

      this.adventureData = res.results

      let index: number = 0;

      let interval = setInterval(() => {

        if (index < this.adventureData.length) {

          this.arrAdventure[index] = this.adventureData[index]
          index++
        } else {

          clearInterval(interval)

        }
      }, 500);

    })

  }

}
