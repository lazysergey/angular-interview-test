import { AuthService } from './../shared/auth.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, ActivationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, mapTo, switchMap, filter } from 'rxjs/operators';
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
  // public activatedRouteParams = new ReplaySubject(1);
  // pp = new BehaviorSubject(1)


  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.route$ = this.router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(e => (e as ActivationEnd).snapshot)
    );

    this.postId$ = this.route$.pipe(
      filter(s => s.url.length > 0 && s.url[0].path === 'posts'),
      map(s => s.params.id || s.queryParams.id),
      tap(_ => console.log(_)),
    );

    this.loadCurrentPost();
    this.loadAllPosts();
    this.loadCurrentUserPosts();

    // this.postParams$.subscribe(s => console.log(s));

    // this.deleteAction$

    //   .subscribe((id, allPosts) => {
    //     this.pp.getValue()
    //     this.allPosts$.next(allPosts.filter(obj => obj.id !== id))
    //   })


    // currentPost$: ReplaySubject<Post[]> = combineLatest(this.allPosts$, router).pipe(
    //   map(
    //     (allPosts, current) => {
    //         return allPosts
    //     }),

    // );
  }

  updatePost(post: Post): Observable<any> {
    console.log(post);
    if (post.id) {
      return zip(
        this.http.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post),
        this.currentUserAllPost$,
        (post: Post, allPosts: Post[]) => {
          allPosts[allPosts.findIndex(p => p.id == post.id)] = post;
          this.currentUserAllPost$.next(allPosts)
        }
      );
    } else {
      return this.http.post("https://jsonplaceholder.typicode.com/posts/", post).pipe(
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
      tap(_ => console.log("POSTID", _)),
      switchMap((id: number) =>
        this.getPost(id)
      ),
    ).pipe(
      map((postDetails => {
        if (postDetails) {
          // console.log(postDetails)
          return postDetails;
        }
      }))
    ).subscribe(this.currentPost$);
  }

  loadAllPosts() {
    this.getAllPosts().subscribe(
      posts => this.allPosts$.next(posts)
    )
  }

  loadCurrentUserPosts() {
    this.authService.user$.pipe(
      tap(_ => console.log(_)),
      switchMap(
        (user) => this.allPosts$.pipe(
          map((posts: Post[]) => {
            return posts.filter((p: Post) => p.userId === user.id)
          }),
        )
      )
    ).subscribe(this.currentUserAllPost$)
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  }

  getAllUsersPosts(userId: number): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map((posts: Post[]) => posts.filter((p: Post) => p.userId === userId)),
      // tap(posts => {
      //   this.userPosts = posts;
      //   window["p1"] = posts;
      // })
    );
  }

  getPost(id: number): Observable<Post> {
    console.log("GETTING POST", id);
    return this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      catchError(err => {
        return empty();
      }));
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      map(res => {
        const index = this.userPosts.findIndex(p => p.id == id);
        this.userPosts.splice(index, 1);
        return this.userPosts;
      })
    )
  }
}