import { API_BASE_URL } from '../config';

interface TokenResponse {
    access: string;
    refresh: string;
}

export class AuthService {
    static async refreshToken(): Promise<string | null> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                // If refresh fails, clear tokens and return null
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return null;
            }

            const data: TokenResponse = await response.json();
            localStorage.setItem('accessToken', data.access);
            return data.access;
        } catch (error) {
            console.error('Error refreshing token:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return null;
        }
    }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expirationTime;
        } catch (error) {
            return true;
        }
    }
} 