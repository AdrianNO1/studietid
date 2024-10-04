"use client"
import React, { useState } from 'react';
import styles from '../styles/LoginForm.module.css';
import { setToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loggingIn, setLoggingIn] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoggingIn(true);
		setError('');

		let routing = false;
	
		if (!email || !password) {
			setError('Please enter both email and password');
			setLoggingIn(false);
			return;
		}
	
		try {
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});
		
			if (!response.ok) {
				const data = await response.json()
				console.log(data)
				console.log(data.error)
				setError(data.error || response.statusText)
			}
			else {
				const data = await response.json();
				console.log(data);
				if (data.token) {
					setToken(data.token);
					router.push('/');
					routing = true;
				} else {
					setError('An error occurred during login. Please try again.');
				}
			}

		} catch (error) {
			setError('An error occurred during login. Please try again.');
			console.error('Error:', error);
		} finally {
			if (!routing) {
				setLoggingIn(false);
			}
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Studietid</h1>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h2 className={styles.subtitle}>Login</h2>
				{error && <p className={styles.error}>{error}</p>}
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
				<button type="submit" disabled={loggingIn} className={`${styles.loginButton} ${loggingIn ? styles.loginButtonDisabled : ''}`}>
					Logg inn
				</button>
			</form>
			<p className={styles.register}>
				Har ikke konto? <a href="/register">Registrer</a>
			</p>
		</div>
	);
};

export default LoginForm;
