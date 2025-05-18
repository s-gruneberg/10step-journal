import { useDarkMode } from '../context/DarkModeContext'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api'
import ContributionGraph from '../components/ContributionGraph'

interface Streak {
    activity_type: string;
    streak_type: string;
    current_streak: number;
    longest_streak: number;
    last_entry_date: string;
}

interface UserSettings {
    recovery_date: string | null;
}

export default function Insights() {
    const { darkMode } = useDarkMode()
    const { isAuthenticated } = useAuth()
    const [streaks, setStreaks] = useState<Streak[]>([])
    const [recoveryDate, setRecoveryDate] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get streaks from API
                const streaksData = await apiService.getStreaks();
                setStreaks(streaksData);

                // Get user settings for recovery date
                const settings = await apiService.getUserSettings();
                setRecoveryDate(settings.recovery_date);
            } catch (err) {
                setError('Failed to load insights data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
        );
    }

    const journalStreak = streaks.find(s => s.activity_type === 'journal');
    const checkmarkStreaks = streaks.filter(s => s.activity_type !== 'journal');
    const daysInRecovery = recoveryDate
        ? Math.floor((Date.now() - new Date(recoveryDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="container-fluid px-3 px-md-4">
            <h1 className="mb-2">Insights</h1>
            <hr className="mb-4 mt-1" />

            <div className="row g-4">
                {/* Recovery Streak Section */}
                {recoveryDate && (
                    <div className="col-12">
                        <div className={`card ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h3 className="h5 mb-0">Recovery Streak</h3>
                                        <p className="text-muted mb-0">Since {new Date(recoveryDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-end">
                                        <h2 className="mb-0 display-5 fw-bold text-success">{daysInRecovery}</h2>
                                        <span className="text-muted">days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Streaks Section */}
                <div className="col-12 col-md-6">
                    <h2 className="h4 mb-3">Current Streaks</h2>
                    <div className={`card ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
                        <div className="card-body">
                            {journalStreak && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span>Journal Streak</span>
                                    <span className="badge bg-primary">{journalStreak.current_streak} days</span>
                                </div>
                            )}
                            {checkmarkStreaks.map(streak => (
                                <div key={streak.activity_type} className="d-flex justify-content-between align-items-center mb-3">
                                    <span>{streak.activity_type}</span>
                                    <span className="badge bg-success">{streak.current_streak} days</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Longest Streaks Section */}
                <div className="col-12 col-md-6">
                    <h2 className="h4 mb-3">Longest Streaks</h2>
                    <div className={`card ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
                        <div className="card-body">
                            {journalStreak && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span>Journal Streak</span>
                                    <span className="badge bg-primary">{journalStreak.longest_streak} days</span>
                                </div>
                            )}
                            {checkmarkStreaks.map(streak => (
                                <div key={streak.activity_type} className="d-flex justify-content-between align-items-center mb-3">
                                    <span>{streak.activity_type}</span>
                                    <span className="badge bg-success">{streak.longest_streak} days</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Journal History Section */}
                <div className="col-12">
                    <h2 className="h4 mb-4">History</h2>
                    <div className={`card ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}
                        style={{
                            width: 'fit-content',
                            maxWidth: '100%',
                            margin: '0 auto'
                        }}>
                        <div className="card-body p-0">
                            {streaks.length === 0 ? (
                                <p className="text-muted p-3">No journal entries yet.</p>
                            ) : (
                                <>
                                    <ContributionGraph streaks={streaks} />
                                    <div className="d-flex align-items-center justify-content-center py-3">
                                        <span className="text-muted me-2" style={{ fontSize: '12px' }}>Less</span>
                                        {[0, 1].map(level => (
                                            <div
                                                key={level}
                                                className="rounded me-1"
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    backgroundColor: level === 0
                                                        ? darkMode ? '#2d333b' : '#ebedf0'
                                                        : darkMode ? '#196c2e' : '#40c463'
                                                }}
                                            />
                                        ))}
                                        <span className="text-muted ms-1" style={{ fontSize: '12px' }}>More</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 