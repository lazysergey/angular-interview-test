import { Component, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostDataService } from 'src/app/shared/post-data.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnDestroy {

  posts: Post[];
  subscription: Subscription;

  constructor(
    private postDataService: PostDataService,
    private authService: AuthService
  ) {
    this.subscription = this.postDataService.getAllUsersPosts(
      this.authService.currentUser.id
    ).subscribe((posts: Post[]) => {
      window["p2"] = posts;
      this.posts = posts;
    })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deletePost(postToDelete: Post) {
    (postToDelete as any).shade = true;
    this.postDataService.deletePost(postToDelete.id).subscribe(
      (res) => {
        console.log(res);
        this.posts = res;
        // this.posts = this.posts.filter(p => p.id !== postToDelete.id)
      },
      err => (postToDelete as any).shade = false
    )
  }
}
