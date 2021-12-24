import React, { createContext, useState } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
	const [auth, setAuth] = useState({
		isAdmin: false,
		email: 'admin@admin.com',
		token:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY0MDMyNTA4MCwiZXhwIjoxNjQyOTE3MDgwfQ.d09MVsmEgWoLvquBMmuZHdIPWw21Ce_WRrMVCo-4dQA',
		name: 'superuser',
		userId: '1',
	});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{props.children}
		</AuthContext.Provider>
	);
};
