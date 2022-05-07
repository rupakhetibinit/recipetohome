import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import {
	Dimensions,
	Image,
	Pressable,
	SectionList,
	StyleSheet,
	Text,
	View,
	TextInput,
} from 'react-native';
import { ActivityIndicator, Button, Checkbox } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useQuery, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { AuthAtom, config } from '../stores/atoms';
import { proxy } from 'valtio';
import state from '../stores/valtioStore';
import LottieView from 'lottie-react-native';

const width = Dimensions.get('window').width;

const ingredientList = proxy({
	state: [],
});
const SelectedRecipeScreen = () => {
	const queryClient = useQueryClient();
	const [yourReview, setYourReview] = useState(null);
	const [yourReviewText, setYourReviewText] = useState('');
	const [yourRating, setYourRating] = useState(0);
	const [checkedIngredients, setCheckedIngredients] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const route = useRoute();
	const [review, setReview] = useState('');
	const [rating, setRating] = useState(0);
	const [isReviewed, setIsReviewed] = useState(false);
	const apiConfig = useRecoilValue(config);
	const { recipeId } = route.params;
	useEffect(() => {
		return () => {
			ingredientList.state = [];
		};
	}, [recipeId]);

	useEffect(() => {
		console.log(checkedIngredients);
	}, [checkedIngredients]);
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

	const { id } = useRecoilValue(AuthAtom);

	function fetchRecipeById() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/recipes/' + recipeId,
			apiConfig
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
				setIsReviewed(
					data?.reviews.filter((review) => review.userId === id).length > 0
				);
				setYourReview(data.reviews.filter((review) => review.userId === id)[0]);
				setYourReviewText(
					data?.reviews.filter((review) => review.userId === id)[0]?.review
				);
				setYourRating(
					data?.reviews.filter((review) => review.userId === id)[0]?.rating
				);
			},
		}
	);

	function handleAddToCart() {
		if (checkedIngredients.length === 0) {
			alert('Please select at least one ingredient');
			return;
		} else {
			// Object.keys(checkedIngredients).forEach((ingredient,index)=>{
			// 	checkedIngredients[] = ingredient[index]
			// })
			checkedIngredients.forEach(
				(ingredient) =>
					(ingredient.grandTotal = ingredient.quantity * ingredient.price)
			);
			console.log(checkedIngredients);

			const newTotal = checkedIngredients.reduce((acc, ingredient) => {
				return acc + ingredient.grandTotal;
			}, 0);
			console.log(newTotal);
			// checkedIngredients.map(element=>element.)
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

	async function handleLike() {
		try {
			if (liked === false) {
				const res = await axios.post(
					`https://recipetohome-api.herokuapp.com/api/v1/recipes/` +
						recipeId +
						'/like',
					{
						userId: parseInt(id),
					},
					apiConfig
				);
				res.data.like !== undefined && setLiked(true);
			} else if (liked === true) {
				const res = await axios.patch(
					'https://recipetohome-api.herokuapp.com/api/v1/recipes/' +
						recipeId +
						'/like',
					{ userId: parseInt(id) },
					apiConfig
				);
				res.data.dislike !== undefined && setLiked(false);
			}
		} catch (error) {
			console.log(error);
		} finally {
			queryClient.invalidateQueries('fetch-favorite-recipes');
		}
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

	function renderOrderableIngredients({ item }) {
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
					{!!item.amount && `${item.amount}` + ' '}
					{!!item.measurement && `${item.measurement}` + ' '}
					{item.name}
				</Text>
			</View>
		);
	}

	function renderSteps({ item, index }) {
		return (
			<View style={styles.stepsWrapper}>
				<Text style={styles.stepsText}>STEP {index + 1}</Text>
				<Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14 }}>
					{item}
				</Text>
			</View>
		);
	}

	function renderReviews({ item }) {
		return (
			<View style={styles.reviewWrapper}>
				<StarRatingDisplay rating={item.rating} />
				<View style={styles.stepsWrapper}>
					<Text style={styles.stepsText}>{item.review}</Text>
					<Text>Reviewed by {item.user.name}</Text>
				</View>
			</View>
		);
	}

	async function handleReviewSubmit() {
		try {
			const res = await axios.post(
				`https://recipetohome-api.herokuapp.com/api/v1/reviews`,
				{
					userId: parseInt(id),
					recipeId: recipeId,
					review: review,
					rating: rating,
				},
				apiConfig
			);
			res.data.success === true && setIsReviewed(true);
		} catch (error) {
		} finally {
			queryClient.invalidateQueries('recipes');
		}
	}

	async function handleReviewUpdate() {
		try {
			const res = await axios.patch(
				`https://recipetohome-api.herokuapp.com/api/v1/reviews/` +
					yourReview.id,
				{
					review: yourReviewText,
					rating: yourRating,
				},
				apiConfig
			);
			console.log(res.data);
			res.data.success === true && setIsReviewed(true);
			res.data.success === true && setIsEditing(false);
		} catch (error) {
		} finally {
			queryClient.invalidateQueries('recipes');
		}
	}

	async function handleReviewDelete() {
		try {
			const res = await axios.delete(
				`https://recipetohome-api.herokuapp.com/api/v1/reviews/` +
					yourReview.id,
				apiConfig
			);
			console.log(res.data);
			res.data.success === true && setIsReviewed(false);
			res.data.success === true && setIsEditing(false);
		} catch (error) {
		} finally {
			queryClient.invalidateQueries('recipes');
		}
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
						<Image
							resizeMode='cover'
							source={{ uri: data.imageUrl }}
							style={{ width: width, height: 200 }}
							resizeMethod='auto'
						/>
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
					<SectionList
						initialNumToRender={20}
						contentContainerStyle={styles.marginWrapper}
						sections={[
							{
								title: 'Required Ingredients',
								data: data.ingredients,
								renderItem: ({ item }) => (
									<Text style={{ marginLeft: 10 }}>{item.required}</Text>
								),
								keyExtractor: (item) => item.id,
							},
							{
								title: 'Orderable Ingredients',
								data: data.ingredients,
								renderItem: renderOrderableIngredients,
								keyExtractor: (item) => item.id,
							},
							{
								title: 'Steps',
								data: data.steps,
								renderItem: renderSteps,
								keyExtractor: (_, index) => index,
							},
							{
								title: 'Reviews',
								data: data.reviews,
								renderItem: renderReviews,
								keyExtractor: (item) => item.id,
							},
						]}
						renderSectionHeader={({ section }) => {
							return (
								<View style={{ backgroundColor: '#f2f2f2' }}>
									<Text style={styles.universalText}>{section.title}</Text>
								</View>
							);
						}}
						showsVerticalScrollIndicator={false}
						stickySectionHeadersEnabled={true}
					/>
					{isReviewed && (
						<View style={styles.reviewWrapper}>
							{isEditing && (
								<View>
									<StarRating
										rating={yourRating}
										onChange={setYourRating}
										enableHalfStar={false}
									/>
									<TextInput
										style={{
											height: 40,
											margin: 12,
											borderWidth: 1,
											padding: 10,
										}}
										value={yourReviewText}
										onChangeText={(value) => setYourReviewText(value)}
										numberOfLines={2}
									/>
									<Button mode='contained' onPress={handleReviewUpdate}>
										Update Review
									</Button>
								</View>
							)}
							{!isEditing && (
								<View>
									<StarRatingDisplay rating={yourReview?.rating} />
									<Text>Your Review</Text>
									<TextInput
										value={yourReview?.review}
										editable={false}
										style={{
											height: 40,
											margin: 12,
											borderWidth: 1,
											padding: 10,
										}}
									/>
									<View
										style={{
											flexDirection: 'row',
											paddingLeft: 60,
										}}
									>
										<Button onPress={() => setIsEditing(true)} mode='contained'>
											Edit
										</Button>
										<Button onPress={handleReviewDelete}>Delete</Button>
									</View>
								</View>
							)}
						</View>
					)}
					{!isReviewed && (
						<View>
							<Text style={styles.universalText}>Add Your Review</Text>
							<StarRating
								rating={rating}
								onChange={setRating}
								enableHalfStar={false}
							/>
							<TextInput
								style={{ height: 40, margin: 12, borderWidth: 1, padding: 10 }}
								value={review}
								onChangeText={(value) => setReview(value)}
								numberOfLines={2}
							/>
							<Button mode='contained' onPress={handleReviewSubmit}>
								Submit Review
							</Button>
						</View>
					)}
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
		fontFamily: 'Poppins_600SemiBold',
		textTransform: 'uppercase',
		marginLeft: 4,
	},
	ingredientList: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	marginWrapper: {
		marginRight: 5,
		marginLeft: 5,
	},
	stepsWrapper: {
		height: 'auto',
		backgroundColor: '#d7d8da',
		padding: 10,
		borderRadius: 6,
		marginBottom: 5,
	},
	stepsText: {
		fontFamily: 'Poppins_500Medium',
	},
	reviewWrapper: {
		height: 'auto',
		padding: 10,
		borderRadius: 5,
		marginBottom: 5,
	},
});

export default SelectedRecipeScreen;
