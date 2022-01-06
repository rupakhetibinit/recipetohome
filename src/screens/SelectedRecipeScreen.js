import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthAtom, Cart, ingredientListFamily } from '../stores/atoms';

const SelectedRecipeScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { recipeId } = route.params;
	const [ingredients, setIngredients] = useRecoilState(
		ingredientListFamily(recipeId)
	);
	// const [cart, setCart] = useRecoilState(Cart);
	const setCart = useSetRecoilState(Cart);
	const { token, id } = useRecoilValue(AuthAtom);

	const [liked, setLiked] = useState(false);

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
			select: (data) => {
				return data.data.recipe;
			},
			onSuccess: (data) => {
				const list = data.ingredients.map((ingredient) => {
					return { ...ingredient, checked: false };
				});
				// console.log(list);
				data.likedBy.filter((user) => user.id === id).length > 0
					? setLiked(true)
					: setLiked(false);
				setIngredients((prevState) => [...list]);
				console.log(ingredients);
			},
		}
	);

	const config = {
		headers: { Authorization: `Bearer ${token}` },
		'Content-Type': 'application/json',
	};

	function handleAddToCart() {
		if (ingredients.filter((ingredient) => ingredient.checked).length === 0) {
			alert('Please select at least one ingredient');
			return;
		} else {
			const newTotal = ingredients
				.filter((ingredient) => ingredient.checked)
				.reduce((acc, ingredient) => {
					return acc + ingredient.price;
				}, 0);
			const newCart = {
				id: uuid.v4(),
				recipeId: recipeId,
				ingredients: ingredients.filter(
					(ingredient) => ingredient.checked === true
				),
				total: newTotal,
			};
			// Set the new cart
			setCart((prev) => [...prev, newCart]);
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
	function replaceItemAtIndex(arr, index, newValue) {
		return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
	}

	// Check and uncheck functionality for the ingredients
	function handleChecked(item) {
		const newIngredients = replaceItemAtIndex(
			ingredients,
			ingredients.indexOf(item),
			{ ...item, checked: !item.checked }
		);
		setIngredients(newIngredients);
	}

	function RenderIngredient(item, handleChecked) {
		return (
			<View style={styles.container}>
				<Checkbox
					status={item.checked ? 'checked' : 'unchecked'}
					onPress={() => handleChecked(item)}
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
			{isLoading ||
				(ingredients.length === 0 && (
					<ActivityIndicator
						size={'large'}
						style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
					/>
				))}
			{isError && <Text style={{ color: 'red' }}>{error.message}</Text>}
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
						data={ingredients}
						renderItem={renderItem}
						keyExtractor={() => uuid.v4()}
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
