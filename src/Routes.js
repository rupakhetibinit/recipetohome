import React, { useContext } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { AuthContext } from './context/AuthContext';

const Routes = () => {
	const { auth, setAuth } = useContext(AuthContext);
	// return auth.token !== null ? <MainStack /> : <AuthStack />;
	return <AuthStack />;
};

export default Routes;
