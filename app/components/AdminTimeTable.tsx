import React, { useState, useEffect } from 'react';
import EditableComment from './EditableComment';
import AcceptDenyButtons from './AcceptDenyButtons';
import styles from '../styles/AdminTimeTable.module.css';
import { getToken } from '../../utils/auth';

interface TimeEntry {
    id: number;
    person: string;
    subject: string;
    time: Date;
    room: string;
    status: "venter på godkjenning" | "godkjent" | "avvist";
    comment: string;
    timer: number;
}

interface TimeTableProps {
    entries: TimeEntry[];
}

const statusClasses: { [key in TimeEntry['status']]: string } = {
    "venter på godkjenning": "blue",
    "godkjent": "green",
    "avvist": "orange"
}

const AdminTimeTable: React.FC<TimeTableProps> = ({ entries: initialEntries }) => {
    const [entries, setEntries] = useState<TimeEntry[]>(initialEntries);
    const [sortColumn, setSortColumn] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        setEntries(initialEntries);
    }, [initialEntries]);

    useEffect(() => {
        setEntries(prevEntries => {
            const sortedEntries = [...prevEntries].sort((a, b) => {
                let aValue = a[sortColumn as keyof TimeEntry];
                let bValue = b[sortColumn as keyof TimeEntry];
                
                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === null) return sortDirection === 'asc' ? -1 : 1;
        
                if (aValue === bValue) return 0;

                if (sortDirection === 'asc') {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            });
        
            return sortedEntries;
        });
    }, [sortColumn, sortDirection]);
    
    const formatTimeRange = (startTime: Date, duration: number): JSX.Element => {
        if (typeof startTime === 'string') {
            startTime = new Date(startTime);
        }
        const [hours, minutes] = startTime.toTimeString().split(':').map(Number);
        const startDate = new Date(2023, 0, 1, hours, minutes);
        const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

        const regularDate = startTime.toISOString().split('T')[0];
        
        const formatTime = (date: Date) => {
            return date.toTimeString().slice(0, 5);
        };

        return (
            <>
                <div>{regularDate}</div>
                <div>{`${formatTime(startDate)} - ${formatTime(endDate)}`}</div>
            </>
        )
    };

    const updateRowComment = async (text: string, id: number, setStatus: (status: boolean) => void) => {
		const token = getToken();

		try {
			const response = await fetch('/api/update-comment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, comment: text, id }),
			});
			const data = await response.json();
			if (response.status !== 200) {
                setStatus(false)
				throw new Error(data.error);
			} else {
                setStatus(true);
                setEntries(prevEntries => prevEntries.map(e => e.id === id ? { ...e, comment: text } : e));
            }
		} catch (error) {
            setStatus(false)
			console.error('Error:', error);
		}
    }

    const updateRowStatus = async (accepted: boolean, entry: TimeEntry, setStatus: (status: boolean) => void) => {
		const token = getToken();

        let statusString: "godkjent" | "avvist" | "venter på godkjenning" = accepted ? "godkjent" : "avvist";

		try {
			const response = await fetch('/api/update-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, status: statusString, id: entry.id }),
			});
			const data = await response.json();
			if (response.status !== 200) {
                setStatus(false)
				throw new Error(data.error);
			} else {
                setStatus(true);
                setEntries(prevEntries => prevEntries.map(e => e.id === entry.id ? { ...e, status: statusString } : e));
            }
		} catch (error) {
            setStatus(false)
			console.error('Error:', error);
		}
    }

    const getSortArrowIcon = (key: string) => {
        if (sortColumn === key) {
            return (
                <div className={`${styles.sortArrow}`}>{sortDirection === 'asc' ? '↑' : '↓'}</div>
            )
        }
        return '';
    }

    const handleSort = (key: string) => {
        if (sortColumn === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(key);
            setSortDirection('desc');
        }
    }

    const moreEffectiveSolution = (displayKey: string, key: string, disableSorting: boolean = false) => {
        return (
            <th onClick={() => disableSorting ? null : handleSort(key)}>
                {displayKey.charAt(0).toUpperCase() + displayKey.slice(1)} {disableSorting ? null : getSortArrowIcon(key)}
            </th>
        )
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.timeTable}>
                <thead>
                    <tr>
                        {moreEffectiveSolution('person', 'person')}
                        {moreEffectiveSolution('fag', 'subject')}
                        {moreEffectiveSolution('tid', 'time')}
                        {moreEffectiveSolution('rom', 'room')}
                        {moreEffectiveSolution('status', 'status')}
                        {moreEffectiveSolution('kommentar', 'comment')}
                        {moreEffectiveSolution('action', 'action', true)}
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.person}</td>
                            <td>{entry.subject}</td>
                            <td>{formatTimeRange(entry.time, entry.timer)}</td>
                            <td>{entry.room}</td>
                            <td className={statusClasses[entry.status]}>{entry.status}</td>
                            <td><EditableComment key={entry.id} defaultText={entry.comment} onSubmit={(text, setStatus) => updateRowComment(text, entry.id, setStatus)}/></td>
                            <td><AcceptDenyButtons key={entry.id} onSubmit={(accepted, setStatus) => updateRowStatus(accepted, entry, setStatus)} /></td>
                        </tr>
                    )) : <tr><td colSpan={7}>Det er ingen med studietimer</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTimeTable;