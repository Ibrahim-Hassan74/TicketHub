import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const accountService = inject(AccountService);
    const token = accountService.getToken();

    const addToken = (request: any, token: string) => {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    };

    let authReq = req;
    if (token) {
        authReq = addToken(req, token);
    }

    if (req.url.includes('generate-new-jwt-token') ||
        req.url.includes('login') ||
        req.url.includes('register') ||
        req.url.includes('logout')) {
        return next(authReq);
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                if (isRefreshing) {
                    return refreshTokenSubject.pipe(
                        filter(token => token !== null),
                        take(1),
                        switchMap(token => {
                            return next(addToken(req, token!));
                        })
                    );
                } else {
                    isRefreshing = true;
                    refreshTokenSubject.next(null);

                    const refreshToken = accountService.getRefreshToken();
                    const currentToken = accountService.getToken();

                    if (refreshToken && currentToken) {
                        return accountService.refreshToken({ token: currentToken, refreshToken }).pipe(
                            switchMap((response) => {
                                isRefreshing = false;
                                if (response.success && response.token) {
                                    refreshTokenSubject.next(response.token);
                                    return next(addToken(req, response.token));
                                } else {
                                    accountService.forceLogout();
                                    return throwError(() => error);
                                }
                            }),
                            catchError((refreshErr) => {
                                isRefreshing = false;
                                accountService.forceLogout();
                                return throwError(() => refreshErr);
                            })
                        );
                    } else {
                        accountService.forceLogout();
                        return throwError(() => error);
                    }
                }
            }
            return throwError(() => error);
        })
    );
};