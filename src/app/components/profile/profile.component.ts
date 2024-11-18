// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';
import { Bookmark, BookmarkService } from 'src/app/services/bookmark.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  
  drafts: Article[] = [];
  articles: Article[] = [];
  bookmarks: Bookmark[] = [];
  
  loading = {
    profile: false,
    articles: false,
    bookmarks: false
  };
  
  error = {
    profile: '',
    articles: '',
    bookmarks: ''
  };

  // Assuming you get these from your auth service
  currentUserId: any = localStorage.getItem("userid"); // Replace with actual user ID from auth
  isAuthor: boolean = true; // Replace with actual role check

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private bookmarkService: BookmarkService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      about: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
    this.loadArticles();
    this.loadBookmarks();
  }

  loadProfile() {
    if (!this.isAuthor) return;
    
    this.loading.profile = true;
    this.error.profile = '';

    this.articleService.getAuthor(this.currentUserId)
      .pipe(finalize(() => this.loading.profile = false))
      .subscribe({
        next: (author) => {
          this.profileForm.patchValue({
            name: author.name,
            email: author.email,
            bio: author.bio,
            about: author.about
          });
          console.log(this.profileForm)
        },
        error: (err) => {
          this.error.profile = 'Failed to load profile';
          console.error('Profile load error:', err);
        }
      });
  }

  loadArticles() {
    if (!this.isAuthor) return;
    
    this.loading.articles = true;
    this.error.articles = '';

    this.articleService.getAuthorById(this.currentUserId)
      .pipe(finalize(() => this.loading.articles = false))
      .subscribe({
        next: (articles) => {
          // Filter articles by the current user's ID
          this.articles = articles.$values;
          // You might want to separate drafts based on a status field
          //this.drafts = this.articles.$values.filter(article => article.publishedAt === undefined);
        },
        error: (err) => {
          this.error.articles = 'Failed to load articles';
          console.error('Articles load error:', err);
        }
      });
  }

  loadBookmarks() {
    this.loading.bookmarks = true;
    this.error.bookmarks = '';

    this.bookmarkService.getBookmarksByUserId(this.currentUserId)
      .pipe(finalize(() => this.loading.bookmarks = false))
      .subscribe({
        next: (bookmarks:any) => {
          this.bookmarks = bookmarks.$values;
        },
        error: (err) => {
          this.error.bookmarks = 'Failed to load bookmarks';
          console.error('Bookmarks load error:', err);
        }
      });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Implement your profile update logic here
      console.log('Profile form data:', this.profileForm.value);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  toggleBookmark(articleId: number) {
    // First check if bookmark exists
    this.bookmarkService.isExist(this.currentUserId, articleId).subscribe({
      next: (exists) => {
        if (exists) {
          // Find and delete the existing bookmark
          const bookmark = this.bookmarks.find(b => b.articleId === articleId);
          if (bookmark) {
            this.bookmarkService.deleteBookmark(bookmark.id).subscribe({
              next: () => {
                this.bookmarks = this.bookmarks.filter(b => b.id !== bookmark.id);
              },
              error: (err) => console.error('Error removing bookmark:', err)
            });
          }
        } else {
          // Create new bookmark
          const bookmarkRequest = {
            userId: this.currentUserId,
            articleId: articleId
          };
          this.bookmarkService.createBookmark(bookmarkRequest).subscribe({
            next: (success) => {
              if (success) {
                this.loadBookmarks(); // Reload all bookmarks to get the new one with full data
              }
            },
            error: (err) => console.error('Error creating bookmark:', err)
          });
        }
      },
      error: (err) => console.error('Error checking bookmark existence:', err)
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}