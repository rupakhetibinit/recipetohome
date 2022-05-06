import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRecoilValue } from 'recoil';
import { AuthAtom, config } from '../stores/atoms';

const width = Dimensions.get('window').width;

const FavoriteScreen = () => {
	const { id, token } = useRecoilValue(AuthAtom);
	const navigation = useNavigation();
	const apiConfig = useRecoilValue(config);
	function fetchFavoriteRecipes() {
		return axios.get(
			`https://recipetohome-api.herokuapp.com/api/v1/user/liked/${id}`,
			{
				method: 'GET',
				config: apiConfig,
			}
		);
	}

	const { isLoading, isError, error, data, refetch } = useQuery(
		'fetch-favorite-recipes',
		fetchFavoriteRecipes,
		{
			select: (data) => data.data.recipes.likedRecipes,
		}
	);
	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

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

				{isLoading && (
					<ActivityIndicator size={'small'} style={{ marginTop: 30 }} />
				)}

				{data?.length === 0 ? (
					<ScrollView
						refreshControl={
							<RefreshControl
								refreshing={isRefetchingByUser}
								onRefresh={refetchByUser}
							/>
						}
						contentContainerStyle={{ flex: 1, alignItems: 'center' }}
					>
						<View>
							<Text style={{ fontSize: 24, fontFamily: 'Poppins_500Medium' }}>
								You have no favorite recipes
							</Text>
						</View>
					</ScrollView>
				) : (
					<FlatList
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={isRefetchingByUser}
								onRefresh={refetchByUser}
							/>
						}
						data={data}
						extraData={data}
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
						keyExtractor={(item) => item.id}
					/>
				)}

				{isError && (
					<Text
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
							color: 'red',
							textShadowColor: '#412441',
						}}
					>
						{error.message}
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
