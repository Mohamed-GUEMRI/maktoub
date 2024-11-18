import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from 'src/app/models/article';
import { User } from 'src/app/models/User';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/Notification';
import { count, Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  isLogged: boolean = false;
  showPopup: boolean = false;  // Show popup by default
  isSignUpMode: boolean = true;  // Toggle between SignUp and SignIn mode
  searchQuery: string = '';
  searchResults: Article[] = [];
  noResultsFound: boolean = false;
  loading: boolean = false;
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  userName = localStorage.getItem('username') || 0;
  userId =localStorage.getItem('userid') || 0;
  notifications: any[] = [];
  unreadCount = 0;
  isDropdownOpen = false;
  private subscriptions: Subscription[] = [];
  // In your component class
showMembershipPopup = false;


openMembershipPopup() {
  this.showMembershipPopup = true;
}

closeMembershipPopup() {
  this.showMembershipPopup = false;
}


  constructor(private notificationService: NotificationService,private articleService: ArticleService, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.isLogged = !!localStorage.getItem('token');
  }
  ngOnInit(): void {  // Fixed method name
    this.userName = localStorage.getItem('username') || 0;
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleNotificationClick(notification: Notification) {
    // Mark as read
    this.notificationService.markAsRead(notification.id).subscribe();

    // Navigate to linked content if available
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }

    this.isDropdownOpen = false;
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.notification-dropdown')) {
      this.isDropdownOpen = false;
    }
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
          this.isSignUpMode = false;
          this.successMessage = '';
        }, 2000);
        
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
      name: '',
      email: this.email,
      password: this.password
    };

    

    this.authService.login(user).subscribe(
      async (token) => {
        console.log('Login successful');
        let u:any=jwt_decode(token);
        localStorage.setItem("userid",u.userId);
        localStorage.setItem("username",u.name);
        this.userName = localStorage.getItem('username') || 0;
        localStorage.setItem('token', token);
        localStorage.setItem('isLogged','true');
        this.isLogged = true;
        this.errorMessage = '';
        this.successMessage = "LoggedIn successfully!";
        this.clearForm();
        // Initialize SignalR connection after successful login
        await this.notificationService.reconnect();
        setTimeout(() => {
          this.successMessage = '';
          this.closePopup();
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

  private clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
  }

  
async logout() {
  // Disconnect SignalR before clearing credentials
  
  localStorage.removeItem('token');
  localStorage.setItem('isLogged','false');
  localStorage.removeItem('userid');
  localStorage.removeItem('username');
  this.isLogged = false;
  this.router.navigate([this.route.snapshot.url.join('/')], {
    relativeTo: this.route,
    skipLocationChange: true
  });
  location.reload();
}

  openPopup(SignUpMode : boolean) {
    this.showPopup = true;
    this.isSignUpMode = SignUpMode;
  }
  // Close the popup
  closePopup() {
    this.showPopup = false;
  }
  // Toggle between SignUp and SignIn
  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
  }
  
  toggleNotifications(event: MouseEvent) {
    event.stopPropagation(); // Prevent event from bubbling
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }
  
  toggleUserMenu(event: MouseEvent) {
    event.stopPropagation(); // Prevent event from bubbling
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }
  
  closeAllDropdowns() {
    this.showNotifications = false;
    this.showUserMenu = false;
  }

  // Optional: Close dropdowns when clicking anywhere in the document
  @HostListener('document:click')
  onClick() {
    this.closeAllDropdowns();
  }
  
  // Optional: Close dropdowns when pressing escape key
  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeAllDropdowns();
  }
  // Submit form logic
  onSubmit() {
    if (this.isSignUpMode) {
      this.register();
    } else {
      this.login();
    }
  }

  onSearch() {
    this.loading = true;
    this.noResultsFound = false;
    if (this.searchQuery.trim()) {
      this.articleService.searchArticles(this.searchQuery).subscribe(
        (results:any) => {
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
    }
  }
  goToArticle(articleId: number) {
    this.searchResults = [];
    this.router.navigate(['/articles/' + articleId]);
  }
}
