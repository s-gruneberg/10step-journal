import { API_BASE_URL } from '../config';
import { AuthService } from './auth';

interface UserQuestions {
    questions: string[];
    checkmarks: string[];
    created_at: string;
    updated_at: string;
}

interface UserUsage {
    dates: string[];
}

interface Streak {
    date: string;
    checkmarks: Record<string, boolean>;
    answers: Record<number, string>;
}

interface UserSettings {
    recovery_date: string | null;
}

class ApiService {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor() {
        this.baseUrl = API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    private async getAuthHeaders(): Promise<HeadersInit> {
        let token = localStorage.getItem('accessToken');

        if (token && AuthService.isTokenExpired(token)) {
            // Token is expired, try to refresh
            token = await AuthService.refreshToken();
            if (!token) {
                // If refresh failed, throw error to trigger re-login
                throw new Error('Authentication expired. Please log in again.');
            }
        }

        return {
            ...this.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            // Try token refresh on 401
            const newToken = await AuthService.refreshToken();
            if (!newToken) {
                throw new Error('Authentication expired. Please log in again.');
            }

            // Retry the original request with new token
            const retryResponse = await fetch(response.url, {
                ...response,
                headers: {
                    ...this.headers,
                    'Authorization': `Bearer ${newToken}`,
                }
            });

            if (!retryResponse.ok) {
                const error = await retryResponse.json();
                throw new Error(error.detail || 'API request failed');
            }
            return retryResponse.json();
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'API request failed');
        }
        return response.json();
    }

    // User Questions API
    async getUserQuestions(): Promise<UserQuestions> {
        const response = await fetch(`${this.baseUrl}/api/user-questions/`, {
            headers: await this.getAuthHeaders()
        });
        return this.handleResponse<UserQuestions>(response);
    }

    async saveUserQuestions(data: Partial<UserQuestions>): Promise<UserQuestions> {
        const response = await fetch(`${this.baseUrl}/api/user-questions/`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<UserQuestions>(response);
    }

    // Streaks API
    async getStreaks(): Promise<Streak[]> {
        const response = await fetch(`${this.baseUrl}/api/streaks/`, {
            headers: await this.getAuthHeaders()
        });
        return this.handleResponse<Streak[]>(response);
    }

    async getCurrentStreaks(): Promise<Streak[]> {
        const response = await fetch(`${this.baseUrl}/api/streaks/current/`, {
            headers: await this.getAuthHeaders()
        });
        return this.handleResponse<Streak[]>(response);
    }

    async updateStreak(data: {
        date: string;
        checkmarks: Record<string, boolean>;
        answers: Record<number, string>;
    }): Promise<Streak[]> {
        const response = await fetch(`${this.baseUrl}/api/streaks/update_streak/`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<Streak[]>(response);
    }

    async getUserSettings(): Promise<UserSettings> {
        const response = await fetch(`${this.baseUrl}/api/settings/`, {
            method: 'GET',
            headers: await this.getAuthHeaders(),
        });
        return this.handleResponse<UserSettings>(response);
    }

    async updateUserSettings(settings: { recovery_date: string }) {
        const response = await fetch(`${this.baseUrl}/api/settings/`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify(settings),
        });
        return this.handleResponse(response);
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        const response = await fetch(`${this.baseUrl}/auth/account/`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword,
            }),
        });
        return this.handleResponse(response);
    }

    async deleteAccount() {
        const response = await fetch(`${this.baseUrl}/auth/account/`, {
            method: 'DELETE',
            headers: await this.getAuthHeaders(),
        });
        return this.handleResponse(response);
    }

    // Usage API
    async getUserUsage(): Promise<UserUsage> {
        const response = await fetch(`${this.baseUrl}/api/usage/`, {
            headers: await this.getAuthHeaders()
        });
        return this.handleResponse<UserUsage>(response);
    }

    async addUsageDate(): Promise<UserUsage> {
        const response = await fetch(`${this.baseUrl}/api/usage/add_date/`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify({})
        });
        return this.handleResponse<UserUsage>(response);
    }
}

export const apiService = new ApiService(); 