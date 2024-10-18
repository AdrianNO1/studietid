import React from 'react';
import styles from '../styles/AcceptDenyButtons.module.css';

interface AcceptDenyButtonsProps {
	onSubmit: (accepted: boolean, setStatus: (status: boolean) => void) => void;
}

const AcceptDenyButtons: React.FC<AcceptDenyButtonsProps> = ({ onSubmit }) => {
	const setStatus = (status: boolean) => {
		if (status) {
			
		} else {
			alert('Noe gikk galt. Vennligst prøv igjen.');
			setButtonsEnabled(true);
		}
	}

	const setButtonsEnabled = (enabled: boolean) => {
		const buttons = document.querySelectorAll(`.${styles.button}`);
		buttons.forEach(button => {
			if (enabled) {
				button.removeAttribute('disabled');
			} else {
				button.setAttribute('disabled', 'true');
			}
		});
	}

	const handleSubmit = (accepted: boolean) => {
		console.log('Submitting');
		setButtonsEnabled(false);
		onSubmit(accepted, setStatus);
	}

	return (
		<div className={styles.acceptDenyButtons}>
			<button className={`${styles.button} ${styles.accept}`} onClick={() => handleSubmit(true)}>
				Godkjenn
			</button>
			<button className={`${styles.button} ${styles.deny}`} onClick={() => handleSubmit(false)}>
				Avvis
			</button>
		</div>
	);
};

export default AcceptDenyButtons;
