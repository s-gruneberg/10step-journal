import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, password2: string, recoveryDate?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simplified AuthProvider - no backend, always returns isAuthenticated=false
export function AuthProvider({ children }: { children: ReactNode }) {
    const value: AuthContextType = {
        isAuthenticated: false,
        user: null,
        login: async () => {
            throw new Error('Login is not available. This is a static frontend-only application.');
        },
        logout: () => {
            // No-op
        },
        register: async () => {
            throw new Error('Registration is not available. This is a static frontend-only application.');
        },
    };

    return (
        <AuthContext.Provider value={value}>
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