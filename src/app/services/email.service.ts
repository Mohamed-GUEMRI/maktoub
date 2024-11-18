import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  constructor(private http: HttpClient) {
     this.loadConfig();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/Email";
    });
  }
  // Méthode pour tester l'envoi d'un email
  testMail(): Observable<any> {
    return this.http.get(`${this.apiUrl}/testmail`);
  }
  // Méthode pour envoyer un email personnalisé
sendMail(to: string, subject: string, content: string): Observable<any> {
  // Encode les paramètres pour gérer les caractères spéciaux dans l'URL
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedContent = encodeURIComponent(content);
  // Construction de l'URL avec les paramètres encodés
  const url = `${this.apiUrl}/SendMail?to=${encodedTo}&subject=${encodedSubject}&content=${encodedContent}`;
  return this.http.get(url);
}

  // Méthode pour envoyer un email de réinitialisation de mot de passe
  sendPasswordResetEmail(to: string, token: string, appUrl: string): Observable<any> {
    const body = { to, token, appUrl };
    return this.http.post(`${this.apiUrl}/send-password-reset-email`, body);
  }
   // Méthode pour envoyer un email de confirmation d'inscription
   registerPass(userEmail: string): Observable<any> {
    const subject = 'Bienvenue sur Maktoub - Plateforme de Publication d\'Articles';
    const content = `
      <h3>Bienvenue dans Maktoub !</h3>
      <p>Bonjour,</p>
      <p>Nous vous souhaitons la bienvenue dans notre application <strong>Maktoub</strong>, une plateforme dédiée à la publication d'articles professionnels.</p>
      <p>Nous sommes ravis de vous avoir parmi nous. Vous pouvez désormais partager vos idées, articles, et découvrir les contenus de notre communauté.</p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>Cordialement,</p>
      <p>L'équipe Maktoub</p>
    `;
    return this.sendMail(userEmail, subject, content);
  }
}