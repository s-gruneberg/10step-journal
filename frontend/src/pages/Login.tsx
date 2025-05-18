import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className={`card ${darkMode ? 'bg-dark text-light' : ''} mt-5`}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Login
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <Link to="/register">Don't have an account? Register</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 