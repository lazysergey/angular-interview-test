import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostDataService } from './../../shared/post-data.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Post } from 'src/app/models/post';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  currentPostId: any;
  buttonTitle$: any;
  currentPost$: Subject<Post>;
  activatedRouteSubscription: any;

  constructor(
    private postDataService: PostDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.currentPost$ = this.postDataService.currentPost$;
    this.buttonTitle$ = this.currentPost$.pipe(
      map((post: Post) => post.id ? 'Update' : 'Create')
    )
  }

  public postEditForm: FormGroup;
  public showEmailValidationError: boolean;


  ngOnInit() {
    this.postEditForm = new FormGroup({
      titleControl: new FormControl([Validators.required]),
      postContentControl: new FormControl([Validators.required]),
    });
  }

  ngOnDestroy() { }


  onSubmit() {
    for (let i in this.postEditForm.controls) {
      this.postEditForm.controls[i].markAsTouched();
    }

    if (this.postEditForm.valid) {
      this.currentPost$.pipe(
        switchMap(post =>
          this.postDataService.updatePost(
            {
              id: post.id,
              title: this.postEditForm.controls.titleControl.value,
              body: this.postEditForm.controls.postContentControl.value
            })
        )
      ).subscribe(res => {
        this.router.navigate(["/account/posts"]);
      });
    } 
  }

}
