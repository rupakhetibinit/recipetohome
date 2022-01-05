import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
	Dimensions,
	Image,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const width = Dimensions.get('window').width;

const FavoriteScreen = () => {
	const navigation = useNavigation();
	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const id = auth.id;
	const [error, setError] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		fetchData();
		setLoading(false);
	}, []);

	function onRefresh() {
		setRefreshing(true);
		fetchData();
		setRefreshing(false);
	}
	const fetchData = useCallback(() => {
		axios
			.get(`https://recipetohome-api.herokuapp.com/api/v1/user/liked/${id}`, {
				method: 'GET',
				config,
			})
			.then((res) => {
				// console.log(res);
				setData(res.data);
				setLoading(false);
				setRefreshing(false);
				setError(null);
			})
			.catch(() => {
				// console.log(err);
				setError('something went wrong');
			});
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar style='dark' />
			<View style={{ alignItems: 'center' }}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
					}}
				>
					<View>
						<Text
							style={{
								color: '#d02860',
								fontSize: 24,
								fontFamily: 'Poppins_500Medium',
							}}
						>
							Favorite Recipes
						</Text>
					</View>
				</View>

				{loading && (
					<ActivityIndicator
						size={'large'}
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
					/>
				)}

				{/* {data?.recipes?.likedRecipes?.length === 0 && (
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={{ fontSize: 24, fontFamily: 'Poppins_500Medium' }}>
						You have no favorite recipes
					</Text>
				</View>
			)} */}
				{data?.recipes?.likedRecipes?.length === 0 && (
					<ScrollView
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						contentContainerStyle={{ flex: 1, alignItems: 'center' }}
					>
						<View>
							<Text style={{ fontSize: 24, fontFamily: 'Poppins_500Medium' }}>
								You have no favorite recipes
							</Text>
						</View>
					</ScrollView>
				)}

				{data?.recipes?.likedRecipes?.length > 0 && (
					<FlatList
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						extraData={data.recipes}
						data={data.recipes.likedRecipes}
						renderItem={({ item }) => (
							<Pressable
								onPress={() =>
									navigation.navigate('SelectedRecipe', { recipeId: item.id })
								}
							>
								<View style={styles.imageContainer}>
									{data.recipes.likedRecipes.length === 0 && (
										<View style={{ flex: 1, justifyContent: 'center' }}>
											<Text
												style={{
													fontSize: 24,
													fontFamily: 'Poppins_500Medium',
												}}
											>
												You have no favorite recipes
											</Text>
										</View>
									)}

									<Image style={styles.image} source={{ uri: item.imageUrl }} />
									<Text style={styles.text}>{item.name}</Text>
									{/* <View
									style={{
										width: 50,
										height: 50,
										position: 'absolute',
										right: 0,
										bottom: 0,
										margin: 20,
										borderRadius: 50,
										backgroundColor: 'white',
									}}
									>
									<FontAwesome
									style={{ position: 'absolute', top: 13, left: 13 }}
									name='heart'
									size={25}
									color='#5F2EEA'
									/>
								</View> */}
								</View>
							</Pressable>
						)}
						key={(item) => item.id}
					/>
				)}

				{error && (
					<Text
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							color: 'red',
						}}
					>
						{error}
					</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

export default FavoriteScreen;

const styles = StyleSheet.create({
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
