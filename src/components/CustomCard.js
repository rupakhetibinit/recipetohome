import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CustomCard = () => {
	return (
		<View style={styles.container}>
			<Text>This is the card components</Text>
		</View>
	);
};

export default CustomCard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
