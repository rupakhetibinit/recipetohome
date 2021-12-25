import React, { useContext, useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	FlatList,
	ScrollView,
	Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { Searchbar, Card, ActivityIndicator } from 'react-native-paper';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Category = ({ name }) => {
	return (
		<View style={styles.categoryContainer}>
			<Text>{name}</Text>
		</View>
	);
};

const RecipeScreen = ({ navigation }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const onChangeSearch = (query) => {
		setSearchQuery(query);
	};
	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const name = auth.name;
	const { data, loading, error } = useFetch(
		'https://recipetohome-api.herokuapp.com/api/v1/recipes',
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
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 20,
					marginBottom: 20,
				}}
			>
				<View style={styles.headerContainer}>
					<Text style={styles.header}>Hello {name}</Text>
					<Text>What do you want to cook today?</Text>
				</View>

				<Image
					source={require('../../assets/avatar.png')}
					resizeMode='center'
					style={styles.avatar}
				/>
			</View>
			<Searchbar
				placeholder='Search'
				onChangeText={onChangeSearch}
				value={searchQuery}
				style={{ width: width * 0.9, borderRadius: 10 }}
			/>

			{loading && <ActivityIndicator style={{ marginTop: 25 }} size={30} />}
			{data && (
				<FlatList
					showsVerticalScrollIndicator={false}
					data={
						data &&
						data.recipes.filter((recipe) =>
							recipe.name.toLowerCase().startsWith(searchQuery.toLowerCase())
						)
					}
					renderItem={({ item }) => (
						<RecipeCard
							id={item.id}
							title={item.name}
							url={item.imageUrl}
							servings={item.servings}
							onPress={() =>
								navigation.navigate('SelectedRecipe', {
									recipeId: item.id,
								})
							}
						/>
					)}
					key={(item) => item.id}
				/>
			)}
		</SafeAreaView>
	);
};

export default RecipeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	categoryContainer: {
		flex: 1,
		flexDirection: 'column',
		maxHeight: 50,
		height: 50,
		width: 100,
	},
	header: {
		color: '#5F2EEA',
		fontFamily: 'Poppins_700Bold',
		fontSize: 32,
		letterSpacing: 1,
	},
	headerContainer: {
		flex: 1,
	},
	avatar: {
		width: 75,
		height: 75,
	},
});
