import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleTagService {

  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {  
      this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/ArticleTags";
    });
  }
  addTag(articleTagRequest : any): Observable<any> {
    return this.http.post(this.apiUrl, articleTagRequest);
  }
  getTagsByArticleId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/article/${id}`);
  }
}