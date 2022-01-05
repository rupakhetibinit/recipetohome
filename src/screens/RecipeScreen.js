import React, { useContext, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	FlatList,
	Dimensions,
	RefreshControl,
	Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import {
	Searchbar,
	ActivityIndicator,
	Avatar,
	Caption,
	Headline,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { useQuery } from 'react-query';
const width = Dimensions.get('window').width;
import { useRefreshByUser } from '../hooks/useRefreshByUser';
const RecipeScreen = ({ navigation }) => {
	const [searchQuery, setSearchQuery] = useState('');

	function onChangeSearch(query) {
		setSearchQuery(query);
	}

	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const name = auth.name;
	const initials = name
		.match(/(^\S\S?|\b\S)?/g)
		.join('')
		.match(/(^\S|\S$)?/g)
		.join('')
		.toUpperCase();

	const { data, isLoading, isError, error, refetch } = useQuery(
		'recipes',
		fetchRecipes,
		{ select: (data) => data.data.recipes }
	);
	{
		data && console.log(data);
	}
	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	function fetchRecipes() {
		return axios.get('https://recipetohome-api.herokuapp.com/api/v1/recipes', {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
	}

	function RecipeComponent(item) {
		return (
			<Pressable
				onPress={() => navigation.push('SelectedRecipe', { recipeId: item.id })}
			>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{ uri: item.imageUrl }} />
					<Text style={styles.text}>{item.name}</Text>
				</View>
			</Pressable>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 20,
					marginVertical: 10,
				}}
			>
				<View style={styles.headerContainer}>
					<Headline style={styles.header}>Hello {auth.name}</Headline>
					<Caption style={{ fontSize: 16 }}>
						What do you want to cook today?
					</Caption>
				</View>

				<Avatar.Text
					label={initials}
					size={60}
					style={{ marginLeft: 'auto' }}
				/>
			</View>
			<Searchbar
				placeholder='Search'
				onChangeText={onChangeSearch}
				value={searchQuery}
				style={{ width: width * 0.9, borderRadius: 10 }}
			/>

			{isLoading && <ActivityIndicator style={{ marginTop: 25 }} size={30} />}
			{isError && (
				<Text style={{ marginTop: 25, color: 'red' }}>
					Something went wrong. Please try again later
				</Text>
			)}
			{data && (
				<FlatList
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={isRefetchingByUser}
							onRefresh={refetchByUser}
						/>
					}
					data={data.filter((recipe) =>
						recipe.name.toLowerCase().startsWith(searchQuery.toLowerCase())
					)}
					extraData={data}
					renderItem={({ item }) => RecipeComponent(item)}
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
		fontSize: 28,
		letterSpacing: 1,
	},
	headerContainer: {
		flex: 1,
	},
	avatar: {
		width: 75,
		height: 75,
	},
	imageContainer: {
		alignContent: 'center',
		width: 0.9 * width,
		height: 300,
		marginTop: 10,
		marginVertical: 10,
		overflow: 'hidden',
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	text: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		margin: 20,
		fontFamily: 'Poppins_600SemiBold',
		fontSize: 18,
		color: 'white',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 1,
		textShadowColor: 'rgba(0, 0, 0, 0.75)',
	},
});
