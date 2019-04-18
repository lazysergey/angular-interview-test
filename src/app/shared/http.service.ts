import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient,
  ) { }

  doDeletePost(id: number) {
    console.log(`delete post ${id}`)
    return this._http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }

  getPost(id: number): Observable<Post | {}> {
    return this._http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`).pipe(
      catchError(() => {
        return of({});
      }
      )
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
