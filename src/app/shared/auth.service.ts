import { CookieConfig } from './cookie.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap} from 'rxjs/operators';
import { Observable, of, ReplaySubject, throwError, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _subscription: Subscription;
  private _user$: ReplaySubject<User> = new ReplaySubject<User>(1);//we need replay subject for late subscribers e.g. account component 
  private _isAuth$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public readonly user$: Observable<User> = this._user$.asObservable();
  public readonly isAuth$: Observable<boolean> = this._isAuth$.asObservable();

  constructor(
    private _cookieService: CookieService,
    private _http: HttpClient
  ) {
    this.checkLoginStatus();
  }

  private _getUsers(): Observable<User[]> {
    return this._http.get<User[]>("https://jsonplaceholder.typicode.com/users");
  }

  checkLoginStatus() {
    if (this._cookieService.get(CookieConfig.authToken)) {
      this._subscription = this._getUser(this._cookieService.get(CookieConfig.authEmail)).subscribe(
        user => {
          this._user$.next(user);
          this._isAuth$.next(true);
          this._subscription.unsubscribe();
        }
        
      );
    } else {
      this._isAuth$.next(false);
    }
  }

  doLogout(): void {
    this._cookieService.delete(CookieConfig.authToken);
    this._isAuth$.next(false);
  }

  private _getUser(email: string): Observable<User> {
    return this._getUsers().pipe(
      map(users => users.find(u => u.email.toLowerCase() == email.toLowerCase()))
    );
  }

  doLogin(email: string, password: string | number): Observable<User> {
    return this._getUser(email).pipe(
      switchMap(user => {
        if (!user) {
          return throwError("Email not exists!")
        }
        const expirationDate = new Date(Date.now() + 1000 * 60 * 10);
        this._cookieService.set(CookieConfig.authToken, btoa('random_token'), expirationDate);
        this._cookieService.set(CookieConfig.authEmail, user.email, expirationDate);
        this._user$.next(user);
        this._isAuth$.next(true);
        return of(user);
      })
    )
  }
}