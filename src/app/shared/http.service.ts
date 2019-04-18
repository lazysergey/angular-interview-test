import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) { }

  doDeletePost(id: number) {
    return this._http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }

  getPost(id: number): Observable<Post | {}> {
    return this._http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      catchError(() => {
        this._router.navigate(["404"]);
        return of({});
      })
    );
  }

  getAllPosts(): Observable<Post[]> {
    return this._http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  }
  doCreatePost(post: Post): Observable<Post> {
    return this._http.post<Post>("https://jsonplaceholder.typicode.com/posts/", post);
  }

  doUpdatePost(post: Post): Observable<Post> {
    return this._http.put<Post>(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post);
  }
}
