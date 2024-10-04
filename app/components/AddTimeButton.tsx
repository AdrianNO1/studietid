import React from 'react';
import styles from '../styles/AddTimeButton.module.css';
import AddTimeModal from './AddTimeModal';
import { useState } from 'react';
import { getToken } from '../../utils/auth';

interface TimeEntry {
	subject: string;
	room: string;
	startTime: string;
	duration: number;
}

interface Props {
	studyData: any[];
	roomData: any[];
	subjectData: any[];
}

const AddTimeButton: React.FC<Props> = ({studyData, roomData, subjectData}) => {
	const [isSettingTime, setIsSettingTime] = useState(false);

	const addTime = () => {
		setIsSettingTime(true);
	}

	const onClose = () => {
		setIsSettingTime(false);
	}

	const onSubmit = async (a: TimeEntry) => {
		const token = getToken();
		try {
			const response = await fetch('/api/new-study', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token, ...a }),
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

	return (
		<>
			<button className={styles.addTimeButton} onClick={addTime}>
				+ Time
			</button>
			<AddTimeModal isOpen={isSettingTime} onClose={onClose} onSubmit={onSubmit} studyData={studyData} roomData={roomData} subjectData={subjectData} />
		</>
	);
};

export default AddTimeButton;
