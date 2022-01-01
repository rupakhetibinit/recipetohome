import { useRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const OrderConfirmationScreen = () => {
	const route = useRoute();
	const { orderId } = route.params;
	const { auth, setAuth } = useContext(AuthContext);

	return (
		<View>
			<Text>This is the confirmation details</Text>
		</View>
	);
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({});
