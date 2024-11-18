import { Component, Input, OnInit } from '@angular/core';
import { UserFollowingService } from 'src/app/services/userfollowing.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  @Input() user: any = {
    name: localStorage.getItem("username") || "username",
    handle: localStorage.getItem("username")?.replace(/\s/g, '') || "username", 
    initial: (localStorage.getItem("username")?.[0] || 'U').toUpperCase(),
    followersCount: 0,
    followingCount: 0
  };

  @Input() suggestedUsers: any[] = [
    { name: 'Jane Doe', initial: 'J', bio: 'UX Designer' },
    { name: 'John Smith', initial: 'J', bio: 'Software Engineer' },
    { name: 'Alice Johnson', initial: 'A', bio: 'Product Manager' }
  ];

  constructor(private userFollowingService: UserFollowingService) {}

  ngOnInit() {
    const userId = localStorage.getItem("userid");
    console.log(userId);
    
    // Ensure userId is a valid number before calling the service
    if (userId) {
      this.userFollowingService.getFollowersCount(+userId).subscribe(
        (count) => {
          this.user.followersCount = count;
        },
        (error) => {
          console.error('Error fetching followers count:', error);
        }
      );

      this.userFollowingService.getFollowingsCount(+userId).subscribe(
        (count) => {
          this.user.followingCount = count; // Fixed property name here
        },
        (error) => {
          console.error('Error fetching followings count:', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
  }
}
