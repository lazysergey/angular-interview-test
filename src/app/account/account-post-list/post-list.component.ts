import { Component, OnDestroy } from '@angular/core';
import { Post } from './../../models/post';
import { PostDataService } from './../../shared/post-data.service';
import { ReplaySubject } from 'rxjs';

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
  }

  ngOnDestroy() {
  }

  deletePost(postToDelete: Post) {
    (postToDelete as any).shade = true;
    this.postDataService.deletePost(postToDelete.id).subscribe(
      res => console.log(res)
    );
  }
}
