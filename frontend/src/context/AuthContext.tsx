import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { defaultQuestions, defaultCheckmarks } from '../localStorageUtils';
import { apiService } from '../services/api';
import { AuthService } from '../services/auth';

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://127.0.0.1:8000';
const APP_NAMESPACE = '10StepJournal';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string, password2: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            if (!AuthService.isTokenExpired(token)) {
                fetchUserData();
            } else {
                // Token is expired, try to refresh
                AuthService.refreshToken().then(newToken => {
                    if (newToken) {
                        fetchUserData();
                    } else {
                        logout();
                    }
                });
            }
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/user/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
            } else if (response.status === 401) {
                // Try to refresh token
                const newToken = await AuthService.refreshToken();
                if (newToken) {
                    // Retry with new token
                    const retryResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
                        headers: {
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                    if (retryResponse.ok) {
                        const userData = await retryResponse.json();
                        setUser(userData);
                        setIsAuthenticated(true);
                    } else {
                        logout();
                    }
                } else {
                    logout();
                }
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        }
    };

    const clearLocalStorage = () => {
        const keys = ['JournalData', 'Questions', 'Checkmarks', 'CheckmarkStates', 'Answers'];
        keys.forEach(key => {
            localStorage.removeItem(`${APP_NAMESPACE}.${key}`);
        });
    };

    const initializeUserData = async () => {
        // Initialize JournalData with theme preference
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const journalData = {
            darkMode: darkMode ? 'dark' : 'light'
        };
        localStorage.setItem(`${APP_NAMESPACE}.JournalData`, JSON.stringify(journalData));

        try {
            // Try to get user's questions and checkmarks from the database
            const userQuestions = await apiService.getUserQuestions();

            // Set the questions and checkmarks from the database
            localStorage.setItem(`${APP_NAMESPACE}.Questions`, JSON.stringify(userQuestions.questions));
            localStorage.setItem(`${APP_NAMESPACE}.Checkmarks`, JSON.stringify(userQuestions.checkmarks));
        } catch (error) {
            console.error('Failed to initialize user data from database:', error);

            // Set defaults if database fetch fails
            localStorage.setItem(`${APP_NAMESPACE}.Questions`, JSON.stringify(defaultQuestions));
            localStorage.setItem(`${APP_NAMESPACE}.Checkmarks`, JSON.stringify(defaultCheckmarks));
        }

        // Always initialize empty states
        localStorage.setItem(`${APP_NAMESPACE}.CheckmarkStates`, JSON.stringify({}));
        localStorage.setItem(`${APP_NAMESPACE}.Answers`, JSON.stringify({}));
    };

    const login = async (username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        clearLocalStorage(); // Clear any existing data
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        await fetchUserData();
        await initializeUserData(); // Initialize with user's data from database
    };

    const register = async (username: string, email: string, password: string, password2: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, password2 }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(Object.values(error).flat().join(', '));
        }

        clearLocalStorage(); // Clear any existing data

        // First login to get the token
        await login(username, password);

        // Initialize user questions and checkmarks with defaults
        try {
            await apiService.saveUserQuestions({
                questions: defaultQuestions,
                checkmarks: defaultCheckmarks
            });
            await initializeUserData(); // Initialize localStorage with the defaults
        } catch (error) {
            console.error('Failed to initialize user questions:', error);
            // Don't throw error here as registration was successful
        }
    };

    const logout = () => {
        // Clear auth tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Clear app-specific data
        clearLocalStorage();

        // Clear any remaining session storage
        sessionStorage.clear();

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 