import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { Notification } from '../models/Notification';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: HubConnection;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private configUrl = 'assets/config.json'; 
  private apiUrl: string =""; // L'URL de l'API

  public notifications$ = this.notificationsSubject.asObservable();
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadConfig();
  
    this.initSignalRConnection();
    
    // Load initial data
    this.loadInitialData();
  }
  private loadConfig() {
    this.http.get<any>(this.configUrl).subscribe(config => {
      this.apiUrl = config.apiUrl+"/Email";
    });}
  private async loadInitialData() {
    try {
      const notifications = await firstValueFrom(this.http.get<NotificationResponse>(`${this.apiUrl}/Notification`));
      if (notifications?.$values) {
        this.notificationsSubject.next(notifications.$values);
        this.updateUnreadCount();
      }
  
      const unreadCount = await firstValueFrom(this.http.get<UnreadCountResponse>(`${this.apiUrl}/Notification/unread-count`));
      if (unreadCount) {
        this.unreadCountSubject.next(unreadCount.count);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
  

  public async initSignalRConnection() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping SignalR connection');
        return;
      }

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`https://localhost:7193/notificationHub`, {
          accessTokenFactory: () => token,
          transport: signalR.HttpTransportType.WebSockets
        })
        .configureLogging(LogLevel.Debug) // Enable detailed logging
        .withAutomaticReconnect()
        .build();

      // Log all received messages
      this.hubConnection.on("ReceiveNotification", (notification: Notification) => {
        console.log('SignalR Notification Received:', notification);
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...currentNotifications]);
        this.updateUnreadCount();
      });

      
      

      await this.hubConnection.start();
      console.log('SignalR connection started. Connection ID:', this.hubConnection.connectionId);

      // Test the connection by invoking a hub method
      try {
        const userId = localStorage.getItem('userid');
        if (userId) {
          await this.hubConnection.invoke('SendNotificationToUser', localStorage.getItem('userid'), "message")
          .catch((err) => console.log('Error while invoking SendNotificationToUser: ' + err));
          console.log('Joined user group successfully');
        }
      } catch (error) {
        console.error('Error joining user group:', error);
      }
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      // Retry connection after 5 seconds
      setTimeout(() => this.initSignalRConnection(), 5000);
    }
  }

  getNotifications(page: number = 1, pageSize: number = 20): Observable<any> {
    console.log('Fetching notifications...');
    return this.http
      .get<any>(`${this.apiUrl}/Notification?page=${page}&pageSize=${pageSize}`)
      .pipe(
        tap(response => {
          console.log('Received notifications:', response);
          if (response.$values) {
            this.notificationsSubject.next(response.$values);
            this.updateUnreadCount();
          }
        })
      );
  }

  getUnreadCount(): Observable<number> {
    
    return this.http.get<{$id: string, count: number}>(`${this.apiUrl}/Notification/unread-count`)
      .pipe(
        map(response => response.count),
        tap(count => {
          console.log('Received unread count:', count);
          this.unreadCountSubject.next(count);
        })
      );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/Notification/${notificationId}/read`, {})
      .pipe(
        tap(() => {
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          this.notificationsSubject.next(updatedNotifications);
          this.updateUnreadCount();
        })
      );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(`${this.apiUrl}/Notification/mark-all-read`, {})
      .pipe(
        tap(() => {
          const currentNotifications = this.notificationsSubject.value;
          const updatedNotifications = currentNotifications.map(n => ({ ...n, isRead: true }));
          this.notificationsSubject.next(updatedNotifications);
          this.unreadCountSubject.next(0);
        })
      );
  }

  private updateUnreadCount() {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
    console.log('Updated unread count:', unreadCount);
    this.unreadCountSubject.next(unreadCount);
  }

  // Method to manually reconnect SignalR
  public async reconnect() {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
    await this.initSignalRConnection();
  }

  ngOnDestroy() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

  
  
}

export interface NotificationResponse {
  $values: Notification[];
}

export interface UnreadCountResponse {
  count: number;
}
