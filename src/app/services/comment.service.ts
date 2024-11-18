import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment'; // Adjust the path as needed

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API
  constructor(private http: HttpClient) { 
   this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/Comment";
    });
  }


  // Method to post a comment
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }
  
}
