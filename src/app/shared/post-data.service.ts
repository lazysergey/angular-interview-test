import { HttpService } from './http.service';
import { AuthService } from './../shared/auth.service';
import { Router, ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, switchMap, filter } from 'rxjs/operators';
import { Observable, of, ReplaySubject, zip } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {
  private _allPosts$: ReplaySubject<Post[]> = new ReplaySubject(1);
  private _currentPost$: ReplaySubject<Post> = new ReplaySubject(1);
  private _currentUserAllPost$: ReplaySubject<any> = new ReplaySubject(1);
  public readonly allPosts$ = this._allPosts$.asObservable();
  public readonly currentPost$ = this._currentPost$.asObservable();
  public readonly currentUserAllPost$ = this._currentUserAllPost$.asObservable();
  private _route$: Observable<ActivatedRouteSnapshot>;
  private _postId$: any;

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private router: Router,
  ) {
    this._route$ = this.router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(e => (e as ActivationEnd).snapshot)
    );

    this._postId$ = this._route$.pipe(
      filter(s => s.url.length > 0 && s.url[0].path === 'posts'),
      map(s => s.params.id || s.queryParams.id),
    );

    this.loadCurrentPost();
    this.loadAllPosts();
    this.loadCurrentUserPosts();

  }

  private loadCurrentPost() {
    this._postId$.pipe(
      switchMap((id: number) =>
        id ? this.httpService.getPost(id) : of({})
      ),
    ).pipe(
      map((postDetails => {
        return postDetails;
      }))
    ).subscribe(this._currentPost$);
  }

  private loadAllPosts() {
    this.httpService.getAllPosts().subscribe(
      this._allPosts$
    )
  }

  private loadCurrentUserPosts() {
    this.authService.user$.pipe(
      switchMap(
        (user) => this._allPosts$.pipe(
          map((posts: Post[]) => {
            return posts.filter((p: Post) => p.userId === user.id)
          }),
        )
      )
    ).subscribe(this._currentUserAllPost$)
  }

  updatePost(post: Post): Observable<any> {
    if (post.id) {
      return zip(
        this.httpService.doUpdatePost(post),
        this._currentUserAllPost$,
        this._allPosts$,
        (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
          if (currentUserAllPosts.length) {
            const indexInCurrentPosts = currentUserAllPosts.findIndex(p => p.id == post.id);
            currentUserAllPosts[indexInCurrentPosts] = post;
            this._currentUserAllPost$.next(currentUserAllPosts);
          }
          if (allPosts.length) {
            const indexInAllPosts = allPosts.findIndex(p => p.id == post.id);
            allPosts[indexInAllPosts] = post;
            this._allPosts$.next(allPosts)
          }
        }
      );
    } else {
      return zip(
        this.httpService.doCreatePost(post),
        this._currentUserAllPost$,
        this._allPosts$,
        (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
          post.id = res.id;
          post.localMockOnly = true;
          if (currentUserAllPosts.length) {
            currentUserAllPosts.push(post);
            this._currentUserAllPost$.next(currentUserAllPosts);
          }
          if (allPosts.length) {
            allPosts.push(post);
            this._allPosts$.next(allPosts)
          }
        }
      );
    }
  }

  deletePost(id: number): Observable<any> {
    return zip(
      this.httpService.doDeletePost(id),
      this._currentUserAllPost$,
      this._allPosts$,
      (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
        if (currentUserAllPosts.length) {
          const indexInCurrentPosts = currentUserAllPosts.findIndex(p => p.id == id);
          currentUserAllPosts.splice(indexInCurrentPosts, 1);
          this._currentUserAllPost$.next(currentUserAllPosts);
        }
        if (allPosts.length) {
          const indexInAllPosts = allPosts.findIndex(p => p.id == id);
          allPosts.splice(indexInAllPosts, 1);
          this._allPosts$.next(allPosts)
        }
      }
    )
  }
}