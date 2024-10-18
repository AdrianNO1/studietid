"use client"
import React, { useContext } from 'react';
import UserHomePage from './components/UserHomePage';
import { AuthContext } from './AuthContext';
import AdminHomePage from './components/AdminHomePage';
import styles from './styles/page.module.css';
import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';

interface TimeEntry {
	id: number;
	subject: string;
	time: string;
	room: string;
	status: "venter på godkjenning" | "godkjent" | "avvist";
	comment: string;
	timer: number;
}


const Home: React.FC = () => {
	const authContext = useContext(AuthContext);

	if (!authContext) {
		throw new Error('AuthContext must be used within an AuthProvider');
	}

	const { isAdmin } = authContext;

	return (
		<div className={styles.container}>
			{ isAdmin ? <AdminHomePage/> : <UserHomePage/> }
		</div>
	);
};

export default Home;
