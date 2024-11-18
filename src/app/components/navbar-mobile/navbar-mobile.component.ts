import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/article';
import { User } from 'src/app/models/User';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/Notification';
import jwt_decode from "jwt-decode";



@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css']
})
export class NavbarMobileComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  showPopup: boolean = false;  
  isSignUpMode: boolean = true;
  isLogged: boolean = false;
  showNotifications: boolean = false;
  showProfile: boolean = false;
  searchQuery: string = '';
  searchResults: Article[] = [];
  noResultsFound: boolean = false;
  notificationCount: number = 3;
  loading: boolean = false;
  userId =localStorage.getItem('userid') || 0;
  private subscriptions: Subscription[] = [];
  notifications: any[] = [];
  unreadCount = 0;
  userName = localStorage.getItem('username') || 0;



  constructor(private notificationService: NotificationService,private router: Router, private authService: AuthService, private articleService: ArticleService, private route: ActivatedRoute) {
    this.isLogged = !!localStorage.getItem('token');
  }

  ngOnInit(): void {  // Fixed method name
    this.userId = localStorage.getItem('userid') || 0;
    
    // Subscribe to notifications
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(
        notifications => {
          this.notifications = notifications;
          console.log('Notifications:', notifications);
        }
      ),
      this.notificationService.unreadCount$.subscribe(
        count => {
          this.unreadCount = count;
          console.log('Unread count:', count);
        }
      )
    );
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
  }

  closeAllPanels() {
    this.showNotifications = false;
    this.showProfile = false;
  }

  openPopup(SignUpMode: boolean) {
    // Implement your popup logic here
    this.showPopup = true;
    this.isSignUpMode = SignUpMode;
    this.closeAllPanels();
  }

  signOut() {
    // Implement your sign out logic here
    localStorage.removeItem('token');
  localStorage.setItem('isLogged','false');
  localStorage.removeItem('userid');
  localStorage.removeItem('username');
    this.isLogged = false;
    this.router.navigate([this.route.snapshot.url.join('/')], {
      relativeTo: this.route,
      skipLocationChange: true
    });
    this.closeAllPanels();
    location.reload();
  }


  // Close the popup
  closePopup() {
    this.showPopup = false;
  }
  // Toggle between SignUp and SignIn
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }

  handleNotificationClick(notification: Notification) {
    // Mark as read
    this.notificationService.markAsRead(notification.id).subscribe();
    this.showNotifications = false;

    // Navigate to linked content if available
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }

  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
    this.showNotifications = false;
  }

  register() {
    const user: User = {
      name: this.name,
      email: this.email,
      password: this.password
    };
  
    this.authService.register(user).subscribe(
      (response: any) => {
        console.log('Registration successful', response);
        this.errorMessage = "";
        this.successMessage = 'Registration successful';
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
        this.clearForm();
        this.errorMessage = ''; // Clear previous errors
      },
      (error) => {
        console.error('Registration failed', error);
        this.errorMessage = error.text || 'Registration failed. Please try again.'; // Handle JSON error
      }
    );
  }
  

  login() {

    const user: User = {
      name: '', // Not needed for login
      email: this.email,
      password: this.password
    };

    this.authService.login(user).subscribe(
      async (token) => {
        let u:any=jwt_decode(token);
        localStorage.setItem("userid",u.userId);
        localStorage.setItem("username",u.name);
        this.userName = localStorage.getItem('username') || 0;
        console.log('Login successful');
        localStorage.setItem('token', token);
        localStorage.setItem('isLogged','true');
        this.isLogged = true;
        this.errorMessage = '';
        this.successMessage = "LoggedIn successfully!";
        await this.notificationService.reconnect();
        setTimeout(() => {
          this.closePopup();
          this.successMessage = '';
          this.router.navigate([this.route.snapshot.url.join('/home')], {
            relativeTo: this.route,
            skipLocationChange: true
          });
          location.reload();
        }, 1000);
      },
      (error) => {
        console.log(error);
        console.error('Login failed', error);
        this.errorMessage = error.error || 'Login failed. Please check your credentials.';
      }
    );
  }
  onSubmit() {
    if (this.isSignUpMode) {
      this.register();
    } else {
      this.login();
    }
  }
  private clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
  }




  // in navbar-mobile.component.ts
searchMode: boolean = false;

onSearchIconClick() {
  this.searchMode = true;
}

onSearchQueryChange() {
  this.onSearch();
}

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
    this.searchMode = false;
  }
}

goToArticle(articleId: number) {
  this.searchResults = [];
  this.searchMode = false;
  this.router.navigate(['/articles/' + articleId]);
}
}
