import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-category-bar',
  templateUrl: './category-bar.component.html',
  styleUrls: ['./category-bar.component.css']
})

export class CategoryBarComponent implements OnInit {
  categories = [
    { name: 'All', id: 0 },
    { name: 'Technology', id: 1 },
    { name: 'Business & Finance', id: 4 },
    { name: 'Politics & Society', id: 5 },
    { name: 'Culture & Arts', id: 6 },
    { name: 'Science & Innovation', id: 7 },
    { name: 'Health & Wellness', id: 8 },
    { name: 'Travel & Adventure', id: 11 },
    { name: 'Personal Development', id: 12 }
  ];

  selectedCategory: number = 0;
  articles: any[] = [];
  noArticle : boolean = true;

  @Output() articlesUpdated = new EventEmitter<any[]>();

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.fetchArticles(0);
  }

  filterByCategory(category: any) {
    this.selectedCategory = category.id;
    this.fetchArticles(category.id);
  }

  fetchArticles(categoryId: number) {
    const observable = categoryId === 0 
      ? this.articleService.getAllArticles()
      : this.articleService.getArticlesByCategory(categoryId);

    observable.subscribe({
      next: (data: any) => {
        this.noArticle = false;
        this.articles = data.$values;
        this.articlesUpdated.emit(this.articles);
      },
      error: (err) => {
        console.error('Error fetching articles:', err);
        this.noArticle = true;
        alert('no articles in this category!');
      }
    });
  }

  scroll(direction: number) {
    const categoryBar = document.querySelector('.category-bar') as HTMLElement;
    if (categoryBar) {
      categoryBar.scrollLeft += direction;
    }
  }
}