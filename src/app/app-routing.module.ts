import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';  // Home page
import { ArticleComponent } from './components/article/article.component'; // Article view
import { UserComponent } from './components/user/user.component';  // Author's profile
import { CreateArticleComponent } from './components/create-article/create-article.component'; // Article creation
import { NotFoundComponent } from './components/not-found/not-found.component'; // 404 page
import { ProfileComponent } from './components/profile/profile.component';
import { SearchMobileComponent } from './components/search-mobile/search-mobile.component';
import { AuthGuard } from './guards/auth.guard';
import { LandingpComponent } from './components/landingp/landingp.component';
import { NotAuthGuard } from './guards/notauth.guard';
import { OurStoryComponent } from './components/our-story/our-story.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'articles/:id', component: ArticleComponent}, 
  { path: 'notfound', component: NotFoundComponent },
  { path: 'user/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateArticleComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchMobileComponent, canActivate: [AuthGuard] },
  { path: '', component: LandingpComponent, canActivate: [NotAuthGuard] },
  { path: 'ourstory', component: OurStoryComponent },
  { path: '**', redirectTo: 'notfound' } 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
