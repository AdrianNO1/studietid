import React, { useState } from 'react';
import styles from '../styles/SignupForm.module.css';
import { useRouter } from 'next/navigation';
import { setToken } from '../../utils/auth';

const SignupForm = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (password !== confirmPassword) {
			setError('Passordene stemmer ikke');
			return;
		}
		let responseStatus = 0;
		try {
			const response = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password, isAdmin }),
			});

			const data = await response.json();
			if (!response.ok) {
				responseStatus = response.status;
				throw new Error(data.error);
			} else {
				setToken(data.token);
				router.push('/');
			}

			// Clear the form
			setName('');
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			setIsAdmin(false);
			setError('');
		} catch (error: any) {
			console.log(error)
			console.error('Error during signup:', error);
			if (responseStatus == 500 || !error.message) {
				setError('Det oppstod en feil under registrering. Vennligst prøv igjen.');
			} else {
				setError("Error: " + error.message);
			}
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Studietid</h1>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h2 className={styles.subtitle}>Registrer deg</h2>
				{error && <p className={styles.error}>{error}</p>}
				<div className={styles.inputGroup}>
					<label htmlFor="name">Fullt Navn</label>
					<input
						type="text"
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="email">E-post</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="password">Passord</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="confirmPassword">Bekreft passord</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="checkbox"
						id="isAdmin"
						checked={isAdmin}
						onChange={(e) => setIsAdmin(e.target.checked)}
					/>
					<label htmlFor="isAdmin">Er du administrator?</label>
				</div>
				<button type="submit" className={styles.signupButton}>
					Registrer
				</button>
			</form>
			<p className={styles.login}>
				Har allerede konto? <a href="/login">Logg inn</a>
			</p>
		</div>
	);
};

export default SignupForm;