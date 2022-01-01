import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { RefreshControlBase, StyleSheet, Text, View } from 'react-native';
import {
	ActivityIndicator,
	Button,
	Card,
	Checkbox,
	List,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import SingleIngredient from '../components/SingleIngredient';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { StatusBar } from 'expo-status-bar';

const SelectedRecipeScreen = () => {
	const { setCart, cart, total, setTotal } = useContext(CartContext);
	const navigation = useNavigation();
	const route = useRoute();
	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const id = auth.id;
	const [ingredientList, setIngredientList] = useState(null);
	const [expanded, setExpanded] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [recipe, setRecipe] = useState(null);
	const [liked, setLiked] = useState(false);
	const { recipeId } = route.params;
	useEffect(() => {
		axios
			.get(
				`https://recipetohome-api.herokuapp.com/api/v1/recipes/${recipeId}`,
				config
			)
			.then((res) => {
				setLoading(true);
				setRecipe(res.data.recipe);
				setLoading(false);
				setError(false);
				res.data.recipe.likedBy.some((user) => user.id === id) &&
					setLiked(true);
				setIngredientList(
					res.data.recipe.ingredients.map((ingredient) => ({
						...ingredient,
						checked: false,
					}))
				);
				// console.log(ingredientList);
			})
			.catch((err) => {
				setError('something went wrong');
			});
	}, []);
	// useEffect(() => {
	// 	console.log(total);
	// 	console.log(cart);
	// }, [cart, total]);

	const config = {
		headers: { Authorization: `Bearer ${token}` },
		'Content-Type': 'application/json',
	};

	const handleAddToCart = () => {
		if (
			ingredientList.filter((ingredient) => ingredient.checked).length === 0
		) {
			alert('Please select at least one ingredient');
			return;
		} else {
			const newCart = [...cart];

			const newTotal = ingredientList
				.filter((ingredient) => ingredient.checked)
				.reduce((acc, ingredient) => {
					return acc + ingredient.price;
				}, 0);

			newCart.push({
				id: uuid.v4(),
				recipeId: recipeId,
				ingredients: ingredientList.filter(
					(ingredient) => ingredient.checked === true
				),
				total: newTotal,
			});
			setCart(newCart);
			navigation.navigate('Shopping', {
				params: {
					screen: 'Cart',
				},
			});
		}
	};

	const handleLike = () => {
		if (liked === false) {
			axios
				.post(
					`https://recipetohome-api.herokuapp.com/api/v1/recipes/` +
						recipeId +
						'/like',
					{
						userId: parseInt(id),
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)
				.then((res) => {
					// console.log(JSON.stringify(res));
					if (res.data.like !== undefined) {
						setLiked(true);
					}
				})
				.catch((err) => console.log(err));
		} else if (liked === true) {
			axios
				.patch(
					'https://recipetohome-api.herokuapp.com/api/v1/recipes/' +
						recipeId +
						'/like',
					{ userId: parseInt(id) },
					config
				)
				.then((res) => {
					// console.log(JSON.stringify('delete request', res));
					res.data.dislike !== undefined && setLiked(false);
					// console.log(res);
				})
				.catch((err) => console.log(err));
		}
	};

	// Checks and uncheck functionality for the ingredients
	const handleChecked = (id) => {
		// Make a shallow copy of the items
		let items = [...ingredientList];
		// Find the item index in original array
		const ingredientId = items.findIndex((item) => item.id === id);
		// set item checked status to opposite of its current value
		let item = { ...items[ingredientId] };
		item.checked = !item.checked;
		// Replace the item in the copied array
		items[ingredientId] = item;
		// set the state with the new copy
		setIngredientList(items);
		// console.log(ingredientList);
	};

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<StatusBar style='dark' />
			{loading && (
				<ActivityIndicator
					size={'large'}
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}
			{error === null && (
				<Text
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				>
					Error
				</Text>
			)}
			{recipe && (
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
						<Card.Title title={recipe.name} />
						<Card.Cover resizeMode='cover' source={{ uri: recipe.imageUrl }} />
						<Card.Actions
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Button onPress={handleLike}>
								<FontAwesome name={liked ? 'heart' : 'heart-o'} size={25} />
							</Button>
							<Button onPress={handleAddToCart}>Add to Cart</Button>
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
						data={ingredientList}
						renderItem={({ item }) => (
							<View style={styles.container}>
								<Checkbox
									status={item.checked ? 'checked' : 'unchecked'}
									onPress={() => handleChecked(item.id)}
									color='#5F2EEA'
								/>
								<Text style={{ flex: 1, flexWrap: 'wrap' }}>
									{item.amount} {item.measurement} {item.name}
								</Text>
							</View>
						)}
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
						data={recipe.steps}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
export default SelectedRecipeScreen;
