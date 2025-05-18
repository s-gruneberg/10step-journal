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
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('accessToken');
        return {
            'Content-Type': 'application/json',
            'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
            headers: this.getHeaders()
        });
        return this.handleResponse<UserQuestions>(response);
    }

    async saveUserQuestions(data: Partial<UserQuestions>): Promise<UserQuestions> {
        const response = await fetch(`${API_BASE_URL}/api/user-questions/`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<UserQuestions>(response);
    }

    // Streaks API
    async getStreaks(): Promise<Streak[]> {
        const response = await fetch(`${API_BASE_URL}/api/streaks/`, {
            headers: this.getHeaders()
        });
        return this.handleResponse<Streak[]>(response);
    }

    async getCurrentStreaks(): Promise<Streak[]> {
        const response = await fetch(`${API_BASE_URL}/api/streaks/current/`, {
            headers: this.getHeaders()
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
            headers: this.getHeaders(),
            body: JSON.stringify(data)
        });
        return this.handleResponse<Streak[]>(response);
    }
}

export const apiService = new ApiService(); 