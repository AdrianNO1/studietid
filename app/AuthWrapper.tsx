'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '../utils/auth';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		const validateToken = async () => {
			const token = getToken();
			console.log('TokenHH:', token);

			const publicPaths = ['/login', '/register'];

			if (token && !publicPaths.includes(window.location.pathname)) {
				try {
					const response = await fetch('/api/validate-token', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ token }),
					});
					const data = await response.json();
					if (response.status !== 200) {
						throw new Error(data.error);
					}

					if (!data.isvalid) {
						removeToken();
						router.push('/login');
					}
				} catch (error) {
					console.error('Token validation error:', error);
					removeToken();
					router.push('/login');
				}
			} else if (!publicPaths.includes(window.location.pathname)) {
				router.push('/login');
			}
		};

		validateToken();
	}, [router]);

	return <>{children}</>;
}
