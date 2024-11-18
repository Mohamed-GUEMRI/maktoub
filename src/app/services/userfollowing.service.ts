import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User'; // Adjust the import based on your User model location

@Injectable({
  providedIn: 'root'
})
export class UserFollowingService {
  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {  
     this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/UserFollowing";
    });
  }


  toggleFollow(followerId: any, followedId: any): Observable<string> {
    const params = new HttpParams()
        .set('followerId', followerId.toString())
        .set('followedId', followedId.toString());
    
    return this.http.post<string>(`${this.apiUrl}/toggle-follow`, null, { params, responseType: 'text' as 'json' });
}



  getFollowersCount(userId: any): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/followers-count`);
  }

  getFollowingsCount(userId: any): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${userId}/followings-count`);
  }

  isFollowing(followerId: any, followedId: any): Observable<boolean> {
    const params = new HttpParams()
      .set('followerId', followerId.toString())
      .set('followedId', followedId.toString());
    
    return this.http.get<boolean>(`${this.apiUrl}/is-following`, { params });
  }

  getFollowersList(userId: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/followers`);
  }

  getFollowingsList(userId: any): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/${userId}/followings`);
  }
}
