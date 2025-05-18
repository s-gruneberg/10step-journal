import { useEffect, useState } from 'react'
import { useDarkMode } from '../context/DarkModeContext'
import {
    getQuestions,
    restoreDefaultQuestions,
    addQuestion,
    removeQuestion,
    getCheckmarks,
    addCheckmark,
    removeCheckmark,
    restoreDefaultCheckmarks,
    setQuestions,
    setCheckmarks
} from '../localStorageUtils'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/api'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import './Customize.css'

const MAX_QUESTIONS = 12
const MAX_CHECKMARKS = 6

export default function CustomizeQuestions() {
    const { darkMode } = useDarkMode()
    const { isAuthenticated } = useAuth()
    const [tempQuestions, setTempQuestions] = useState<string[]>([])
    const [tempCheckmarks, setTempCheckmarks] = useState<string[]>([])
    const [newQuestion, setNewQuestion] = useState<string>('')
    const [newCheckmark, setNewCheckmark] = useState<string>('')
    const [hasChanges, setHasChanges] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                if (isAuthenticated) {
                    const userQuestions = await apiService.getUserQuestions()
                    setTempQuestions(userQuestions.questions)
                    setTempCheckmarks(userQuestions.checkmarks)
                } else {
                    setTempQuestions(getQuestions())
                    setTempCheckmarks(getCheckmarks())
                }
            } catch (error) {
                console.error('Failed to load user questions:', error)
                setError('Failed to load your saved questions. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [isAuthenticated])

    const handleAddQuestion = () => {
        const trimmed = newQuestion.trim()
        if (!trimmed || tempQuestions.includes(trimmed)) return
        if (tempQuestions.length >= MAX_QUESTIONS) {
            alert(`Maximum ${MAX_QUESTIONS} questions allowed`)
            return
        }

        setTempQuestions([...tempQuestions, trimmed])
        setNewQuestion('')
        setHasChanges(true)
    }

    const handleAddCheckmark = () => {
        const trimmed = newCheckmark.trim()
        if (!trimmed || tempCheckmarks.includes(trimmed)) return
        if (tempCheckmarks.length >= MAX_CHECKMARKS) {
            alert(`Maximum ${MAX_CHECKMARKS} daily activities allowed`)
            return
        }

        setTempCheckmarks([...tempCheckmarks, trimmed])
        setNewCheckmark('')
        setHasChanges(true)
    }

    const handleRemoveQuestion = (q: string) => {
        setTempQuestions(tempQuestions.filter(question => question !== q))
        setHasChanges(true)
    }

    const handleRemoveCheckmark = (c: string) => {
        setTempCheckmarks(tempCheckmarks.filter(checkmark => checkmark !== c))
        setHasChanges(true)
    }

    const handleRestoreDefaults = () => {
        restoreDefaultQuestions()
        restoreDefaultCheckmarks()
        setTempQuestions(getQuestions())
        setTempCheckmarks(getCheckmarks())
        setHasChanges(true)
    }

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            if (isAuthenticated) {
                // For authenticated users, save to backend
                await apiService.saveUserQuestions({
                    questions: tempQuestions,
                    checkmarks: tempCheckmarks
                });
                // After successful save to backend, update localStorage to stay in sync
                setQuestions(tempQuestions);
                setCheckmarks(tempCheckmarks);
            } else {
                // For non-authenticated users, save to local storage only
                setQuestions(tempQuestions);
                setCheckmarks(tempCheckmarks);
            }
            setHasChanges(false);
        } catch (err) {
            console.error('Failed to save changes:', err);
            setError('Failed to save changes. Please try again later.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const items = Array.from(result.type === 'question' ? tempQuestions : tempCheckmarks);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);

        if (result.type === 'question') {
            setTempQuestions(items);
        } else {
            setTempCheckmarks(items);
        }
        setHasChanges(true);
    };

    if (isLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const addButtonClass = `btn ${darkMode ? 'btn-outline-success' : 'btn-success'}`
    const restoreButtonClass = `btn ${darkMode ? 'btn-outline-warning' : 'btn-warning'}`
    const deleteButtonClass = `btn ${darkMode ? 'btn-outline-danger' : 'btn-danger'}`
    const saveButtonClass = `btn ${darkMode ? 'btn-outline-success' : 'btn-success'}`

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="mb-2">Customize</h1>
                    <Link to="/inventory" className={`btn ${darkMode ? 'btn-outline-primary' : 'btn-primary'}`}>
                        Back
                    </Link>
                    <button
                        className={saveButtonClass}
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
                <hr className="mb-4 mt-1" />

                {error && (
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                    </div>
                )}

                <h2 className="h4 mb-3">Daily Activities <small className="text-muted">({tempCheckmarks.length}/{MAX_CHECKMARKS})</small></h2>
                <div className="mb-4">
                    <label htmlFor="newCheckmark" className="form-label"><strong>Add New Activity</strong></label>
                    <div className="d-flex">
                        <input
                            id="newCheckmark"
                            type="text"
                            className={`form-control me-2 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                            value={newCheckmark}
                            onChange={(e) => setNewCheckmark(e.target.value)}
                            placeholder="Enter a new daily activity"
                            disabled={tempCheckmarks.length >= MAX_CHECKMARKS}
                        />
                        <button
                            type="button"
                            className={addButtonClass}
                            onClick={handleAddCheckmark}
                            disabled={tempCheckmarks.length >= MAX_CHECKMARKS}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <Droppable droppableId="checkmarks" type="checkmark">
                    {(provided) => (
                        <ul className="list-group mb-4" {...provided.droppableProps} ref={provided.innerRef}>
                            {tempCheckmarks.map((checkmark, index) => (
                                <Draggable key={`checkmark-${index}`} draggableId={`checkmark-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                        >
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="drag-handle"
                                                >
                                                    <i className="bi bi-grip-vertical"></i>
                                                </div>
                                                <div className="text-break text-capitalize">
                                                    {checkmark}
                                                </div>
                                            </div>
                                            <button className={deleteButtonClass} onClick={() => handleRemoveCheckmark(checkmark)}>
                                                X
                                            </button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>

                <h2 className="h4 mb-3">Inventory Questions <small className="text-muted">({tempQuestions.length}/{MAX_QUESTIONS})</small></h2>
                <div className="mb-4">
                    <label htmlFor="newQuestion" className="form-label"><strong>Add New Question</strong></label>
                    <div className="d-flex">
                        <input
                            id="newQuestion"
                            type="text"
                            className={`form-control me-2 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter a new question"
                            disabled={tempQuestions.length >= MAX_QUESTIONS}
                        />
                        <button
                            type="button"
                            className={addButtonClass}
                            onClick={handleAddQuestion}
                            disabled={tempQuestions.length >= MAX_QUESTIONS}
                        >
                            Add
                        </button>
                    </div>
                </div>

                <Droppable droppableId="questions" type="question">
                    {(provided) => (
                        <ul className="list-group mb-4" {...provided.droppableProps} ref={provided.innerRef}>
                            {tempQuestions.map((question, index) => (
                                <Draggable key={`question-${index}`} draggableId={`question-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${darkMode ? 'bg-dark text-light border-secondary' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                                        >
                                            <div className="d-flex align-items-center flex-grow-1">
                                                <div
                                                    {...provided.dragHandleProps}
                                                    className="drag-handle"
                                                >
                                                    <i className="bi bi-grip-vertical"></i>
                                                </div>
                                                <div className="text-break">
                                                    {question}
                                                </div>
                                            </div>
                                            <button className={deleteButtonClass} onClick={() => handleRemoveQuestion(question)}>
                                                X
                                            </button>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>

                <div className="d-flex justify-content-between">
                    <button className={restoreButtonClass} onClick={handleRestoreDefaults}>
                        Restore Defaults
                    </button>
                    <button
                        className={saveButtonClass}
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </DragDropContext>
    );
}