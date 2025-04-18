import { Routes } from '@angular/router';
import { TrendingComponent } from './components/trending/trending.component';
import { HomeComponent } from './components/home/home.component';
import { ActionComponent } from './components/action/action.component';
import { AdventureComponent } from './components/adventure/adventure.component';
import { AnimationComponent } from './components/animation/animation.component';
import { ScifiComponent } from './components/scifi/scifi.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'trending', component: TrendingComponent, canActivate: [authGuard] },
    { path: 'action', component: ActionComponent, canActivate: [authGuard] },
    { path: 'adventure', component: AdventureComponent, canActivate: [authGuard] },
    { path: 'animation', component: AnimationComponent, canActivate: [authGuard] },
    { path: 'scifi', component: ScifiComponent, canActivate: [authGuard] },
    { path: 'movie-details/:id', component: MovieDetailsComponent, canActivate: [authGuard] },
    { path: 'favorite', component: FavoriteComponent, canActivate: [authGuard] }
];
