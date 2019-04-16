import { Component, OnInit } from '@angular/core';
import { PostDataService } from '../../shared/post-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  postDetails: Post;

  constructor(
    private postDataService: PostDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.pipe(
      switchMap(params =>
        this.postDataService.getPost(params.id)
      )
    ).subscribe(postDetails => {
      if(postDetails){
        this.postDetails = postDetails;
      } else {
        console.log("navigating home")
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
  }

  goBack(){
    return history ? history.back() : this.router.navigate(['posts']);
  }

}
