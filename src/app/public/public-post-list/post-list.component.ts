import { Component, OnInit } from '@angular/core';
import { PostDataService } from '../../shared/post-data.service';
import { Post } from './../../models/post';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  allPosts$: Observable<Post[]>;

  constructor(
    private postDataService: PostDataService
  ) { 
    this.allPosts$ = postDataService.allPosts$;
  }

  ngOnInit() {
  }

}
