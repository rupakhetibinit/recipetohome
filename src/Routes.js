import { useEffect, useState } from 'react';
import MainStack from './navigation/MainStack';
import AuthStack from './navigation/AuthStack';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthAtom } from './stores/atoms';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
const Routes = () => {
	const setAuth = useSetRecoilState(AuthAtom);
	const { token } = useRecoilValue(AuthAtom);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const getData = async () => {
			SecureStore.getItemAsync('token')
				.then((token) => {
					if (token) {
						console.log('token', token);
						axios
							.get('https://recipetohome-api.herokuapp.com/api/auth/token', {
								headers: {
									Authorization: `Bearer ${token}`,
									'Content-Type': 'application/json',
								},
							})
							.then((res) => {
								if (res.data) {
									setAuth({
										token: res.data.token,
										email: res.data.email,
										id: res.data.userId,
										name: res.data.name,
										isAdmin: res.data.isAdmin,
										location: res.data.location,
										phone: res.data.phone,
										wallet: res.data.wallet,
									});
									console.log(token);
								} else {
									console.log(failed);
								}
							})
							.catch((error) => console.log(error));
					}
				})
				.catch((err) => {
					console.log(err);
				});
		};
		getData();
		setLoading(false);
	}, []);
	// Gets the auth object from the Authenticaton Context
	// const { auth, setAuth } = useContext(AuthContext);
	// const [auth, setAuth] = useRecoilState(AuthAtom);

	// Checks whether the jwt token exists and renders the respective stack namely Main and Auth(Login & Register)
	if (loading === 1) {
		return null;
	}
	return token ? <MainStack /> : <AuthStack />;
};

export default Routes;
