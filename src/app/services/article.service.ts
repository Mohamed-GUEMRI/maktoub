import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {
     this.loadConfig();
  }
  loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = `${config.apiUrl}/Article`;
      console.log(this.apiUrl)
    });
  }

  // Method to fetch all articles
  getAllArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Method to fetch a single article by ID
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getAuthorById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author/${id}`);
  }

  getAuthor(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/author?authorId=${id}`);
  }

  addArticle(articleRequest : any): Observable<any> {
    return this.http.post(this.apiUrl, articleRequest);
  }

  likeArticle(id: any, userId:any): Observable<any> {
    return this.http.post<number>(`${this.apiUrl}/${id}/like?userId=`+userId, {});
}

isArticleLiked(id: any, userId:any): Observable<any> {
  return this.http.post<number>(`${this.apiUrl}/${id}/isLiked?userId=`+userId, {});
}

viewArticle(id: any, userId:any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/${id}/view?userId=`+userId, {});
}

searchArticles(query: string): Observable<Article[]> {
  return this.http.get<Article[]>(`${this.apiUrl}/search?query=${query}`);
}

getArticlesByCategory(categoryId: number): Observable<Article[]> {
  return this.http.get<Article[]>(`${this.apiUrl}/category/${categoryId}`);
}

getArticleCategories(articleId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/articleCategory?articleId=${articleId}`);
}
}
