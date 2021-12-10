import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import SingleIngredient from '../components/SingleIngredient';
import CustomButton from '../components/CustomButton';
import * as Random from 'expo-random';

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
		'https://heroku-recipe-api.herokuapp.com/api/v1/recipes/' + recipeId,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	);
	console.log(JSON.stringify(data));

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			{loading && (
				<ActivityIndicator
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}
			{data && (
				<View
					style={{
						flex: 1,
						marginBottom: 10,
						justifyContent: 'center',
					}}
				>
					<Card
						style={{
							width: 0.9 * width,
							height: 300,
						}}
					>
						<Card.Title title={data.name} />
						<Card.Cover resizeMode='cover' source={{ uri: data.imageUrl }} />
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
						data={data.ingredients}
						renderItem={({ item }) => <SingleIngredient item={item} />}
						keyExtractor={(item) => item.ingredient.id}
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
						data={data.steps}
						renderItem={({ item }) => (
							<Text style={{ flex: 1, flexWrap: 'wrap' }}>{item}</Text>
						)}
						keyExtractor={(item) => Random.getRandomBytesAsync(64)}
					/>
				</View>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});
export default SelectedRecipeScreen;
