import React, { useState } from 'react';
import styles from '../styles/AddTimeModal.module.css';
import { useEffect, useRef } from 'react';

interface AddTimeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (entry: TimeEntry) => void;
	studyData: any[];
	roomData: any[];
	subjectData: any[];
}

interface TimeEntry {
	subject: string;
	room: string;
	startTime: string;
	duration: number;
}

const AddTimeModal: React.FC<AddTimeModalProps> = ({ isOpen, onClose, onSubmit, studyData, roomData, subjectData }) => {
	const [subject, setSubject] = useState('');
	const [room, setRoom] = useState('');
	const [startTime, setStartTime] = useState('');
	const [duration, setDuration] = useState(1);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ subject, room, startTime, duration });
		onClose();
	};

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
		  if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			onClose();
		  }
		};
	
		if (isOpen) {
		  document.addEventListener('mousedown', handleClickOutside);
		}
	
		return () => {
		  document.removeEventListener('mousedown', handleClickOutside);
		};
	  }, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent} ref={modalRef}>
				<h2>Legg til ny time</h2>
				<form onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor="subject">Subject:</label>
						<select
							id="subject"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							required
						>
							<option value="">Velg Subject</option>
							{subjectData ? subjectData.map((s: any) => (
								console.log(s.subjectname),
								<option key={s.subjectname} value={s.subjectname}>
									{s.subjectname}
								</option>
							)) : <h1>Loading...</h1>}
						</select>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="room">Rom:</label>
						<select
							id="room"
							value={room}
							onChange={(e) => setRoom(e.target.value)}
							required
						>
							<option value="">Velg rom</option>
							{roomData ? roomData.map((r: any) => (
								<option key={r.roomname} value={r.roomname}>
									{r.roomname}
								</option>
							)) : <h1>Loading...</h1>}
						</select>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="startTime">Starttid:</label>
						<input
							type="time"
							id="startTime"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="duration">Varighet:</label>
						<select
							id="duration"
							value={duration}
							onChange={(e) => setDuration(Number(e.target.value))}
							required
						>
							<option value={1}>1 time</option>
							<option value={2}>2 timer</option>
						</select>
					</div>
					<div className={styles.buttonGroup}>
						<button type="button" onClick={onClose} className={styles.cancelButton}>
							Avbryt
						</button>
						<button type="submit" className={styles.submitButton}>
							Legg til
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddTimeModal;
