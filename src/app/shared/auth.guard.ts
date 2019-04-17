import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // let isAuthSubscription = 
    this.authService.isAuth$.subscribe(isAuth => {
      if(!isAuth){
        this.router.navigate(['/account/login']);
        console.log("navtologin")
        // isAuthSubscription.unsubscribe();
      }
    });
    return this.authService.isAuth$;
  }
}