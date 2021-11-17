import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';

const RecipeScreen = ({ navigation }) => {
	return (
		<SafeAreaView style={styles.container}>
			<Text>This is the recipe screen</Text>
			<CustomButton
				onPress={() => navigation.navigate('SelectedRecipeScreen')}
				text='Go to selected recipe'
			/>
		</SafeAreaView>
	);
};

export default RecipeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
