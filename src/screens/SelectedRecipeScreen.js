import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';

const SelectedRecipeScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { auth } = useContext(AuthContext);
	const token = auth.token;

	const { recipeId } = route.params;
	const { data, loading, error } = useFetch(
		'https://heroku-recipe-api.herokuapp.com/api/v1/recipes',
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	);
	if (loading) {
		return <ActivityIndicator />;
	} else if (data) {
		const recipe = data.find((recipe) => recipe.id === recipeId);
		console.log(recipe);
	}
	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<Text>Hello from nowhere</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});
export default SelectedRecipeScreen;
