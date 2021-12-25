import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkbox, List } from 'react-native-paper';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
const SingleIngredient = ({ item, name }) => {
	const [checked, setChecked] = useState(item.checked);
	const { setCart, cart, total, setTotal } = useContext(CartContext);

	return (
		<View style={styles.container}>
			<Checkbox
				status={checked ? 'checked' : 'unchecked'}
				onPress={() => {
					if (!checked) {
						setChecked(!checked);
					} else {
						setChecked(!checked);
					}
				}}
				color='#5F2EEA'
			/>
			<Text style={{ flex: 1, flexWrap: 'wrap' }}>
				{item.amount} {item.measurement} {item.name}
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
