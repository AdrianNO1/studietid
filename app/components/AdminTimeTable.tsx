import React, { useState } from 'react';
import EditableComment from './EditableComment';
import AcceptDenyButtons from './AcceptDenyButtons';
import styles from '../styles/AdminTimeTable.module.css';
import { getToken } from '../../utils/auth';

interface TimeEntry {
    id: number;
    person: string;
    subject: string;
    time: string;
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

const AdminTimeTable: React.FC<TimeTableProps> = ({ entries }) => {
    const formatTimeRange = (startTime: string, duration: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(2023, 0, 1, hours, minutes);
        const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
        
        const formatTime = (date: Date) => {
            return date.toTimeString().slice(0, 5);
        };

        return `${formatTime(startDate)} - ${formatTime(endDate)}`;
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
            }
		} catch (error) {
            setStatus(false)
			console.error('Error:', error);
		}
    }

    const updateRowStatus = async (accepted: boolean, id: number, setStatus: (status: boolean) => void) => {
		const token = getToken();

        let statusString = accepted ? "godkjent" : "avvist";

		try {
			const response = await fetch('/api/update-status', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, status: statusString, id }),
			});
			const data = await response.json();
			if (response.status !== 200) {
                setStatus(false)
				throw new Error(data.error);
			} else {
                setStatus(true);
            }
		} catch (error) {
            setStatus(false)
			console.error('Error:', error);
		}
    }        

    return (
        <div className={styles.tableContainer}>
            <table className={styles.timeTable}>
                <thead>
                    <tr>
                        <th>Person</th>
                        <th>Subject</th>
                        <th>Tid</th>
                        <th>Rom</th>
                        <th>Status</th>
                        <th>Id</th>
                        <th>Kommentar</th>
                        <th>Action</th>
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
                            <td>{entry.id}</td>
                            <td><EditableComment defaultText={entry.comment} onSubmit={(text, setStatus) => updateRowComment(text, entry.id, setStatus)}/></td>
                            <td><AcceptDenyButtons onSubmit={(accepted, setStatus) => updateRowStatus(accepted, entry.id, setStatus)} /></td>
                        </tr>
                    )) : <tr><td colSpan={6}>Det er ingen med studietimer</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTimeTable;