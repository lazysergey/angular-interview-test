import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostDataService } from './../../shared/post-data.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Post } from 'src/app/models/post';
import { Subject, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {
  private _subscription: Subscription;
  public buttonTitle$: any;
  public currentPost$: Observable<Post>;
  public postEditForm: FormGroup;

  constructor(
    private _postDataService: PostDataService,
    private _router: Router,
  ) {
    this.initForm();
    this.currentPost$ = this._postDataService.currentPost$;
    this.currentPost$.subscribe(post => {
      this.postEditForm.controls.body.setValue(post.body);
      this.postEditForm.controls.title.setValue(post.title);
    })
    this.buttonTitle$ = this.currentPost$.pipe(
      map((post: Post) => post.id ? 'Update' : 'Create')
    )
  }

  ngOnInit() { }

  initForm() {
    this.postEditForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    for (let i in this.postEditForm.controls) {
      this.postEditForm.controls[i].markAsTouched();
    }

    if (this.postEditForm.valid) {
      this._subscription = this.currentPost$.pipe(
        switchMap(post =>
          this._postDataService.updatePost(
            {
              id: post.id,
              title: this.postEditForm.controls.title.value,
              body: this.postEditForm.controls.body.value
            })
        )
      ).subscribe(res => {
        this._router.navigate(["/account/posts"]);
      });
    }
  }

  ngOnDestroy() {
    this._subscription && this._subscription.unsubscribe()
  }

}
