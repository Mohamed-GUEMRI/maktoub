import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticleComponent } from './components/article/article.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoryBarComponent } from './components/category-bar/category-bar.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavbarMobileComponent } from './components/navbar-mobile/navbar-mobile.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SearchMobileComponent } from './components/search-mobile/search-mobile.component';
import { LandingpComponent } from './components/landingp/landingp.component';
import { OurStoryComponent } from './components/our-story/our-story.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ArticleCardComponent,
    SideBarComponent,
    ArticleComponent,
    NotFoundComponent,
    HomeComponent,
    UserComponent,
    CreateArticleComponent,
    ProfileComponent,
    CategoryBarComponent,
    NavbarMobileComponent,
    TextEditorComponent,
    SearchMobileComponent,
    LandingpComponent,
    OurStoryComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
    ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent,
    NavBarComponent
  ]
})
export class AppModule { }
