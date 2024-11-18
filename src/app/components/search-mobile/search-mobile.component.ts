import { Component } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/models/article';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-mobile',
  templateUrl: './search-mobile.component.html',
  styleUrls: ['./search-mobile.component.css']
})
export class SearchMobileComponent {
  searchQuery: string = '';
  searchResults: Article[] = [];
  noResultsFound: boolean = false;
  loading: boolean = false;

  constructor(private articleService: ArticleService, private router: Router) {}

  onSearch() {
    this.loading = true;
    this.noResultsFound = false;
    if (this.searchQuery.trim()) {
      this.articleService.searchArticles(this.searchQuery).subscribe(
        (results: any) => {
          this.searchResults = results.$values;
          console.log(results.$values);
          this.noResultsFound = results.length === 0;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching search results', error);
        }
      );
    } else {
      this.searchResults = [];
    }
  }

  goToArticle(articleId: number) {
    this.searchResults = [];
    this.router.navigate(['/articles/' + articleId]);
  }
}