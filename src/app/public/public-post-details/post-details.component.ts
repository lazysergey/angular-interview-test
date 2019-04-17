import { Component, OnInit } from '@angular/core';
import { PostDataService } from '../../shared/post-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Post } from './../../models/post';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent {
  public post$: ReplaySubject<Post>;

  constructor(postDataService: PostDataService,
  ) {
    this.post$ = postDataService.currentPost$;
  }
}
