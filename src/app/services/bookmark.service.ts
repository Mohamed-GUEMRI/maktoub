import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for the Bookmark model
export interface Bookmark {
  id: number;
  userId: number;
  articleId: number;
  createdAt: Date;
}

// Interface for the bookmark request
export interface BookmarkRequest {
  userId: any;
  articleId: any;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {  
        this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/Bookmark";
    });
  }

  // Get all bookmarks
  getAllBookmarks(): Observable<Bookmark[]> {
    return this.http.get<Bookmark[]>(this.apiUrl);
  }

  // Get bookmark by ID
  getBookmarkById(id: number): Observable<Bookmark> {
    return this.http.get<Bookmark>(`${this.apiUrl}/${id}`);
  }

  isExist(userid: any, articleId:any): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?userId=${userid}&articleId=${articleId}`);
  }

  // Create new bookmark
  createBookmark(bookmark: BookmarkRequest): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl, bookmark);
  }

  // Update bookmark
  updateBookmark(id: number, bookmark: BookmarkRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, bookmark);
  }

  // Delete bookmark
  deleteBookmark(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Get bookmarks by user ID
  getBookmarksByUserId(userId: number): Observable<Bookmark[]> {
    return this.http.get<Bookmark[]>(`${this.apiUrl}/user/${userId}`);
  }
}