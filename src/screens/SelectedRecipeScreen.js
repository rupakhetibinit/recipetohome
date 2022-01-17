import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { AuthAtom } from '../stores/atoms';
import { useSnapshot, proxy } from 'valtio';
import state from '../stores/valtioStore';
import LottieView from 'lottie-react-native';
import { SharedElement } from 'react-navigation-shared-element';
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
	const animation = React.useRef(null);
	const isFirstRun = React.useRef(true);
	const [liked, setLiked] = useState(false);
	React.useEffect(() => {
		if (isFirstRun.current) {
			if (liked) {
				animation.current?.play(66, 66);
			} else {
				animation.current?.play(20, 20);
			}
			isFirstRun.current = false;
		} else if (liked === true) {
			animation.current?.play(20, 50);
		} else {
			animation.current?.play(0, 20);
		}
	}, [liked]);

	const { token, id } = useRecoilValue(AuthAtom);

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
			onSettled: (data) => {
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
			<View style={styles.ingredientList}>
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
				<View style={[styles.container, { marginTop: 0 }]}>
					<View style={styles.imageWrapper}>
						<SharedElement id={data.id}>
							<FastImage
								resizeMode={FastImage.resizeMode.cover}
								source={{ uri: data.imageUrl }}
								style={{ width: width, height: 200 }}
								resizeMethod='auto'
							/>
						</SharedElement>
						<Text style={styles.imageText}>{data.name}</Text>
						<View style={styles.likeAndCartWrapper}>
							<Pressable onPress={handleLike}>
								<LottieView
									ref={animation}
									style={{ width: 60, height: 60 }}
									source={require('../../assets/like-animation.json')}
									autoPlay={false}
									loop={false}
									speed={2}
								/>
							</Pressable>
							<TouchableOpacity onPress={handleAddToCart}>
								<Text
									style={[
										styles.universalText,
										{ textTransform: 'uppercase', marginRight: 10 },
									]}
								>
									Add to Cart
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					{/* </Card> */}

					<FlatList
						contentContainerStyle={styles.marginWrapper}
						data={data.ingredients}
						renderItem={renderItem}
						keyExtractor={() => uuid.v4()}
						ListHeaderComponent={() => {
							return <Text style={styles.universalText}>Ingredients</Text>;
						}}
						showsVerticalScrollIndicator={false}
					/>
					<FlatList
						contentContainerStyle={styles.marginWrapper}
						ListHeaderComponent={() => {
							return <Text style={styles.universalText}>Steps</Text>;
						}}
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
		marginTop: 20,
		marginHorizontal: 0.1 * width,
	},
	imageWrapper: {
		flexDirection: 'column',
	},
	imageText: {
		position: 'absolute',
		bottom: 75,
		left: 0,
		paddingLeft: 10,
		fontFamily: 'Poppins_500Medium',
		fontSize: 15,
		color: 'white',
		textShadowOffset: {
			width: 5,
			height: 5,
		},
		textShadowColor: 'black',
	},
	likeAndCartWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	universalText: {
		color: '#5F2EEA',
		fontSize: 18,
		fontFamily: 'Poppins_500Medium',
	},
	ingredientList: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	marginWrapper: {
		marginHorizontal: 10,
	},
});

SelectedRecipeScreen.sharedElements = (navigation) => {
	const data = navigation.params;
	return [data.recipeId];
};

export default SelectedRecipeScreen;
