import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './../../models/post';
import { PostDataService } from './../../shared/post-data.service';
import { ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnDestroy, OnInit {

  posts$: ReplaySubject<Post[]>;
  private subscription: Subscription;

  constructor(
    private postDataService: PostDataService
  ) {
    this.posts$ = postDataService.currentUserAllPost$;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe()
  }

  deletePost(postToDelete: Post) {
    (postToDelete as any).shade = true;
    this.subscription = this.postDataService.deletePost(postToDelete.id).subscribe(
      res => console.log(res)
    );
  }
}
