import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface ApplicationUser {
  accessToken: string;
  expiredIn: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject$: BehaviorSubject<ApplicationUser | null>;
  public currentUser$: Observable<ApplicationUser | null>;

  constructor(private readonly httpService: HttpClient) {
    this.currentUserSubject$ = new BehaviorSubject<ApplicationUser | null>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  get currentUserValue(): ApplicationUser | null {
    return this.currentUserSubject$.value;
  }

  login(username: string, password: string): Observable<ApplicationUser> {
    return this.httpService
      .post<any>(`api/auth/login`, {
        username,
        password,
      })
      .pipe(
        map((user: ApplicationUser) => {
          if (user && user.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject$.next(user);
          }

          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject$.next(null);
  }
}
