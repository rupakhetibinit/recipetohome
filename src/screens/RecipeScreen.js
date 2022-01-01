import React, { useContext, useEffect, useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	FlatList,
	ScrollView,
	Dimensions,
	RefreshControl,
	Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import {
	Searchbar,
	Card,
	ActivityIndicator,
	Avatar,
	Caption,
	Title,
	Headline,
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const RecipeScreen = ({ navigation }) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
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

	useEffect(() => {
		fetchData();
		setLoading(false);
	}, []);
	const onRefresh = () => {
		setRefreshing(true);
		fetchData();
	};
	const fetchData = async () => {
		await axios
			.get('https://recipetohome-api.herokuapp.com/api/v1/recipes', {
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				console.log(res);
				setData(res.data);
				setLoading(false);
				setRefreshing(false);
			})
			.catch((err) => console.log(err));
	};

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

			{loading && <ActivityIndicator style={{ marginTop: 25 }} size={30} />}
			{data && (
				<FlatList
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					extraData={
						data &&
						data.recipes.filter((recipe) => {
							recipe.name.toLowerCase().startsWith(searchQuery.toLowerCase());
						})
					}
					data={
						data &&
						data.recipes.filter((recipe) =>
							recipe.name.toLowerCase().startsWith(searchQuery.toLowerCase())
						)
					}
					renderItem={({ item }) => (
						<Pressable
							onPress={() =>
								navigation.navigate('SelectedRecipe', { recipeId: item.id })
							}
						>
							<View style={styles.imageContainer}>
								<Image style={styles.image} source={{ uri: item.imageUrl }} />
								<Text style={styles.text}>{item.name}</Text>
							</View>
						</Pressable>
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
