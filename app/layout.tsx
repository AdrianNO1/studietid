import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "./AuthWrapper";

export const metadata: Metadata = {
	title: "Studietid",
	description: "Hei",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<AuthWrapper>{children}</AuthWrapper>
			</body>
		</html>
	);
}
