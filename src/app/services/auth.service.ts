import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {  
       this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/Auth";
    });
  }

  public register(user: User): Observable<string> {
    // Change the response type to text since the API returns a plain text message
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'text'
    });
  }

  public login(user: User): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, user, {
      responseType: 'text'
    });
  }
}