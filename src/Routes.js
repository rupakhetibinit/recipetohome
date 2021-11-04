import React, { useContext } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { AuthContext } from './context/AuthContext';

const Routes = () => {
  const { auth } = useContext(AuthContext);
  return auth.token ? <MainStack /> : <AuthStack />;
};

export default Routes;
