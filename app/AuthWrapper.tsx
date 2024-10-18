'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getToken, removeToken } from '../utils/auth';
import Authenticating from './components/Authenticating';
import { AuthContext } from './AuthContext';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathName = usePathname();
	const publicPaths = ['/login', '/register'];
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(null);

	useEffect(() => {
		const validateToken = async () => {
			const token = getToken();
			let redirected = false;

			let responseData = null;
			if (token && !publicPaths.includes(window.location.pathname)) {
				try {
					const response = await fetch('/api/validate-token', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ token }),
					});
					responseData = await response.json();
					if (response.status !== 200) {
						throw new Error(responseData.error);
					}

					if (!responseData.isvalid) {
						removeToken();
						router.push('/login');
						redirected = true;
					}
				} catch (error) {
					console.error('Token validation error:', error);
					removeToken();
					router.push('/login');
					redirected = true;
				}
			} else if (!publicPaths.includes(window.location.pathname)) {
				router.push('/login');
				redirected = true;
			}

			if (!redirected) {
				setIsLoggedIn(true);
				if (responseData) {
					setIsAdmin(responseData.isAdmin);
				}
			}
		};

		validateToken();
	}, [router, pathName]);

	return (
		<AuthContext.Provider value={{ isAdmin }}>
			{isLoggedIn ? children : <Authenticating></Authenticating>}
		</AuthContext.Provider>
	);
	
}
