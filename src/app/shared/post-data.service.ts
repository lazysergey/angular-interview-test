import { AuthService } from 'src/app/shared/auth.service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, mapTo, switchMap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject, ReplaySubject, from, empty } from 'rxjs';
import { Post, PostBase } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {
  userPosts: Post[];
  allPosts$: ReplaySubject<any> = new ReplaySubject(1);
  currentPost$: ReplaySubject<any> = new ReplaySubject(1);
  currentUserAllPost$: ReplaySubject<any> = new ReplaySubject(1);
  public activatedRouteParams = new ReplaySubject(1);

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loadCurrentPost();
    this.loadAllPosts();
    this.loadCurrentUserPosts();

  }

  updatePost(post: Post) {
    if (post.id) {
      return this.http.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post).pipe(
        map(res => {
          this.userPosts[this.userPosts.findIndex(p => p.id == post.id)] = post;
          return this.userPosts;
        })
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
    this.activatedRouteParams.pipe(
      tap(_ => console.log("NEWROUTE:", JSON.stringify(_))),
      switchMap((params: any) =>
        this.getPost(params.id)
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
    this.getAllPosts().subscribe(
      _ => this.allPosts$.next(_)
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