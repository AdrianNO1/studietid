"use client"
import React from 'react';
import Header from './components/TopBar';
import TimeTable from './components/TimeTable';
import AddTimeButton from './components/AddTimeButton';
import styles from './styles/page.module.css';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

interface TimeEntry {
	subject: string;
	time: string;
	room: string;
	status: string;
	comment: string;
	timer: number;
}

const Home: React.FC = () => {
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
					console.log("DATA:", data);
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
		<div className={styles.container}>
			<Header name={name} />
			<main className={styles.main}>
				<div className={styles.tableHeader}>
					<h2>Tidligere timer</h2>
					<AddTimeButton studyData={studyData} roomData={roomData} subjectData={subjectData} />
				</div>
				<TimeTable entries={studyData} />
			</main>
		</div>
	);
};

export default Home;
