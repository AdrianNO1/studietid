import React, { useState } from 'react';
import styles from '../styles/UserTimeTable.module.css';
import AddTimeModal from './AddTimeModal';
import { getToken } from '../../utils/auth';

interface TimeEntry {
    id: number;
    subject: string;
    time: string;
    room: string;
    status: "venter på godkjenning" | "godkjent" | "avvist";
    comment: string;
    timer: number;
}

interface SubmitTimeEntry {
	id?: number;
	subject: string;
	room: string;
	startTime: string;
	duration: number;
    delete?: boolean;
}

interface TimeTableProps {
    entries: TimeEntry[];
    data: {
        studyData: any[];
        roomData: any[];
        subjectData: any[];
    }
}

const statusClasses: { [key in TimeEntry['status']]: string } = {
    "venter på godkjenning": "blue",
    "godkjent": "green",
    "avvist": "orange"
}

const UserTimeTable: React.FC<TimeTableProps> = ({ entries, data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<TimeEntry | null>(null);

    const formatTimeRange = (startTime: string, duration: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date(2023, 0, 1, hours, minutes);
        const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
        
        const formatTime = (date: Date) => {
            return date.toTimeString().slice(0, 5);
        };

        return `${formatTime(startDate)} - ${formatTime(endDate)}`;
    };

    const editSubject = (entry: TimeEntry) => {
        setEditData(entry);
        setIsEditing(true);
    }

	const onSubmit = async (a: SubmitTimeEntry) => {
		const token = getToken();
        let mode = a.delete ? "delete" : "edit";
		try {
			const response = await fetch('/api/update-study', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, mode, ...a }),
			});
			const data = await response.json();
			if (response.status !== 200) {
				throw new Error(data.error);
			} else {
				location.reload();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	}

    interface EditButtonProps {
        entry: TimeEntry;
    }
    
    const EditButton: React.FC<EditButtonProps> = ({ entry }) => {
        return (
            <td>
                <button className={styles.editButton} onClick={() => editSubject(entry)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                </button>
            </td>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.timeTable}>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Tid</th>
                        <th>Rom</th>
                        <th>Status</th>
                        <th>Id</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.subject}</td>
                            <td>{formatTimeRange(entry.time, entry.timer)}</td>
                            <td>{entry.room}</td>
                            <td className={statusClasses[entry.status]}>{entry.status}</td>
                            <td>{entry.id}</td>
                            {entry.status === "venter på godkjenning" ? <EditButton entry={entry}></EditButton> : <td>{entry.comment}</td>}
                        </tr>
                    )) : <tr><td colSpan={6}>Du har ingen studietimer</td></tr>}
                </tbody>
            </table>
            <AddTimeModal isOpen={isEditing} onClose={() => setIsEditing(false)} onSubmit={onSubmit} data={data} mode={"edit"} editData={editData}/>
        </div>
    );
};

export default UserTimeTable;
