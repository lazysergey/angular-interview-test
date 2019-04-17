import { Component, OnInit } from '@angular/core';
import { PostDataService } from '../../shared/post-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { Post } from 'src/app/models/post';
import { of, Observable, Subject, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  postDetails$: ReplaySubject<Post | null>;
  activatedRouteSubscription: any;

  constructor(
    private postDataService: PostDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {

    // this.activatedRoute.params.pipe(
    //   tap(params => console.log(params)),
    //   switchMap(params =>
    //     this.postDataService.getPost(params.id)
    //   ),
    //   tap(value => console.log("tap1", value))
    // ).pipe(
    //   map((postDetails => {
    //     if (postDetails) {
    //       return of(postDetails);
    //     } else {
    //       this.router.navigate(['404']);
    //       return of(null);
    //     }
    //   }))
    // ).subscribe(this.postDataService.currentPost$);
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(
      this.postDataService.activatedRouteParams
    )
  }

  ngOnInit() {
  }

  ngOnDestroy (){
    this.activatedRouteSubscription.unsubscribe();
  }

  goBack(){
    return history ? history.back() : this.router.navigate(['posts']);
  }

}
