import { useDarkMode } from '../context/DarkModeContext'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Settings = () => {
    const { darkMode, toggleDarkMode } = useDarkMode()
    const { isAuthenticated } = useAuth()
    const [recoveryDate, setRecoveryDate] = useState<string>('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16')
    const [colorBlindMode, setColorBlindMode] = useState(localStorage.getItem('colorBlindMode') === 'true')

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserSettings();
        }
        // Apply stored font size
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [isAuthenticated, fontSize]);

    const fetchUserSettings = async () => {
        try {
            const response = await apiService.getUserSettings();
            if (response.recovery_date) {
                setRecoveryDate(response.recovery_date);
            }
        } catch (err) {
            console.error('Failed to fetch user settings:', err);
        }
    };

    const handleFontSizeChange = (size: string) => {
        setFontSize(size);
        localStorage.setItem('fontSize', size);
        document.documentElement.style.fontSize = `${size}px`;
    };

    const handleColorBlindModeChange = (enabled: boolean) => {
        setColorBlindMode(enabled);
        localStorage.setItem('colorBlindMode', enabled.toString());
        // Apply color blind friendly classes to body
        document.body.classList.toggle('color-blind-mode', enabled);
    };

    const handleRecoveryDateChange = async (date: string) => {
        try {
            await apiService.updateUserSettings({ recovery_date: date });
            setRecoveryDate(date);
            setSuccess('Recovery date updated successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update recovery date');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await apiService.updatePassword(oldPassword, newPassword);
            setSuccess('Password updated successfully');
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await apiService.deleteAccount();
            window.location.href = '/';
        } catch (err) {
            setError('Failed to delete account');
            setShowDeleteModal(false);
        }
    };

    const toggleBtnClass = `btn ${darkMode ? 'btn-light' : 'btn-dark'}`
    const dangerBtnClass = `btn ${darkMode ? 'btn-outline-danger' : 'btn-danger'}`
    const primaryBtnClass = `btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'}`

    return (
        <div className="container mt-4">
            <h1 className="mb-2">Settings</h1>
            <hr className="mb-4" />

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {success && (
                <div className="alert alert-success" role="alert">
                    {success}
                </div>
            )}

            {/* Appearance Settings */}
            <div className="card mb-4">
                <div className={`card-body ${darkMode ? 'bg-dark text-light' : ''}`}>
                    <h5 className="card-title">Appearance & Accessibility</h5>

                    {/* Theme Toggle */}
                    <div className="mb-4">
                        <label className="form-label">Theme</label>
                        <div>
                            <button onClick={toggleDarkMode} className={toggleBtnClass}>
                                {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="mb-4">
                        <label className="form-label">Font Size</label>
                        <div className="d-flex align-items-center gap-3">
                            <Form.Range
                                min="12"
                                max="24"
                                step="2"
                                value={fontSize}
                                onChange={(e) => handleFontSizeChange(e.target.value)}
                            />
                            <span className="badge bg-secondary">{fontSize}px</span>
                        </div>
                    </div>

                    {/* Color Blind Mode */}
                    <div className="mb-3">
                        <Form.Check
                            type="switch"
                            id="color-blind-mode"
                            label="Color Blind Mode"
                            checked={colorBlindMode}
                            onChange={(e) => handleColorBlindModeChange(e.target.checked)}
                        />
                        <small className="text-muted d-block mt-1">
                            Enhances contrast and uses color-blind friendly color combinations
                        </small>
                    </div>
                </div>
            </div>

            {/* Authenticated User Settings */}
            {isAuthenticated ? (
                <>
                    <div className="card mb-4">
                        <div className={`card-body ${darkMode ? 'bg-dark text-light' : ''}`}>
                            <h5 className="card-title">Recovery Date</h5>
                            <p className="card-text">Set your recovery date to track your clean time.</p>
                            <input
                                type="date"
                                className="form-control mb-3"
                                value={recoveryDate}
                                onChange={(e) => handleRecoveryDateChange(e.target.value)}
                            />
                            {recoveryDate && (
                                <p className="text">
                                    Days in recovery: {Math.floor((Date.now() - new Date(recoveryDate).getTime()) / (1000 * 60 * 60 * 24))}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className={`card-body ${darkMode ? 'bg-dark text-light' : ''}`}>
                            <h5 className="card-title mb-3">Account Management</h5>
                            <div className="d-flex gap-3">
                                <button
                                    className={primaryBtnClass}
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    Reset Password
                                </button>
                                <button
                                    className={dangerBtnClass}
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>


                </>
            ) : (
                <div className="alert alert-info">
                    Please <a href="/login" className="alert-link">log in</a> to access additional settings.
                </div>
            )}

            {/* Delete Account Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
                    <Modal.Title>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
                    Are you sure you want to delete your account? This will erase all your data and cannot be undone.
                </Modal.Body>
                <Modal.Footer className={darkMode ? 'bg-dark text-light' : ''}>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Password Reset Modal */}
            <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
                    <div className="mb-3">
                        <label className="form-label">Current Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className={darkMode ? 'bg-dark text-light' : ''}>
                    <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePasswordChange}>
                        Update Password
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Settings
