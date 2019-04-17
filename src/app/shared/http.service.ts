import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) { }

  deletePost(id: number) {
    console.log(`delete post ${id}`)
    return this.http.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`);
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
  }
  doCreate(post: Post): Observable<Post> {
    return this.http.post<Post>("https://jsonplaceholder.typicode.com/posts/", post);
  }

  doUpdate(post: Post): Observable<Post> {
    return this.http.put<Post>(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post);
  }


}
