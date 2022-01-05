import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';

const SelectedRecipeScreen = () => {
	const { setCart, cart } = useContext(CartContext);
	const navigation = useNavigation();
	const route = useRoute();
	const { auth } = useContext(AuthContext);
	const token = auth.token;
	const id = auth.id;
	const [ingredientList, setIngredientList] = useState(null);
	// const [error, setError] = useState(false);
	// const [loading, setLoading] = useState(true);
	// const [recipe, setRecipe] = useState(null);
	const [liked, setLiked] = useState(false);
	const { recipeId } = route.params;

	function fetchRecipeById() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/recipes/' + recipeId,
			config
		);
	}

	const { data, isLoading, isError, error } = useQuery(
		['recipes', recipeId],
		fetchRecipeById,
		{
			select: (data) => data.data.recipe,
		}
	);

	const config = {
		headers: { Authorization: `Bearer ${token}` },
		'Content-Type': 'application/json',
	};

	function handleAddToCart() {
		if (
			ingredientList.filter((ingredient) => ingredient.checked).length === 0
		) {
			alert('Please select at least one ingredient');
			return;
		} else {
			// Make a copy of the old cart
			const newCart = [...cart];
			// Find the new total of the cart
			const newTotal = ingredientList
				.filter((ingredient) => ingredient.checked)
				.reduce((acc, ingredient) => {
					return acc + ingredient.price;
				}, 0);
			// Push the item into the cart
			newCart.push({
				id: uuid.v4(),
				recipeId: recipeId,
				ingredients: ingredientList.filter(
					(ingredient) => ingredient.checked === true
				),
				total: newTotal,
			});
			// Set the new cart
			setCart(newCart);
			// Navigate to the cart
			navigation.navigate('Shopping', {
				params: {
					screen: 'Cart',
				},
			});
		}
	}

	function handleLike() {
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
	}

	// Check and uncheck functionality for the ingredients
	function handleChecked(id) {
		// Make a copy of the ingredients
		let ingredients = [...ingredientList];
		// Find the ingredient index in original array
		const ingredientId = ingredients.findIndex((item) => item.id === id);
		// copy the ingredient from the array
		let ingredient = { ...ingredients[ingredientId] };
		// set ingredient checked status to opposite of its current value
		ingredient.checked = !ingredient.checked;
		// Replace the item in the copied array
		ingredients[ingredientId] = ingredient;
		// set the state with the new copy
		setIngredientList(ingredients);
		// console.log(ingredientList);
	}

	function RenderIngredient(item, handleChecked) {
		return (
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
		);
	}

	function renderItem({ item }) {
		return RenderIngredient(item, handleChecked);
	}

	function renderSteps({ item }) {
		return <Text style={{ flex: 1, flexWrap: 'wrap' }}>{item}</Text>;
	}

	function getKeyExtractor() {
		return uuid.v4();
	}

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<StatusBar style='dark' />
			{isLoading && (
				<ActivityIndicator
					size={'large'}
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}
			{isError && <Text style={{ color: red }}>{error.message}</Text>}
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
						<Card.Title title={data.name} />
						<Card.Cover resizeMode='cover' source={{ uri: data.imageUrl }} />
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
						renderItem={renderItem}
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
						data={data.steps}
						keyExtractor={getKeyExtractor}
						renderItem={renderSteps}
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
