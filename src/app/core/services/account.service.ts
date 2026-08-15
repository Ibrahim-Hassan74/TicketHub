import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, of, catchError, throwError, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { ResourceService } from './resource.service';
import {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    RefreshTokenRequest,
    User
} from '../../shared/models/auth';

@Injectable({
    providedIn: 'root'
})
export class AccountService extends ResourceService<User> {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

    private currentUserSignal = signal<User | null>(null);
    public currentUser = computed(() => this.currentUserSignal());

    private router = inject(Router);

    constructor() {
        super('Account');
    }

    public initializeUser(): Promise<void | User | null> {

        const token = this.getToken();
        if (token && this.isValidTokenFormat(token)) {
            return firstValueFrom(
                this.getMe().pipe(
                    tap((user) => this.currentUserSignal.set(user)),
                    catchError(() => {
                        this.clearSession();
                        return of(null);
                    })
                )
            );
        }

        this.clearSession();
        return Promise.resolve();
    }

    getMe(): Observable<User> {
        return this.get<User>('me');
    }

    loadCurrentUser(): Observable<User> {
        return this.getMe().pipe(
            tap(user => this.currentUserSignal.set(user))
        );
    }

    private isValidTokenFormat(token: string): boolean {
        return token.split('.').length === 3;
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.buildUrl('register'), data);
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(this.buildUrl('login'), data).pipe(
            tap((response) => {
                if (response.success && response.token && response.refreshToken) {
                    this.setSession(response);
                    this.getMe().subscribe(user => this.currentUserSignal.set(user));
                }
            })
        );
    }

    logout(): Observable<void> {
        return this.http.post<void>(this.buildUrl('logout'), {}).pipe(
            catchError(() => of(void 0)),
            tap(() => {
                this.forceLogout();
            })
        );
    }

    public forceLogout(): void {
        this.clearSession();
        const currentUrl = this.router.url;
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: currentUrl } });
    }


    refreshToken(data: RefreshTokenRequest): Observable<AuthResponse> {
        if (!this.isValidTokenFormat(data.token)) {
            return throwError(() => new Error('Invalid token format'));
        }

        return this.http.post<AuthResponse>(this.buildUrl('generate-new-jwt-token'), data).pipe(
            tap((response) => {
                if (response.success && response.token) {
                    localStorage.setItem(this.TOKEN_KEY, response.token);
                    if (response.refreshToken) {
                        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
                    }
                }
            })
        );
    }

    public setSession(authResult: AuthResponse): void {
        if (authResult.token) localStorage.setItem(this.TOKEN_KEY, authResult.token);
        if (authResult.refreshToken) localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
    }

    private clearSession(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        this.currentUserSignal.set(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}