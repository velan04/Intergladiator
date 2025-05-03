import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { apiUrl } from 'src/apiconfig';
import { User } from '../models/user.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  public apiUrl = apiUrl;

  private userRoleSubject = new BehaviorSubject<string>('');
  private userIdSubject = new BehaviorSubject<string>('');
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  userRole$ = this.userRoleSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, user).pipe(
      catchError(this.handleError<any>('register', true))
    );
  }

  login(credentials: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          const decoded = this.decodeToken(response.token);

          if (decoded) {
            localStorage.setItem('userId', decoded['nameid']);
            localStorage.setItem('userRole', decoded['role']);
            localStorage.setItem('userName', decoded['unique_name']);

            this.userIdSubject.next(decoded['nameid']);
            this.userRoleSubject.next(decoded['role']);
            this.isAuthenticatedSubject.next(true);
          }
        }
      }),
      catchError(this.handleError<any>('login', true))
    );
  }

  logout(): void {
    localStorage.clear();
    this.userRoleSubject.next('');
    this.userIdSubject.next('');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token !== null && !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const decoded = this.decodeToken(token!);
    return decoded?.role === 'Admin';
  }

  isUser(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    const decoded = this.decodeToken(token!);
    return decoded?.role === 'User';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/user/${userId}`, this.getHeaders()).pipe(
      catchError(this.handleError<User>('getUserById'))
    );
  }

  // Get the user ID from localStorage or from the BehaviorSubject
  getUserId(): string {
    return localStorage.getItem('userId') || this.userIdSubject.value;
  }

  getUserRole(): string {
    return localStorage.getItem('userRole') || this.userRoleSubject.value;
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  getHeaders(): { headers: HttpHeaders } {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  refreshAuthState(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token && !this.isTokenExpired(token)) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.userIdSubject.next(decoded['nameid']);
        this.userRoleSubject.next(decoded['role']);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error('Token decode error', err);
      return null;
    }
  }

  private handleError<T>(operation = 'operation', returnError = false, result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return returnError ? of(error as T) : of(result as T);
    };
  }
}
