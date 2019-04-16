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

  // private isAuthObservable: Observable<boolean>;
  // private isAuthSubject: any;
  // private isAuthSubscription: any;
  // userObj = new ReplaySubject<User>(1)
  // reloadUserEvent: Subject<boolean> = new Subject();
  public currentUser: User;
  public isAuth: boolean;

  // get isAuthorised(): Observable<boolean> {
  //   if(this.cookieService.get(CookieNames.auth_token)) {
  //     fetch('userGet')
  //       .then(userService.user.next(user)) => true
  //       //getUserDetails
  //       this.user =
  //   } 
  //   return Observable.of(null)
  //     .merge(this.reloadUserEvent)
  //     .switchMap(() => {
  //       console.log('Reloaded');
  //       const isAuth = this.tokenStoreService.getItem(TokenKeys.USER_KEY, false);

  //       return Observable.of(!!isAuth);
  //     });
  // }

  // logout() {
  //   this.tokenStoreService.removeItem(TokenKeys.USER_KEY);
  //   this.reloadUserEvent.next(false);
  //   //redirect
  // }

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {

    // this.checkStoredCookies();
  }

  private getUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://jsonplaceholder.typicode.com/users");
  }

  // checkStoredCookies() {
  //   if (this.cookieService.get(CookieNames.auth_token)) {
  //     this.doesUserExist(this.cookieService.get(CookieNames.auth_email))
  //   }
  // }

  isAuthChanges(): Observable<boolean> {
    return interval(1000).pipe(
      switchMap(_ => of(!!this.cookieService.get(CookieConfig.authToken))),
      distinctUntilChanged(),
      map(isAuth => {
        this.isAuth = isAuth;
        console.log('setting isAuth to', isAuth);
        // if(!isAuth) {
        //   this.router.navigate(['']);
        // }
        return isAuth;
      }),
    );
  }

  // doLogin(res): Observable<boolean> {
  //   console.trace("logging in user:", res);
  //   return of(true);
  // }

  doLogout(): void {
    this.cookieService.delete(CookieConfig.authToken);
    this.currentUser = null;
    this.isAuth = false;
  }
  private doesUserExist(email: string): Observable<User> {
    return this.getUsers().pipe(
      map(users => users.find(u => u.email.toLowerCase() == email.toLowerCase()))
    );
  }

  doLogin(email: string, password: string | number): Observable<User> {
    return this.doesUserExist(email).pipe(
      switchMap(user => {
        if (!user) {
          return throwError("Email not exists!")
        }
        this.cookieService.set(CookieConfig.authToken, btoa('random_token'), new Date(Date.now() + 1000 * 60 * 10));
        this.currentUser = user;
        this.isAuth = true;
        return of(user);
      }),
      // catchError(err => console.log(err))
    )
  }

  ngOnDestroy() {
    // this.isAuthSubscription.unsubscribe();
  }
}