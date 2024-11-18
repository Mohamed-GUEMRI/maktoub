import { Component, HostListener, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Comment } from '../../models/comment';
import { CommentService } from 'src/app/services/comment.service';
import { finalize, forkJoin } from 'rxjs';
import { ArticleTagService } from 'src/app/services/articletag.service';
import { UserFollowingService } from 'src/app/services/userfollowing.service';
import { BookmarkRequest, BookmarkService } from 'src/app/services/bookmark.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface ArticleTag {
  articleId: number;
  tag: string;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('200ms ease-in')]),
      transition(':leave', [animate('200ms ease-out')])
    ])
  ]
})
export class ArticleComponent implements OnInit {
  article?: Article;
  comments: Comment[] = [];
  newComment: string = '';
  likeCount: number = 0;
  viewCount: number = 0;
  coverImageUrl: string = "../../../assets/th.jpg";
  isLoggedIn: boolean = true; // This should come from an auth service
  isLiked: boolean = true;
  tags: ArticleTag[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  userId:any = localStorage.getItem('userid') || 0
  userName:any = localStorage.getItem('username') || 0
  articleId :any =0;
  articleUrl = 'https://maktoub.com/article/' + this.articleId;
  articleTitle = this.article?.title;
  articleDescription = this.article?.subtitle || 'Check out this article on Maktoub!';
  followingStatus: boolean  = false; // Track follow status by authorId
  authorName : string = "user";
  bookmarked:boolean =false;
  isTheSame:boolean=false;
  showScrollTop: boolean = false;
  fontSize: 'small' | 'medium' | 'large' = 'medium';
  isDarkMode: boolean = false;
  showReadingBar: boolean = false;
  readingProgress: number = 0;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private articleTagService: ArticleTagService,
    private commentService: CommentService, 
    private userFollowingService: UserFollowingService,
    private bookmarkService : BookmarkService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.articleId =id;
    this.isLoggedIn = localStorage.getItem('isLogged') === 'true';
    this.loadArticleData(id);
    this.userId = localStorage.getItem("userid")|| 2;
    this.userName = localStorage.getItem('username') || "user";
    console.log(this.userId)
    this.checkIfArticleLiked();
    this.checkFollowingStatus();
    this.bookmarkService.isExist(this.userId,this.article?.id).subscribe(isbookmarked=>{
      this.bookmarked = isbookmarked;
      console.log(isbookmarked);
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Show scroll-to-top button after scrolling down 300px
    this.showScrollTop = window.pageYOffset > 300;
    
    // Calculate reading progress
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight - windowHeight;
    this.readingProgress = (window.pageYOffset / fullHeight) * 100;
  }

  toggleFontSize() {
    const sizes = ['small', 'medium', 'large'] as const;
    const currentIndex = sizes.indexOf(this.fontSize);
    this.fontSize = sizes[(currentIndex + 1) % sizes.length];
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode');
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  showPopUp():void{
    localStorage.setItem("showPopup",'true');
  }

  toggleFollow(authorId: number): void {
    if (!this.userId) return;
  
    this.userFollowingService.toggleFollow(this.userId, authorId).subscribe(
      (response) => {
        // Toggle the follow status in the UI
        this.followingStatus = !this.followingStatus; // Update the following status
        console.log(response); // e.g., "Follow status toggled successfully."
      },
      (error) => {
        console.error('Error toggling follow status:', error);
      }
    );
  }

  addBookmark(articleId:any){
    let bookmarkRequest : BookmarkRequest = {
      "userId" : this.userId,
      "articleId" : articleId
    }
    this.bookmarkService.createBookmark(bookmarkRequest).subscribe(
      (bookmark)=>{
        console.log(bookmark);
        this.bookmarked = !this.bookmarked;
      },
      (error)=>{
        console.log("bookmark not added", error);
      }
    )
  }
  
  checkFollowingStatus(): void {
    if (!this.userId) return;

      this.userFollowingService.isFollowing(this.userId, this.article?.authorId).subscribe(
        (status) => {
          console.log(status)
          this.followingStatus = status; // Store follow status
        },
        (error) => {
          console.error('Error checking follow status:', error);
        }
      );

      this.articleService.getAuthor(this.article?.authorId).subscribe(
        (name) => {
          console.log(name)
          this.authorName = name.name; // Store follow status
          this.isTheSame = (this.userId == this.article?.authorId )
        },
        (error) => {
          console.error('Error checking follow status:', error);
        }
      );

      this.bookmarkService.isExist(this.userId,this.article?.id).subscribe(isbookmarked=>{
        this.bookmarked = isbookmarked;
      });
  }

  private loadArticleData(id: number): void {
    this.isLoading = true;
    this.error = null;

    // Using forkJoin to make parallel requests
    forkJoin({
      article: this.articleService.getArticleById(id),
      tags: this.articleTagService.getTagsByArticleId(id),
      viewCount: this.articleService.viewArticle(id,this.userId)
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: any) => {
        this.article = response.article;
        this.comments = response.article.comments?.$values || [];
        this.tags = response.tags.$values || [];
        console.log(this.tags)
        this.likeCount = this.article?.likeCount || 0;
        this.viewCount = this.article?.viewCount || 0;
        //this.checkIfArticleLiked(id);
        this.checkFollowingStatus();
      },
      error: (error) => {
        console.error('Error loading article data:', error);
        this.error = 'Failed to load article. Please try again later.';
        this.router.navigate(['/notfound']);
      }
    });
  }

  private checkIfArticleLiked(): void {
    
    if (this.userId) {
      this.articleService.isArticleLiked(this.articleId, this.userId).subscribe(
        (isLiked: boolean) => this.isLiked = isLiked,
        (error: any) => console.error('Error checking like status:', error)
      );
    } else {
      console.warn('User ID is not available. Unable to check if article is liked.');
      // Handle the case where userId is not available (e.g., set isLiked to false)
      this.isLiked = false; // Or any other appropriate default action
    }
  }
  

  addComment(): void {
    if (!this.newComment.trim() || !this.article?.id) return;

    const comment: Comment = {
      articleId: this.article.id,
      userId: this.userId,
      content: this.newComment,
      createdAt: new Date().toISOString()
    };

    this.commentService.addComment(comment).subscribe({
      next: (response) => {
        this.comments.unshift(response); // Add to the beginning of the array
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
      }
    });
  }

  getReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes <= 1 ? 'Less than 1 minute' : `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  shareArticle() {
    const url = this.articleUrl ?? 'https://default-url.com';
    const title = this.articleTitle ?? 'Check out this article!';
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
  
    // Open a new window with specific dimensions and positioning
    window.open(
      facebookShareUrl,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  }
  

  like(): void {
    if (!this.article?.id) return;
    this.articleService.likeArticle(this.articleId, this.userId).subscribe({
      next: (response) => {
        this.likeCount = response;
        this.isLiked = !this.isLiked;
      },
      error: (error) => {
        console.error('Error liking article:', error);
        alert('Failed to like article. Please try again.');
      }
    });
  }
}