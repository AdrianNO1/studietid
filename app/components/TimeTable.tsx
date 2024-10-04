import React from 'react';
import styles from '../styles/TimeTable.module.css';

interface TimeEntry {
    subject: string;
    time: string;
    room: string;
    status: string;
    comment: string;
    timer: number;
}

interface TimeTableProps {
    entries: TimeEntry[];
}

const TimeTable: React.FC<TimeTableProps> = ({ entries }) => {
    const formatTimeRange = (startTime: string, duration: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(2023, 0, 1, hours, minutes);
        const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
        
        const formatTime = (date: Date) => {
            return date.toTimeString().slice(0, 5);
        };

        return `${formatTime(startDate)} - ${formatTime(endDate)}`;
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.timeTable}>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Tid</th>
                        <th>Rom</th>
                        <th>Status</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.subject}</td>
                            <td>{formatTimeRange(entry.time, entry.timer)}</td>
                            <td>{entry.room}</td>
                            <td>{entry.status}</td>
                            <td>{entry.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimeTable;
