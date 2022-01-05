import { useContext, useEffect, useState } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { AuthContext } from './context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
const Routes = () => {
	const [loading, setLoading] = useState(true);

	// Try to get the auth from async storage using useeffect
	useEffect(() => {
		const getData = async () => {
			try {
				const value = await AsyncStorage.getItem('user');
				if (value !== null && value !== undefined) {
					const user = JSON.parse(value);
					console.log(user);
					setAuth({
						token: user.token,
						name: user.name,
						isAdmin: user.isAdmin,
						email: user.email,
						id: user.id,
						location: user.location,
						phone: user.phone,
						wallet: user.wallet,
					});
				}
				setLoading(false);
			} catch (e) {
				console.log(e);
				// error reading value
			}
		};
		getData();
	}, []);
	// Gets the auth object from the Authenticaton Context
	const { auth, setAuth } = useContext(AuthContext);

	// Checks whether the jwt token exists and renders the respective stack namely Main and Auth(Login & Register)
	if (loading) {
		return null;
	}
	return auth.token ? <MainStack /> : <AuthStack />;
};

export default Routes;
