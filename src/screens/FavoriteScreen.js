import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../components/RecipeCard';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const FavoriteScreen = () => {
	const navigation = useNavigation();
	const { auth, setAuth } = useContext(AuthContext);
	const token = auth.token;
	const id = auth.id;
	const [error, setError] = useState(null);
	const [reload, setReload] = useState(false);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};
	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`https://recipetohome-api.herokuapp.com/api/v1/user/liked/${id}`,
				config
			)
			.then((res) => {
				setData(res.data);
				setLoading(false);
				setError(null);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setError('something went wrong');
			});
	}, [reload]);

	return (
		<SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
			<StatusBar style='dark' />
			<View
				style={{
					flexDirection: 'row',
				}}
			>
				<View>
					<Text
						style={{
							color: '#5F2EEA',
							fontSize: 24,
							fontFamily: 'Poppins_500Medium',
						}}
					>
						Favorite Recipes
					</Text>
				</View>
				<View>
					<Button onPress={() => setReload(!reload)}>
						<FontAwesome name='refresh' size={24} color='black' />
					</Button>
				</View>
			</View>

			{loading && (
				<ActivityIndicator
					size={'large'}
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}

			{data?.recipes?.likedRecipes?.length === 0 && (
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={{ fontSize: 24, fontFamily: 'Poppins_500Medium' }}>
						You have no favorite recipes
					</Text>
				</View>
			)}
			{data?.recipes?.likedRecipes && (
				<FlatList
					showsVerticalScrollIndicator={false}
					data={data.recipes.likedRecipes}
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
		</SafeAreaView>
	);
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
