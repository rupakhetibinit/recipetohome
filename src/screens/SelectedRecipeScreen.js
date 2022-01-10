import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { AuthAtom } from '../stores/atoms';
import { useSnapshot, proxy } from 'valtio';
import state from '../stores/valtioStore';
const width = Dimensions.get('window').width;

const ingredientList = proxy({
	state: [],
});
const SelectedRecipeScreen = () => {
	const [checkedIngredients, setCheckedIngredients] = useState([]);
	const route = useRoute();
	const { recipeId } = route.params;
	useEffect(() => {
		return () => {
			ingredientList.state = [];
		};
	}, [recipeId]);
	const navigation = useNavigation();
	// const [ingredients, setIngredients] = useState([]);
	const ingredientSnap = useSnapshot(ingredientList);
	// const [cart, setCart] = useRecoilState(Cart);
	// const setCart = useSetRecoilState(Cart);
	const snap = useSnapshot(state);
	const { token, id } = useRecoilValue(AuthAtom);

	const [liked, setLiked] = useState(false);

	function fetchRecipeById() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/recipes/' + recipeId,
			config
		);
	}

	const { data, isLoading, isError, error, isSuccess } = useQuery(
		['recipes', recipeId],
		fetchRecipeById,
		{
			select: (data) => {
				return data.data.recipe;
			},
			onSuccess: (data) => {
				setLiked(data.likedBy.filter((user) => user.id === id).length > 0);
			},
		}
	);

	const config = {
		headers: { Authorization: `Bearer ${token}` },
		'Content-Type': 'application/json',
	};

	function handleAddToCart() {
		if (checkedIngredients.length === 0) {
			alert('Please select at least one ingredient');
			return;
		} else {
			const newTotal = checkedIngredients.reduce((acc, ingredient) => {
				return acc + ingredient.price;
			}, 0);
			const newCart = {
				id: uuid.v4(),
				recipeId: recipeId,
				ingredients: checkedIngredients,
				total: newTotal,
			};
			if (newCart.total === 0) {
				alert('Please select at least one ingredient');
				return;
			} else {
				// Set the new cart
				state.cartState.push(newCart);
				// Navigate to the cart
				navigation.navigate('Shopping', {
					params: {
						screen: 'Cart',
					},
				});
			}
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
	function handleChecked(item, setCheckedIngredients) {
		const index = checkedIngredients.indexOf(item);
		if (index === -1) {
			setCheckedIngredients([...checkedIngredients, item]);
		} else {
			const newChecked = checkedIngredients.filter(
				(ingredient) => ingredient !== item
			);
			setCheckedIngredients([...newChecked]);
		}
	}

	function RenderIngredient(item, handleChecked) {
		return (
			<View style={styles.container}>
				<Checkbox
					status={
						checkedIngredients.indexOf(item) !== -1 ? 'checked' : 'unchecked'
					}
					onPress={() => handleChecked(item, setCheckedIngredients)}
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
			{isLoading && <ActivityIndicator size={'large'} />}
			{isError && <Text style={{ color: 'red' }}>{error.message}</Text>}
			{isSuccess && (
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
						data={data.ingredients}
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
