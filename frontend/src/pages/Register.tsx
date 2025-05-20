import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, email, password, password2);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className={`card ${darkMode ? 'bg-dark text-light' : ''} mt-5`}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Registration coming soon!</h2>
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
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                <div className="mb-3">
                                    <label htmlFor="password2" className="form-label">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                        id="password2"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    Register
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <Link to="/login">Already have an account? Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 