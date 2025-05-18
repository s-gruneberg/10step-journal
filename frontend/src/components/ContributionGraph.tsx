import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

interface Streak {
    activity_type: string;
    streak_type: string;
    current_streak: number;
    longest_streak: number;
    last_entry_date: string;
}

interface ContributionGraphProps {
    streaks: Streak[];
}

interface CalendarDay {
    date: Date;
    hasEntry: boolean;
}

interface MonthLabel {
    month: string;
    year: number;
}

interface PopupState {
    visible: boolean;
    x: number;
    y: number;
    date: Date | null;
    hasEntry: boolean;
}

export default function ContributionGraph({ streaks }: ContributionGraphProps) {
    const { darkMode } = useDarkMode();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Wed', 'Fri'];
    const [isVertical, setIsVertical] = useState(false);
    const [popup, setPopup] = useState<PopupState>({
        visible: false,
        x: 0,
        y: 0,
        date: null,
        hasEntry: false
    });

    // Handle resize events
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsVertical(width < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get date range for the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Create a map of dates with entries
    const entryMap = new Map(
        streaks.map(streak => [streak.last_entry_date, streak])
    );

    // Generate calendar data
    const calendar: CalendarDay[] = [];
    let currentDate = new Date(sixMonthsAgo);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = entryMap.has(dateStr);

        calendar.push({
            date: new Date(currentDate),
            hasEntry,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group by week
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < calendar.length; i += 7) {
        weeks.push(calendar.slice(i, i + 7));
    }

    // Get unique months for the header
    const uniqueMonths: MonthLabel[] = [];
    calendar.forEach(item => {
        const month = months[item.date.getMonth()];
        const year = item.date.getFullYear();
        if (!uniqueMonths.find(m => m.month === month && m.year === year)) {
            uniqueMonths.push({ month, year });
        }
    });

    const handleCellClick = (event: React.MouseEvent, day: CalendarDay) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setPopup({
            visible: true,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - 40, // Position above the cell
            date: day.date,
            hasEntry: day.hasEntry
        });

        // Hide popup after 2 seconds
        setTimeout(() => {
            setPopup(prev => ({ ...prev, visible: false }));
        }, 2000);
    };

    // Calculate sizes based on screen width
    const baseSize = isVertical ? 12 : 15;
    const cellSize = Math.min(baseSize, Math.max(8, window.innerWidth / 50));
    const cellSpacing = 2;
    const dayLabelWidth = isVertical ? 30 : 40;

    return (
        <div style={{
            padding: isVertical ? '10px' : '20px',
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
            gap: '8px',
            fontSize: isVertical ? '10px' : '12px'
        }}>
            {/* Month labels */}
            <div style={{
                display: 'flex',
                marginLeft: dayLabelWidth + (isVertical ? 4 : 8),
                gap: '4px',
                flexWrap: 'wrap'
            }}>
                {uniqueMonths.map((month, index) => (
                    <div
                        key={index}
                        style={{
                            color: darkMode ? '#8b949e' : '#57606a',
                            width: `${(cellSize + cellSpacing) * 4}px`,
                            textAlign: 'left'
                        }}
                    >
                        {month.month}
                    </div>
                ))}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: isVertical ? 'column' : 'row'
            }}>
                {/* Day labels */}
                <div style={{
                    display: 'flex',
                    flexDirection: isVertical ? 'row' : 'column',
                    width: isVertical ? '100%' : dayLabelWidth,
                    marginRight: isVertical ? 0 : '8px',
                    marginBottom: isVertical ? '8px' : 0,
                    gap: isVertical ? `${cellSize * 2}px` : `${cellSize + 4}px`,
                    justifyContent: isVertical ? 'flex-start' : 'flex-start'
                }}>
                    {days.map(day => (
                        <div
                            key={day}
                            style={{
                                color: darkMode ? '#8b949e' : '#57606a',
                                height: cellSize,
                                lineHeight: `${cellSize}px`,
                                textAlign: isVertical ? 'left' : 'right',
                                width: isVertical ? '20px' : 'auto'
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Contribution grid */}
                <div style={{
                    display: 'flex',
                    flexDirection: isVertical ? 'column' : 'row',
                    gap: `${cellSpacing}px`
                }}>
                    {weeks.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            style={{
                                display: 'flex',
                                flexDirection: isVertical ? 'row' : 'column',
                                gap: `${cellSpacing}px`
                            }}
                        >
                            {week.map((day: CalendarDay, dayIndex: number) => (
                                <div
                                    key={dayIndex}
                                    onClick={(e) => handleCellClick(e, day)}
                                    style={{
                                        width: `${cellSize}px`,
                                        height: `${cellSize}px`,
                                        backgroundColor: day.hasEntry
                                            ? darkMode
                                                ? '#196c2e'  // Dark mode green
                                                : '#40c463'  // Light mode green
                                            : darkMode
                                                ? '#2d333b'  // Dark mode empty
                                                : '#ebedf0', // Light mode empty
                                        borderRadius: '2px',
                                        cursor: 'pointer'
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Click Popup */}
            {popup.visible && popup.date && (
                <div style={{
                    position: 'absolute',
                    left: `${popup.x}px`,
                    top: `${popup.y}px`,
                    backgroundColor: darkMode ? '#2d333b' : '#ffffff',
                    border: `1px solid ${darkMode ? '#444d56' : '#d1d5da'}`,
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '12px',
                    color: darkMode ? '#c9d1d9' : '#24292e',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    zIndex: 1000,
                    pointerEvents: 'none'
                }}>
                    {popup.date.toLocaleDateString()} - {popup.hasEntry ? 'Entry made' : 'No entry'}
                </div>
            )}
        </div>
    );
} 