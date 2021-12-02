import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import CustomCard from '../components/CustomCard';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const Category = ({ name }) => {
	return (
		<View style={styles.categoryContainer}>
			<Text>{name}</Text>
		</View>
	);
};

const category = ['All', 'Breakfast', 'Lunch'];

const RecipeScreen = ({ navigation }) => {
	const { auth } = useContext(AuthContext);
	const token = auth.token;
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

	return (
		<SafeAreaView style={styles.container}>
			{/* {category.map((category) => (
				<Category name={category} />
			))} */}
			{/* <CustomCard title='Recipe' /> */}
			{loading && <Text>loading</Text>}
			{data && (
				<Image
					source={{ uri: data[1].imageUrl, width: 200, height: 200 }}
					resizeMode='contain'
				/>
			)}
			{error && <Text>error</Text>}
		</SafeAreaView>
		//TODO Navigate to the selected recipe screen
	);
};

export default RecipeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryContainer: {
		flex: 1,
		flexDirection: 'column',
		maxHeight: 50,
	},
	header: {
		flex: 1,
	},
});
