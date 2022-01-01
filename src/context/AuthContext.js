import React, { createContext, useState } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
	const [auth, setAuth] = useState({
		isAdmin: false,
		email: '',
		token: '',
		name: '',
		id: null,
		location: null,
		phone: null,
		wallet: 0,
	});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{props.children}
		</AuthContext.Provider>
	);
};
