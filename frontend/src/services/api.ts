import { API_BASE_URL } from '../config';

interface UserQuestions {
    questions: string[];
    checkmarks: string[];
    created_at: string;
    updated_at: string;
}

interface Streak {
    activity_type: string;
    streak_type: string;
    current_streak: number;
    longest_streak: number;
    last_entry_date: string;
}

class ApiService {
    private baseUrl: string;
    private headers: HeadersInit;

    constructor() {
        this.baseUrl = 'http://localhost:8000';
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('accessToken');
        return {
            ...this.headers,
            'Authorization': `Bearer ${token}`,
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'API request failed');
        }
        return response.json();
    }

    // User Questions API
    async getUserQuestions(): Promise<UserQuestions> {
        const response = await fetch(`${API_BASE_URL}/api/user-questions/`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse<UserQuestions>(response);
    }

    async saveUserQuestions(data: Partial<UserQuestions>): Promise<UserQuestions> {
        const response = await fetch(`${API_BASE_URL}/api/user-questions/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<UserQuestions>(response);
    }

    // Streaks API
    async getStreaks(): Promise<Streak[]> {
        const response = await fetch(`${API_BASE_URL}/api/streaks/`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse<Streak[]>(response);
    }

    async getCurrentStreaks(): Promise<Streak[]> {
        const response = await fetch(`${API_BASE_URL}/api/streaks/current/`, {
            headers: this.getAuthHeaders()
        });
        return this.handleResponse<Streak[]>(response);
    }

    async updateStreak(data: {
        date: string;
        checkmarks: Record<string, boolean>;
        answers: Record<number, string>;
    }): Promise<Streak[]> {
        const response = await fetch(`${API_BASE_URL}/api/streaks/update_streak/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<Streak[]>(response);
    }

    async getUserSettings() {
        const response = await fetch(`${this.baseUrl}/api/user-settings/`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user settings');
        }
        return response.json();
    }

    async updateUserSettings(settings: { recovery_date: string }) {
        const response = await fetch(`${this.baseUrl}/api/user-settings/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(settings),
        });
        if (!response.ok) {
            throw new Error('Failed to update user settings');
        }
        return response.json();
    }

    async updatePassword(oldPassword: string, newPassword: string) {
        const response = await fetch(`${this.baseUrl}/auth/account/`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword,
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to update password');
        }
        return response.json();
    }

    async deleteAccount() {
        const response = await fetch(`${this.baseUrl}/auth/account/`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete account');
        }
        return response.json();
    }
}

export const apiService = new ApiService(); 