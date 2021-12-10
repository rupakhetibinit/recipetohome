import React, { createContext, useState } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
	const [auth, setAuth] = useState({
		isAdmin: false,
		email: 'admin@admin.com',
		token: 'ADSFSDFASD',
		name: 'Admin',
	});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{props.children}
		</AuthContext.Provider>
	);
};
