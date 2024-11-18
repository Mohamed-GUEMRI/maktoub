import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  articles: any[] = [];  // Store the articles here to pass to app-article-card

  constructor() {}

  ngOnInit(): void {
    // You can fetch default articles if needed on component initialization
  }

  onArticlesUpdated(newArticles: any[]): void {
    // This function will be called when the CategoryBarComponent emits updated articles
    this.articles = newArticles;
  }
}
