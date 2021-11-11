import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CartScreen = () => {
	return (
		<View style={styles.container}>
			<Text>This is the cart screen</Text>
		</View>
	);
};

export default CartScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1, 
		alignItems: "center",
		justifyContent: 'center',
	},
});
