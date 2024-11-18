import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article.service';
import { UserFollowingService } from 'src/app/services/userfollowing.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() authorName: string = 'Mohamed Guemri';
  @Input() authorTagline: string = 'IT student, startup founder';
  @Input() authorBio: string = 'Passionate about technology and entrepreneurship. Building the future one line of code at a time.';
  @Input() authorProfilePic: string = '../../../assets/th.jpg';
  @Input() articleCount: number = 4;
  @Input() followerCount: number = 1200;

  articles: any[] = [];
  userId : any;
  authorId:any;
  isFollowing: boolean = false;
  isUserAuthor: boolean = false;

  constructor(private route: ActivatedRoute,private articleService:ArticleService, private userFollowingService: UserFollowingService){}

  ngOnInit():void{
    this.userId = localStorage.getItem('userid') || "0";
    this.authorId = +this.route.snapshot.paramMap.get('id')!
    console.log(this.authorId)
    this.loadArticles();
    this.loadProfile();
    this.checkFollowingStatus();
    console.log(this.isUserAuthor)
    this.userFollowingService.getFollowersCount(+this.authorId).subscribe(
      (count) => {
        console.log(count)
        this.followerCount = count;
      },
      (error) => {
        console.error('Error fetching followers count:', error);
      }
    );
  }


  checkFollowingStatus(): void {
    if (!this.userId) return;

      this.userFollowingService.isFollowing(this.userId, this.authorId).subscribe(
        (status) => {
          console.log(status)
          this.isFollowing = status; // Store follow status
          this.isUserAuthor = this.userId == this.authorId;
        },
        (error) => {
          console.error('Error checking follow status:', error);
        }
      );

    

  }

  toggleFollow(): void {
    if (!this.userId) return;
  
    this.userFollowingService.toggleFollow(this.userId, this.authorId).subscribe(
      (response) => {
        // Toggle the follow status in the UI
        this.isFollowing = !this.isFollowing; // Update the following status
        console.log(response); // e.g., "Follow status toggled successfully."
      },
      (error) => {
        console.error('Error toggling follow status:', error);
      }
    );
  }

  loadProfile() {    
    this.articleService.getAuthor(this.authorId)
      .subscribe(author => {
        console.log(author)
        this.authorId = author.id
        this.authorName = author.name
        this.authorTagline= author.bio || "Inspiring writer. Maktoub user."
        this.authorBio= author.about || "I'm willing to become top writer in this platform."
      })};

  loadArticles() {
    this.articleService.getAuthorById(this.authorId).subscribe(articles => {
          // Filter articles by the current user's ID
          console.log(articles)
          this.articles = articles.$values;
          this.articleCount = this.articles.length;
          // You might want to separate drafts based on a status field
          //this.drafts = this.articles.$values.filter(article => article.publishedAt === undefined);
        });
  }

  followAuthor() {
    this.isFollowing = !this.isFollowing;
    // Here you would typically make an API call to update the follow status
    console.log(this.isFollowing ? 'Followed author' : 'Unfollowed author');
  }
}
