import { CookieConfig } from './cookie.config';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { map, catchError, mergeMap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of, ReplaySubject, merge, Subject, throwError, interval, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user$: ReplaySubject<User> = new ReplaySubject<User>(1);//we need replay subject for late subscribers e.g. account component 
  public readonly user$: Observable<User> = this._user$.asObservable();
  private _isAuth$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public readonly isAuth$: Observable<boolean> = this._isAuth$.asObservable();
  private subscription: Subscription;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.checkLoginStatus();
  }

  private getUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://jsonplaceholder.typicode.com/users");
  }

  checkLoginStatus() {
    if (this.cookieService.get(CookieConfig.authToken)) {
      this.subscription = this.getUser(this.cookieService.get(CookieConfig.authEmail)).subscribe(
        user => {
          this._user$.next(user);
          this._isAuth$.next(true);
          this.subscription.unsubscribe();
        }
        
      );
    } else {
      this._isAuth$.next(false);
    }
  }

  doLogout(): void {
    this.cookieService.delete(CookieConfig.authToken);
    this._isAuth$.next(false);
  }

  private getUser(email: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => users.find(u => u.email.toLowerCase() == email.toLowerCase()))
    );
  }

  doLogin(email: string, password: string | number): Observable<User> {
    return this.getUser(email).pipe(
      switchMap(user => {
        if (!user) {
          return throwError("Email not exists!")
        }
        const expirationDate = new Date(Date.now() + 1000 * 60 * 10);
        this.cookieService.set(CookieConfig.authToken, btoa('random_token'), expirationDate);
        this.cookieService.set(CookieConfig.authEmail, user.email, expirationDate);
        this._user$.next(user);
        this._isAuth$.next(true);
        return of(user);
      })
    )
  }
}