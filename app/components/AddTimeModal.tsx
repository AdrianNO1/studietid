import React, { use, useState } from 'react';
import styles from '../styles/AddTimeModal.module.css';
import { useEffect, useRef } from 'react';

interface AddTimeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (entry: TimeEntry) => void;
	mode: "add" | "edit";
	data: {
		studyData: any[];
		roomData: any[];
		subjectData: any[];
	};
	editData?: {
		id: number;
		subject: string;
		time: string;
		room: string;
		status: "venter på godkjenning" | "godkjent" | "avvist";
		comment: string;
		timer: number;
	} | null;
}

interface TimeEntry {
	id?: number;
	subject: string;
	room: string;
	startTime: string;
	duration: number;
	delete?: boolean;
}

const AddTimeModal: React.FC<AddTimeModalProps> = ({ isOpen, onClose, onSubmit, data, mode, editData }) => {
	const [subject, setSubject] = useState(editData?.subject || '');
	const [room, setRoom] = useState(editData?.room || '');
	const [startTime, setStartTime] = useState(editData?.time || '');
	const [duration, setDuration] = useState(editData?.timer || 1);

	useEffect(() => {
		if (editData) {
			setSubject(editData.subject);
			setRoom(editData.room);
			setStartTime(editData.time);
			setDuration(editData.timer);
		}
	}, [editData]);

	const { studyData, roomData, subjectData } = data;

	const handleSubmit = (e: React.FormEvent, deleteTime?: boolean) => {
		e.preventDefault();
		let data = { subject, room, startTime, duration } as TimeEntry;
		if (mode === 'edit') {
			data = { ...data, id: editData?.id }
		}
		if (deleteTime) {
			data = { ...data, delete: true }
		}
		onSubmit(data);
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
			<h2>{mode === 'add' ? "Legg til ny time" : "Rediger time"}</h2>
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
					{mode === "edit" && (
						<button
							type="button"
							className={styles.deleteButton}
							onClick={(e) => handleSubmit(e, true)}
						>
							Kanseller time
						</button>
					)}
					<div className={styles.buttonGroup}>
						<button type="button" onClick={onClose} className={styles.cancelButton}>
							Avbryt
						</button>
						<button type="submit" className={styles.submitButton}>
							{mode === 'add' ? 'Legg til' : 'Rediger'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddTimeModal;