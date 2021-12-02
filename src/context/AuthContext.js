import React, { createContext, useState } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({
		isAdmin: false,
		email: '',
		token: null,
		name: '',
	});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};
