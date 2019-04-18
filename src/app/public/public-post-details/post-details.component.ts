import { Component, OnInit } from '@angular/core';
import { PostDataService } from '../../shared/post-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Post } from './../../models/post';
import { ReplaySubject, Observable } from 'rxjs';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  public post$: Observable<Post>;

  constructor(
    postDataService: PostDataService,
  ) {
    this.post$ = postDataService.currentPost$;
  }

  ngOnInit() { }

}
