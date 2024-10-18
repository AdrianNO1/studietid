import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/EditableComment.module.css';

interface EditableTextAreaProps {
	defaultText: string;
	onSubmit: (text: string, setStatus: (status: boolean) => void) => void;
}

const EditableTextArea: React.FC<EditableTextAreaProps> = ({ defaultText, onSubmit }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [isSettingComment, setIsSettingComment] = useState(false);
	const [isError, setIsError] = useState(false);
	const [text, setText] = useState(defaultText);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditing && textAreaRef.current) {
			textAreaRef.current.focus();
		}
	}, [isEditing]);

	const handleEditClick = () => {
		if (isSettingComment) return;
		setIsEditing(true);
	};

	const setStatus = (status: boolean) => {
		setIsSettingComment(false)
		setIsError(!status)
	}

	const handleSubmit = () => {
		setIsEditing(false);
		setIsSettingComment(true);
		onSubmit(text, setStatus);
	};

	const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
		if (e.relatedTarget && e.relatedTarget instanceof HTMLElement && e.relatedTarget.classList.contains(styles.button)) {
			return;
		}
		handleSubmit();
	};

	// const handleClickOutside = (e: MouseEvent) => {
	// 	if (textAreaRef.current && !textAreaRef.current.parentElement?.contains(e.target as Node)) {
	// 		handleSubmit();
	// 	}
	// };

	// useEffect(() => {
	// 	if (isEditing) {
	// 		document.addEventListener('mousedown', handleClickOutside);
	// 	} else {
	// 		document.removeEventListener('mousedown', handleClickOutside);
	// 	}

	// 	return () => {
	// 		document.removeEventListener('mousedown', handleClickOutside);
	// 	};
	// }, [isEditing]);

	return (
		<div className={styles.container}>
			<textarea
				ref={textAreaRef}
				className={styles.textArea}
				value={text}
				placeholder='Skriv en kommentar...'
				onChange={(e) => setText(e.target.value)}
				onFocus={() => setIsEditing(true)}
				onBlur={(e) => onBlur(e)}
				// readOnly={!isEditing}
			/>
			<button
				className={`${styles.button} ${
					isError ? styles.errorButton :
					isSettingComment ? styles.waitingButton :
					isEditing ? styles.checkButton : 
					styles.editButton
				}`}
				onClick={isEditing ? handleSubmit : handleEditClick}
			>
				{isError ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<line x1="12" y1="8" x2="12" y2="12"></line>
						<line x1="12" y1="16" x2="12" y2="16"></line>
					</svg>
				) : isSettingComment ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<polyline points="12 16 12 12 16 10"></polyline>
					</svg>
				) :
					isEditing ? (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				) : (
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
						<polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
					</svg>
				)}
			</button>
		</div>
	);
};

export default EditableTextArea;
