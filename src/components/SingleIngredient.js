import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
const SingleIngredient = ({ item }) => {
	const [checked, setChecked] = useState(false);
	return (
		<View style={styles.container}>
			<Checkbox
				status={checked ? 'checked' : 'unchecked'}
				onPress={() => setChecked(!checked)}
				color='#5F2EEA'
			/>
			<Text style={{ flex: 1, flexWrap: 'wrap' }}>
				{item.amount} {item.measure} {item.ingredient.name} {item.style}
			</Text>
		</View>
	);
};

export default SingleIngredient;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
