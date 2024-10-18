"use client"
import React from 'react';
import Header from './TopBar';
import UserTimeTable from './UserTimeTable';
import AddTimeButton from './AddTimeButton';
import styles from '../styles/UserHomePage.module.css';
import { useEffect, useState } from 'react';
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

const UserHomePage: React.FC = () => {
	const [error, setError] = useState('');
	const [studyData, setStudyData] = useState<TimeEntry[]>([]);
	const [roomData, setRoomData] = useState([]);
	const [subjectData, setSubjectData] = useState([]);
	const [name, setName] = useState('Loading...');
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/get-index-data', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: getToken() }),
				});
			
				if (!response.ok) {
					const data = await response.json()
					console.log(data)
					console.log(data.error)
					setError(data.error || response.statusText)
				}
				else {
					const data = await response.json();
					setStudyData(data.studietider);
					setRoomData(data.rooms);
					setSubjectData(data.subjects);
					setName(data.name);
				}

			} catch (error) {
				setError('An error occurred during login. Please try again.');
				console.error('Error:', error);
			}
		}
		fetchData();
	}, []);

	return (
        <>
            <Header name={name} />
            <main className={styles.main}>
                <div className={styles.tableHeader}>
                    <h2>Studietimer</h2>
                    <AddTimeButton data={{ studyData, roomData, subjectData }} />
                </div>
                <UserTimeTable entries={studyData} data={{ studyData, roomData, subjectData }}/>
            </main>
        </>
    );
};

export default UserHomePage;
