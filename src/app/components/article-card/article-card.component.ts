import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { User } from 'src/app/models/User';
import { ArticleService } from 'src/app/services/article.service';
import { ArticleTagService } from 'src/app/services/articletag.service';
import { BookmarkRequest, BookmarkService } from 'src/app/services/bookmark.service';
import { UserFollowingService } from 'src/app/services/userfollowing.service';


interface ArticleTag {
  articleId: number;
  tag: string;
}

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input() articles: Article[] = []; // Use strong typing for articles
  tags: ArticleTag[] = [];
  followerId: string | null = null; // Store followerId as a string
  followingStatus: { [key: number]: boolean } = {}; // Track follow status by authorId
  authorNames: { [key: number]: string } = {};
  articleCategories: { [key: number]: string[] } = {};
  articleTags: { [key: number]: string[] } = {};
  isBookmarked: { [key: number]: boolean } = {};
  isTheSame: { [key: number]: boolean } = {};


  constructor(private articleTagService: ArticleTagService,private bookmarkService :BookmarkService ,private articleService: ArticleService, private userFollowingService: UserFollowingService) {}

  ngOnInit(): void {
    this.followerId = localStorage.getItem("userid");

    this.articleService.getAllArticles().subscribe(
      (data: any) => {
        this.articles = data.$values;
        console.log('Articles:', data); // Log the data from the API
        this.checkFollowingStatus(); // Check follow status after loading articles
      },
      (error) => {
        console.error('Error fetching articles', error);
      }
    );
    
  }

  addBookmark(articleId:any){
    let bookmarkRequest : BookmarkRequest = {
      "userId" : this.followerId,
      "articleId" : articleId
    }
    this.bookmarkService.createBookmark(bookmarkRequest).subscribe(
      (bookmark)=>{
          console.log(bookmark);
          this.isBookmarked[bookmarkRequest.articleId] = !this.isBookmarked[bookmarkRequest.articleId];
      },
      (error)=>{
        console.log("bookmark not added", error);
      }
    )
  }

  checkFollowingStatus(): void {
    if (!this.followerId) return;

    this.articles.forEach(article => {
      this.userFollowingService.isFollowing(this.followerId, article.authorId).subscribe(
        (status) => {
          this.followingStatus[article.authorId] = status; // Store follow status
          this.isTheSame[article.id] = (article.authorId == Number(this.followerId));
          console.log(article.authorId,Number(this.followerId), this.isTheSame)
        },
        (error) => {
          console.error('Error checking follow status:', error);
        }
      );

      this.articleService.getAuthor(article.authorId).subscribe(
        (name) => {
          this.authorNames[article.authorId] = name.name; // Store follow status
        },
        (error) => {
          console.error('Error checking follow status:', error);
        }
      );

      this.articleService.getArticleCategories(article.id).subscribe(category => {
        this.articleCategories[article.id] = category.$values[0].name;
      });
      this.bookmarkService.isExist(this.followerId,article.id).subscribe(isbookmarked=>{
        this.isBookmarked[article.id] = isbookmarked;
      });
      this.articleTagService.getTagsByArticleId(article.id).subscribe(tags=>{
        if(tags.$values[0].tag != undefined){
          this.articleTags[article.id] = tags.$values[0].tag;
        }else 
          this.articleTags[article.id] = [""]
        
        console.log(this.articleTags[article.id]);
      });
    });

    
  }
  
  toggleFollow(authorId: number): void {
    if (!this.followerId) return;
  
    this.userFollowingService.toggleFollow(this.followerId, authorId).subscribe(
      (response) => {
        // Toggle the follow status in the UI
        this.followingStatus[authorId] = !this.followingStatus[authorId]; // Update the following status
        console.log(response); // e.g., "Follow status toggled successfully."
      },
      (error) => {
        console.error('Error toggling follow status:', error);
      }
    );
  }
  

  getReadingTime(content: string): string {
    const wordsPerMinute = 180;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
  
    return minutes <= 1 ? 'Less than 1 minute' : `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  shareArticle(articleId: any, articleTitle: any) {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://maktoub.com/article/' + articleId)}&quote=${encodeURIComponent(articleTitle)}`;
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      facebookShareUrl,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  }
}
