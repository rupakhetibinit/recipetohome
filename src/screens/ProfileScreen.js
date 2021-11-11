import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react/cjs/react.development';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
	const { auth } = useContext(AuthContext);
	return (
		<View style={styles.container}>
			<Text>This is the Profile screen after logging in</Text>
			<Text>Hello {auth.email}</Text>
		</View>
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
