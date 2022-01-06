import { useContext, useEffect, useState } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { AuthContext } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthAtom } from './stores/atoms';
const Routes = () => {
	const [loading, setLoading] = useState(0);

	// Try to get the auth from async storage using useeffect
	useEffect(() => {
		const getData = async () => {
			// try to get the user from async storage
			try {
				const user = await AsyncStorage.getItem('user');
				// if user is not null
				if (user !== null && user !== undefined) {
					// set the user in the auth context
					setAuth(JSON.parse(user));
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(1);
			}
		};
		getData();
	}, []);
	// Gets the auth object from the Authenticaton Context
	// const { auth, setAuth } = useContext(AuthContext);
	// const [auth, setAuth] = useRecoilState(AuthAtom);
	const setAuth = useSetRecoilState(AuthAtom);
	const { token } = useRecoilValue(AuthAtom);

	// Checks whether the jwt token exists and renders the respective stack namely Main and Auth(Login & Register)
	if (loading === 0) {
		return null;
	}
	return token ? <MainStack /> : <AuthStack />;
};

export default Routes;
