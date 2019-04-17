import { CookieConfig } from './cookie.config';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { map, catchError, mergeMap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { Observable, of, ReplaySubject, merge, Subject, throwError, interval } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  public user: User;
  public isAuth: boolean;
  public user$: ReplaySubject<User> = new ReplaySubject<User>(1);
  public isAuth$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.isAuth$.subscribe(_ => console.log(_))
    this.checkLoginStatus();
  }

  private getUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://jsonplaceholder.typicode.com/users");
  }

  checkLoginStatus() {
    if (this.cookieService.get(CookieConfig.authToken)) {
      this.getUser(this.cookieService.get(CookieConfig.authEmail)).subscribe(
        user => {
          this.user$.next(user);
          this.isAuth$.next(true);
        }
      );
    } else {
      this.isAuth$.next(false);
    }
  }

  // isAuthChanges(): Observable<boolean> {
  //   return interval(1000).pipe(
  //     switchMap(_ => of(!!this.cookieService.get(CookieConfig.authToken))),
  //     distinctUntilChanged(),
  //     map(isAuth => {
  //       this.isAuth = isAuth;
  //       return isAuth;
  //     }),
  //   );
  // }

  doLogout(): void {
    this.cookieService.delete(CookieConfig.authToken);
    this.user$.next(null);
    // this.isAuth$.next(false);
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
        this.user$.next(user);
        this.isAuth$.next(true);
        return of(user);
      })
    )
  }

  ngOnDestroy() {
    // this.isAuthSubscription.unsubscribe();
  }
}