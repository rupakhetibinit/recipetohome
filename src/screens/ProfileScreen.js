import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react/cjs/react.development';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { fbauth } from '../../firebase';

const ProfileScreen = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const [loggingOut, setLoggingOut] = useState(false);
	const onLogoutPressed = () => {
		setLoggingOut(true);
		fbauth
			.signOut()
			.then(() => {
				setAuth({
					email: '',
					token: '',
					displayName: '',
				});
			})
			.catch((err) => {
				return;
			});
	};
	return (
		<SafeAreaView style={styles.container}>
			<Text>This is the Profile screen after logging in</Text>
			<Text>Hello {auth.displayName}</Text>
			<CustomButton
				onPress={onLogoutPressed}
				text='Logout'
				loading={loggingOut}
			/>
		</SafeAreaView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
