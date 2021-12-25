import React, { useContext } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { AuthContext } from './context/AuthContext';

const Routes = () => {
	// Gets the auth object from the Authenticaton Context
	const { auth, setAuth } = useContext(AuthContext); 
	// Checks whether the jwt token exists and renders the respective stack namely Main and Auth(Login & Register)
	return auth.token ? <MainStack /> : <AuthStack />;

};

export default Routes;
