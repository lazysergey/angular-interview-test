import { HttpService } from './http.service';
import { AuthService } from './../shared/auth.service';
import { Router, ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, switchMap, filter, tap, } from 'rxjs/operators';
import { Observable, of, ReplaySubject, zip, combineLatest } from 'rxjs';
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
    private _authService: AuthService,
    private _httpService: HttpService,
    private _router: Router,
  ) {
    this._route$ = this._router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(e => (e as ActivationEnd).snapshot)
    );

    this._postId$ = this._route$.pipe(
      filter(s => s.url.length > 0 && s.url[0].path === 'posts'),
      map(s => s.params.id || s.queryParams.id),
    );

    this._loadCurrentPost();
    this._loadAllPosts();
    this._loadCurrentUserPosts();

  }

  private _loadCurrentPost() {
    combineLatest(
      this._postId$,
      this._allPosts$,
      (id, allPosts: Post[]) => ({ id: id, post: allPosts.find(p => p.id == id) })
    ).pipe(
      switchMap((res: { post: Post, id: number }) =>
        !res.post
          ? res.id
            ? this._httpService.getPost(res.id)
            : of({})
          : of(res.post)
      )
    ).subscribe(this._currentPost$);
  }

  private _loadAllPosts() {
    this._httpService.getAllPosts().subscribe(
      this._allPosts$
    )
  }

  private _loadCurrentUserPosts() {

    this._authService.user$.pipe(
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
        this._httpService.doUpdatePost(post),
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
        this._httpService.doCreatePost(post),
        this._currentUserAllPost$,
        this._allPosts$,
        (res, currentUserAllPosts: Post[], allPosts: Post[]) => {
          post.id = res.id;
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
      this._httpService.doDeletePost(id),
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