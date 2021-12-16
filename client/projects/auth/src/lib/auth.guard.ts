import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import jwt_decode from 'jwt-decode';

import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentUser = this.authService.currentUserValue;

    // console.log('AuthGuard-canActivate currentUser', currentUser);

    if (currentUser?.username) {
      try {
        const tokenDecoded = <{ username: string; iat: number; exp: number }>(
          jwt_decode(currentUser.accessToken)
        );
        const isExpired = new Date().getTime() >= tokenDecoded.exp * 1000;
        // console.log(
        //   'AuthGuard-canActivate exp',
        //   tokenDecoded.exp * 1000,
        //   'now',
        //   new Date().getTime()
        // );

        if (!isExpired) return true;
        else this.authService.logout();
      } catch (error) {
        throw new Error('Something wrong when decode token');
      }
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
