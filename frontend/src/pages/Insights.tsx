import { useDarkMode } from '../context/DarkModeContext'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api'

interface Streak {
    activity_type: string;
    streak_type: string;
    current_streak: number;
    longest_streak: number;
    last_entry_date: string;
}

interface JournalEntry {
    date: string;
    answers: Record<string, string>;
    checkmarks: Record<string, boolean>;
    created_at: string;
    updated_at: string;
}

export default function Insights() {
    const { darkMode } = useDarkMode()
    const { isAuthenticated } = useAuth()
    const [streaks, setStreaks] = useState<Streak[]>([])
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [streaksData, entriesData] = await Promise.all([
                    apiService.getStreaks(),
                    apiService.getJournalEntries()
                ]);
                setStreaks(streaksData);
                setEntries(entriesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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

    return (
        <div>
            <h1 className="mb-2">Insights</h1>
            <hr className="mb-4 mt-1" />

            <div className="row">
                {/* Current Streaks Section */}
                <div className="col-md-6 mb-4">
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
                <div className="col-md-6 mb-4">
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
                    <h2 className="h4 mb-3">Journal History</h2>
                    <div className={`card ${darkMode ? 'bg-dark text-light border-secondary' : ''}`}>
                        <div className="card-body">
                            {entries.length === 0 ? (
                                <p className="text-muted">No journal entries yet.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className={`table ${darkMode ? 'table-dark' : ''}`}>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Activities Completed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map(entry => (
                                                <tr key={entry.date}>
                                                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                                                    <td>
                                                        {Object.entries(entry.checkmarks)
                                                            .filter(([, checked]) => checked)
                                                            .map(([activity]) => (
                                                                <span key={activity} className="badge bg-success me-1">
                                                                    {activity}
                                                                </span>
                                                            ))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 