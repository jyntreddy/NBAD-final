import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TokenExpiryComponent } from './token-expiry/token-expiry.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  private apiUrl = 'http://3.145.178.204:3000';
  private dialogRefer: MatDialogRef<TokenExpiryComponent> | undefined;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(
      this.checkAuthenticated()
    );
  }

  private checkAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenExpiry(): number | null {
    const expiry = localStorage.getItem('token_expiry');
    return expiry ? parseInt(expiry, 10) : null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  setAuthenticatedStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  signup(
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    password: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/signup`, {
        firstName,
        lastName,
        email,
        username,
        password,
      })
      .pipe(
        catchError((error) => {
          return throwError(error.error || 'Server error');
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response: any) => {
          const token = response.token;
          this.storeToken(token);
          this.setAuthenticatedStatus(true);
          this.initTokenExpirationTimer();
          return { response };
        })
      );
  }

  storeToken(token: string): void {
    const currentTime = new Date().getTime();
    const tokenExpiry = currentTime + 60000;
    localStorage.setItem('token', token);
    localStorage.setItem('token_expiry', tokenExpiry.toString());
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    this.setAuthenticatedStatus(false);
    if (
      this.dialogRefer &&
      this.dialogRefer.componentInstance instanceof TokenExpiryComponent
    ) {
      this.dialogRefer.close();
    }
    this.router.navigate(['/']);
  }

  initTokenExpirationTimer(): void {
    timer(0, 1000)
      .pipe(switchMap(() => this.checkTokenExpiry()))
      .subscribe((expired) => {
        if (expired == true) {
          this.logout();
        }
      });

    timer(0, 1000)
      .pipe(
        switchMap(() => this.checkTokenExpiryPopup()),
        distinctUntilChanged()
      )
      .subscribe((almostExpired) => {
        if (almostExpired) {
          this.showTokenExpiryNotification();
        }
      });
  }

  private checkTokenExpiryPopup(): Observable<boolean> {
    const expiry = this.getTokenExpiry();

    if (expiry) {
      const currentTime = new Date().getTime();
      const timeLeft = (expiry - currentTime) / 1000;
      return of(timeLeft <= 20);
    }

    return throwError(false);
  }

  showTokenExpiryNotification(): void {
    if (this.isAuthenticatedSubject.getValue()) {
      const dialogRef = this.dialog.open(TokenExpiryComponent, {
        width: '400px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          const currentTime = new Date().getTime();
          const tokenExpiry = currentTime + 60000;
          localStorage.setItem('token_expiry', tokenExpiry.toString());
        } else {
        }
      });
    }
  }

  private checkTokenExpiry(): Observable<boolean> {
    const expiry = this.getTokenExpiry();

    if (expiry) {
      const currentTime = new Date().getTime();
      const expired = expiry < currentTime;
      return of(expired);
    }

    return throwError(true);
  }

}
