import React from 'react';
import styles from '../styles/TopBar.module.css';
import { removeToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
	name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
	const router = useRouter();

	const handleLogout = () => {
		removeToken()
		router.push('/login')
	}
		
	return (
		<header className={styles.header}>
			<h1 className={styles.name}>{name}</h1>
			<button className={styles.logoutButton} onClick={handleLogout}>Logg ut</button>
		</header>
	);
};

export default Header;
