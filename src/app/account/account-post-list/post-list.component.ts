import { Component, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostDataService } from 'src/app/shared/post-data.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Subscription, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnDestroy {

  posts$: ReplaySubject<Post[]>;

  constructor(
    private postDataService: PostDataService
  ) {
    this.posts$ = postDataService.currentUserAllPost$;
    // this.postDataService.currentUserAllPost$.subscribe(
    //   _ => console.log(_)
    // );
    // this.postDataService.allPosts$.next("1234132");
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  deletePost(postToDelete: Post) {
    (postToDelete as any).shade = true;
    this.postDataService.deletePost(postToDelete.id);
  }
}
