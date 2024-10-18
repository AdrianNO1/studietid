"use client"
import React from 'react';
import Header from './TopBar';
import AdminTimeTable from './AdminTimeTable';
import AddTimeButton from './AddTimeButton';
import styles from '../styles/AdminHomePage.module.css';
import { useEffect, useState } from 'react';
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

const AdminHomePage: React.FC = () => {
	const [error, setError] = useState('');
	const [studyData, setStudyData] = useState<TimeEntry[]>([]);
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
                    <h2>Studietimer add</h2>
                </div>
                <AdminTimeTable entries={studyData}/>
            </main>
        </>
    );
};

export default AdminHomePage;
