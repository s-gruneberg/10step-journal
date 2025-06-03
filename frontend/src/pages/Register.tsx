import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [recoveryDate, setRecoveryDate] = useState<Date | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(
                username,
                password,
                password2,
                recoveryDate ? recoveryDate.toISOString().slice(0, 10) : ''
            );
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className={`card ${darkMode ? 'bg-dark text-light' : ''} mt-5`}>
                        <div className="card-body">
                            <h2 className="text-center mb-4">Register</h2>
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
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label d-flex align-items-center justify-content-between">
                                        <span>Password</span>
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className={`btn btn-outline-secondary${darkMode ? ' text-light' : ''}`}
                                            tabIndex={-1}
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            disabled={isLoading}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password2" className="form-label">
                                        Confirm Password
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword2 ? 'text' : 'password'}
                                            className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                            id="password2"
                                            value={password2}
                                            onChange={(e) => setPassword2(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className={`btn btn-outline-secondary${darkMode ? ' text-light' : ''}`}
                                            tabIndex={-1}
                                            onClick={() => setShowPassword2((v) => !v)}
                                            aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                                            disabled={isLoading}
                                        >
                                            <i className={`bi ${showPassword2 ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="recoveryDate" className="form-label">
                                        Recovery Date (optional)
                                    </label>
                                    <DatePicker
                                        selected={recoveryDate}
                                        onChange={(date) => setRecoveryDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={50}
                                        className={`form-control ${darkMode ? 'bg-secondary text-light' : ''}`}
                                        id="recoveryDate"
                                        placeholderText="Select your recovery date"
                                        maxDate={new Date()}
                                        isClearable
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Registering...
                                        </>
                                    ) : (
                                        'Register'
                                    )}
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