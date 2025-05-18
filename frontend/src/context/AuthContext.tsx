import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, email: string, password: string, password2: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUserData();
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
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        }
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
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        await fetchUserData();
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

        await login(username, password);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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