import React, { useEffect, useState, useRef } from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { apiService } from '../services/api';

interface UserUsage {
    dates: string[];
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
}

export default function ContributionGraph() {
    const { darkMode } = useDarkMode();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Mon', 'Wed', 'Fri'];
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [popup, setPopup] = useState<PopupState>({
        visible: false,
        x: 0,
        y: 0,
        date: null
    });
    const [usage, setUsage] = useState<UserUsage | null>(null);

    // Fetch usage data
    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const data = await apiService.getUserUsage();
                setUsage(data);
            } catch (error) {
                console.error('Failed to fetch usage data:', error);
            }
        };
        fetchUsage();
    }, []);

    // Handle resize events
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get date range for the last 6 months
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Create a set of dates with entries
    const entryDates = new Set(usage?.dates || []);

    // Generate calendar data
    const calendar: CalendarDay[] = [];
    let currentDate = new Date(sixMonthsAgo);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const hasEntry = entryDates.has(dateStr);

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
        if (!containerRef.current) return;

        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setPopup({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 30,
            date: day.date
        });

        setTimeout(() => {
            setPopup(prev => ({ ...prev, visible: false }));
        }, 2000);
    };

    // Calculate sizes and visible weeks
    const cellSize = 10;
    const cellSpacing = 2;
    const dayLabelWidth = 30;
    const rightPadding = 16; // Add padding for the right side

    // Calculate how many weeks we can show based on container width
    const maxVisibleWeeks = Math.floor((containerWidth - dayLabelWidth - rightPadding) / (cellSize + cellSpacing));
    const visibleWeeks = weeks.slice(-Math.min(maxVisibleWeeks, weeks.length));
    const visibleMonths = uniqueMonths.slice(-Math.min(maxVisibleWeeks / 4, uniqueMonths.length));

    return (
        <div
            ref={containerRef}
            style={{
                padding: '20px 0 20px 0', // Remove horizontal padding since we're handling it in the content
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '8px',
                fontSize: '12px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Month labels */}
            <div style={{
                display: 'flex',
                marginLeft: dayLabelWidth + 8,
                marginRight: rightPadding,
                gap: '4px'
            }}>
                {visibleMonths.map((month, index) => (
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
                flexDirection: 'row',
                paddingRight: rightPadding
            }}>
                {/* Day labels */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: dayLabelWidth,
                    marginRight: '8px',
                    gap: `${cellSize + 4}px`
                }}>
                    {days.map(day => (
                        <div
                            key={day}
                            style={{
                                color: darkMode ? '#8b949e' : '#57606a',
                                height: cellSize,
                                lineHeight: `${cellSize}px`,
                                textAlign: 'right'
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Contribution grid */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: `${cellSpacing}px`
                }}>
                    {visibleWeeks.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
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
                                                ? '#196c2e'
                                                : '#40c463'
                                            : darkMode
                                                ? '#2d333b'
                                                : '#ebedf0',
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
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: darkMode ? '#c9d1d9' : '#24292e',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap'
                }}>
                    {popup.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            )}
        </div>
    );
} 