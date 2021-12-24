import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import SingleIngredient from '../components/SingleIngredient';
import uuid from 'react-native-uuid';

const SelectedRecipeScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const [expanded, setExpanded] = useState(false);
	const handleExpand = () => {
		setExpanded(!expanded);
	};
	const { recipeId } = route.params;
	const { data, loading, error } = useFetch(
		'https://recipetohome-api.herokuapp.com/api/v1/recipes/' + recipeId,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	);
	let ingredientList = null;

	if (data) {
		ingredientList = data.recipe.ingredients.map(function (ingredient) {
			return { ...ingredient, checked: false };
		});
	}

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			{loading && (
				<ActivityIndicator
					size={'large'}
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}
			{error && (
				<Text
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				>
					Error
				</Text>
			)}
			{data && (
				<View
					style={{
						flex: 1,
						marginTop: 20,
						marginHorizontal: 0.1 * width,
						justifyContent: 'center',
					}}
				>
					<Card
						style={{
							width: 0.9 * width,
							height: 300,
							marginBottom: 20,
						}}
					>
						<Card.Title title={data.recipe.name} />
						<Card.Cover
							resizeMode='cover'
							source={{ uri: data.recipe.imageUrl }}
						/>
						<Card.Actions
							style={{ flexDirection: 'row', justifyContent: 'space-between' }}
						>
							<Button>
								<FontAwesome name='heart' size={25} />
							</Button>
							<Button onPress={() => navigation.navigate('Cart')}>
								Add to Cart
							</Button>
						</Card.Actions>
					</Card>

					<Text
						style={{
							color: '#5F2EEA',
							fontSize: 24,
							fontFamily: 'Poppins_500Medium',
						}}
					>
						Ingredients
					</Text>

					<FlatList
						data={data.recipe.ingredients}
						renderItem={({ item }) => <SingleIngredient item={item} />}
						keyExtractor={(item) => item.id}
						style={{
							height: '100%',
						}}
					/>

					<Text
						style={{
							color: '#5F2EEA',
							fontSize: 24,
							fontFamily: 'Poppins_500Medium',
						}}
					>
						Steps
					</Text>
					<FlatList
						style={{ height: '90%' }}
						data={data.recipe.steps}
						keyExtractor={() => uuid.v4()}
						renderItem={({ item }) => (
							<Text style={{ flex: 1, flexWrap: 'wrap' }}>{item}</Text>
						)}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});
export default SelectedRecipeScreen;
