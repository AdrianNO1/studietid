import React, { useState } from 'react';
import styles from '../styles/AcceptDenyButtons.module.css';

interface AcceptDenyButtonsProps {
	onSubmit: (accepted: boolean, setStatus: (status: boolean) => void) => void;
}

const AcceptDenyButtons: React.FC<AcceptDenyButtonsProps> = ({ onSubmit }) => {
	const [buttonsEnabled, setButtonsEnabled] = useState(true);

	const setStatus = (status: boolean) => {
		if (!status) {
			alert('Noe gikk galt. Vennligst prøv igjen.');
		}
		setButtonsEnabled(true);
	}

	const handleSubmit = (accepted: boolean) => {
		setButtonsEnabled(false);
		onSubmit(accepted, setStatus);
	}

	return (
		<div className={styles.acceptDenyButtons}>
			<button 
				className={`${styles.button} ${styles.accept}`} 
				onClick={() => handleSubmit(true)} 
				disabled={!buttonsEnabled}
			>
				Godkjenn
			</button>
			<button 
				className={`${styles.button} ${styles.deny}`} 
				onClick={() => handleSubmit(false)} 
				disabled={!buttonsEnabled}
			>
				Avvis
			</button>
		</div>
	);
};

export default AcceptDenyButtons;
