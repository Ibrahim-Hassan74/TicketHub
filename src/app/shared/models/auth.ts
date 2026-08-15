export interface AuthResponse {
    success: boolean;
    message: string;
    statusCode: number;
    userName?: string;
    email?: string;
    token?: string;
    expiration?: string;
    refreshToken?: string;
    refreshTokenExpirationDateTime?: string;
    errors?: string[];
}

export interface LoginRequest {
    email: string;
    password?: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    userName: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
}

export interface RefreshTokenRequest {
    token: string;
    refreshToken: string;
}

export interface User {
    id?: string;
    email?: string;
    displayName?: string;
    role?: string;
    isActive?: boolean;
    createdAt?: Date;
}
