import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostDataService } from 'src/app/shared/post-data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {
  currentPostId: any;
  buttonTitle: any;
  buttonTitle$: any;
  currentPost$: any;

  constructor(
    private postDataService: PostDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    
    this.currentPost$ = this.postDataService.currentPost$;
    this.route.queryParams.subscribe(params => {
      this.currentPostId = params.id;
      this.buttonTitle = params.id ? "Update" : "Create";
    })
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(
      this.postDataService.activatedRouteParams
    )
    this.buttonTitle$ = map(this.currentPost$, post => post.id ? 'Update' : 'Create')
  }

  public postEditForm: FormGroup;
  public showEmailValidationError: boolean;


  ngOnInit() {
    this.postEditForm = new FormGroup({
      titleControl: new FormControl(
        this.currentPostId ? this.postDataService.userPosts.find(p => p.id == this.currentPostId).title : '',
        [Validators.required]),
      postContentControl: new FormControl(
        this.currentPostId ? this.postDataService.userPosts.find(p => p.id == this.currentPostId).body : '',
        [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.activatedRouteSubscription.unsubscribe();
  }


  onSubmit() {
    for (let i in this.postEditForm.controls) {
      this.postEditForm.controls[i].markAsTouched();
    }

    if (this.postEditForm.valid) {
      this.postDataService.updatePost(
        {
          id: this.currentPostId,
          title: this.postEditForm.controls.titleControl.value,
          body: this.postEditForm.controls.postContentControl.value
        }
      ).subscribe(_ => {
        this.router.navigate(["/account/posts"]);
      })
    }
  }

}
