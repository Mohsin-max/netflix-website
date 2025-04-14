import { Routes } from '@angular/router';
import { TrendingComponent } from './components/trending/trending.component';
import { HomeComponent } from './components/home/home.component';
import { ActionComponent } from './components/action/action.component';
import { AdventureComponent } from './components/adventure/adventure.component';
import { AnimationComponent } from './components/animation/animation.component';
import { ScifiComponent } from './components/scifi/scifi.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { FavoriteComponent } from './components/favorite/favorite.component';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'trending', component: TrendingComponent },
    { path: 'action', component: ActionComponent },
    { path: 'adventure', component: AdventureComponent },
    { path: 'animation', component: AnimationComponent },
    { path: 'scifi', component: ScifiComponent },
    { path: 'movie-details/:id', component: MovieDetailsComponent },
    { path: 'favorite', component: FavoriteComponent }
];
