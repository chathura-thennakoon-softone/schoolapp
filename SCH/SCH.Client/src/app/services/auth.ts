import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from './auth-api';
import { AuthResponse } from '../interfaces/auth-response';
import { User } from '../interfaces/user';
import { LoginRequest } from '../interfaces/login-request';
import { RegisterRequest } from '../interfaces/register-request';
import { Observable, tap, catchError, throwError } from 'rxjs';

/**
 * Authentication service that manages user state, tokens, and auth logic
 */
@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly authApi = inject(AuthApi);
  private readonly router = inject(Router);

  // Token keys for localStorage
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  // Signals for reactive state management
  private readonly currentUserSignal = signal<User | null>(null);
  private readonly isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals
  public readonly currentUser = computed(() => this.currentUserSignal());
  public readonly isAuthenticated = computed(() => this.isAuthenticatedSignal());
  public readonly isAdmin = computed(() =>
    this.currentUser()?.roles.includes('Admin') ?? false
  );
  public readonly isBasic = computed(() =>
    this.currentUser()?.roles.includes('Basic') ?? false
  );

  constructor() {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuthState(): void {
    const token = this.getAccessToken();
    const user = this.getUserFromStorage();

    if (token && user) {
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }

  /**
   * Login user
   */
  public login(request: LoginRequest): Observable<AuthResponse> {
    return this.authApi.login(request).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  public register(request: RegisterRequest): Observable<AuthResponse> {
    return this.authApi.register(request).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   * Note: Does not handle navigation - caller should navigate as needed
   */
  public logout(): void {
    const token = this.getAccessToken();
    
    if (token) {
      // Call logout API (fire and forget)
      this.authApi.logout().subscribe({
        error: (error) => console.error('Logout API error:', error),
      });
    }

    this.clearAuthState();
  }

  /**
   * Refresh access token
   */
  public refreshToken(): Observable<AuthResponse> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      this.clearAuthState();
      return throwError(() => new Error('No tokens available'));
    }

    return this.authApi.refreshToken({ accessToken, refreshToken }).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError((error) => {
        this.clearAuthState();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get access token from localStorage
   */
  public getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user has a specific role
   */
  public hasRole(role: string): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  public hasAnyRole(roles: string[]): boolean {
    const userRoles = this.currentUser()?.roles ?? [];
    return roles.some((role) => userRoles.includes(role));
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Store tokens
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    // Update state
    this.currentUserSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Clear authentication state
   */
  private clearAuthState(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired (basic check - you might want to use a JWT library)
   */
  public isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  }
}


