import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './../../models/post';
import { PostDataService } from './../../shared/post-data.service';
import { ReplaySubject, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnDestroy, OnInit {
  public posts$: Observable<Post[]>;
  private _subscription: Subscription;

  constructor(
    private _postDataService: PostDataService
  ) {
    this.posts$ = _postDataService.currentUserAllPost$;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this._subscription && this._subscription.unsubscribe()
  }

  deletePost(postToDelete: Post) {
    (postToDelete as any).shade = true;
    this._subscription = this._postDataService.deletePost(postToDelete.id).subscribe(
    );
  }
}
