import { HttpService } from './http.service';
import { AuthService } from './../shared/auth.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, mapTo, switchMap, filter, take } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, ReplaySubject, from, empty, Subject, combineLatest, zip } from 'rxjs';
import { Post, PostBase } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {
  userPosts: Post[];
  deleteAction$ = new Subject<string>()
  allPosts$: ReplaySubject<Post[]> = new ReplaySubject(1);
  currentPost$: ReplaySubject<Post> = new ReplaySubject(1);
  currentUserAllPost$: ReplaySubject<any> = new ReplaySubject(1);
  route$: Observable<ActivatedRouteSnapshot>;
  postId$: any;


  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router,
  ) {
    this.route$ = this.router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(e => (e as ActivationEnd).snapshot)
    );

    this.postId$ = this.route$.pipe(
      filter(s => s.url.length > 0 && s.url[0].path === 'posts'),
      map(s => s.params.id || s.queryParams.id),
      // tap(_ => console.log(_)),
    );

    this.loadCurrentPost();
    this.loadAllPosts();
    this.loadCurrentUserPosts();

  }

  updatePost(post: Post): Observable<any> {
    if (post.id) {
      return zip(
        this.httpService.doUpdatePost(post),
        this.currentUserAllPost$,
        this.allPosts$,
        (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
          if (currentUserAllPosts.length) {
            const indexInCurrentPosts = currentUserAllPosts.findIndex(p => p.id == post.id);
            currentUserAllPosts[indexInCurrentPosts] = post;
            this.currentUserAllPost$.next(currentUserAllPosts);
          }
          if (allPosts.length) {
            const indexInAllPosts = allPosts.findIndex(p => p.id == post.id);
            allPosts[indexInAllPosts] = post;
            this.allPosts$.next(allPosts)
          }
        }
      );
    } else {
      //FIXME: component here loads last post in edit form
      return this.httpService.doCreatePost(post).pipe(
        map(res => {
          this.userPosts.push(post);
          return this.userPosts;
        })
      );
    }
  }

  loadCurrentPost() {
    this.postId$.pipe(
      filter((id: number) => id != undefined),
      switchMap((id: number) =>
        this.httpService.getPost(id)
      ),
    ).pipe(
      map((postDetails => {
        if (postDetails) {
          return postDetails;
        }
      }))
    ).subscribe(this.currentPost$);
  }

  loadAllPosts() {
    this.httpService.getAllPosts().subscribe(
      this.allPosts$
    )
  }

  loadCurrentUserPosts() {
    this.authService.user$.pipe(
      switchMap(
        (user) => this.allPosts$.pipe(
          map((posts: Post[]) => {
            return posts.filter((p: Post) => p.userId === user.id)
          }),
        )
      )
    ).subscribe(this.currentUserAllPost$)
  }

  deletePost(id: number): Observable<any> {
    return zip(
      this.httpService.doDeletePost(id),
      this.currentUserAllPost$,
      this.allPosts$,
      (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
        if (currentUserAllPosts.length) {
          const indexInCurrentPosts = currentUserAllPosts.findIndex(p => p.id == id);
          currentUserAllPosts.splice(indexInCurrentPosts, 1);
          this.currentUserAllPost$.next(currentUserAllPosts);
        }
        if (allPosts.length) {
          const indexInAllPosts = allPosts.findIndex(p => p.id == id);
          allPosts.splice(indexInAllPosts, 1);
          this.allPosts$.next(allPosts)
        }
      }
    )
  }
}