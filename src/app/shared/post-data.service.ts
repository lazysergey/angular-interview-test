import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap, mapTo, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Post, PostBase } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostDataService {
  userPosts: Post[];

  constructor(
    private http: HttpClient
  ) {
    console.log(Math.random())
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

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  }

  getAllUsersPosts(userId: number): Observable<Post[]> {
    return this.getAllPosts().pipe(
      map((posts: Post[]) => posts.filter((p: Post) => p.userId === userId)),
      tap(posts => {
        this.userPosts = posts;
        window["p1"] = posts;
      })
    );
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      catchError(err => {
        console.error(err);
        return of(null)
      }));
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      map(res => {
        const index = this.userPosts.findIndex(p => p.id == id);
        // console.log(index);
        this.userPosts.splice(index, 1);
        return this.userPosts;
      })
    )
  }
}