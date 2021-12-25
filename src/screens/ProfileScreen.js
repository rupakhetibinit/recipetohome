import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { StatusBar } from 'expo-status-bar';

const ProfileScreen = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const [loggingOut, setLoggingOut] = useState(false);
	const onLogoutPressed = () => {
		setLoggingOut(true);
		setAuth({
			token: '',
			name: '',
			email: '',
		});
	};
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<Text>This is the Profile screen after logging in</Text>
			<Text>Hello {auth.name}</Text>
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
