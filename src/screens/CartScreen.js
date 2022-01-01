import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Checkbox, List, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
const CartScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { auth, setAuth } = useContext(AuthContext);
	const { cart, setCart, total, setTotal } = useContext(CartContext);
	const [reload, setReload] = React.useState(false);
	const [orderedItems, setOrderedItems] = React.useState(null);
	const config = {
		headers: {
			Authorization: `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
	};

	// useEffect(() => {
	// 	axios
	// 		.get(
	// 			'http://recipetohome-api.herokuapp.com/api/v1/orders/' + auth.id,
	// 			config
	// 		)
	// 		.then((res) => {
	// 			console.log(res);
	// 			console.log('this is the axios get request');
	// 			setOrderedItems(res.data.orders);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }, [reload]);

	const handleOrder = (order) => {
		const givenOrder = order;
		console.log(givenOrder);
		const ingredients = givenOrder.ingredients.map((item) => {
			return {
				id: item.id,
			};
		});
		axios
			.post(
				'https://recipetohome-api.herokuapp.com/api/v1/order',
				{
					userId: auth.id,
					total: total,
					recipeId: order.recipeId,
					id: order.id,
					ingredients: ingredients,
				},
				config
			)
			.then((res) => {
				console.log(res);
				console.log(res.data);
				if (res.data.order) {
					const newCart = cart.filter((item) => item.id !== givenOrder.id);
					const newTotal = total - givenOrder.total;
					setTotal(newTotal);
					setCart(newCart);
					console.log(JSON.stringify(ingredients));
					navigation.navigate('OrderConfirmation', {
						order: res.data.order,
					});
				} else {
					return;
				}
			})
			.catch((err) => {
				console.log(err);
			});
		setReload(!reload);
	};

	const handleDelete = (orderId, ingredientId) => {
		let newCart = cart.filter((order) => order.id !== orderId);
		const deletedOrder = cart.find((order) => order.id === orderId);
		const orderTotal = deletedOrder.total;
		const remainingIngredient = cart
			.find((order) => order.id === orderId)
			.ingredients.filter((ingredient) => ingredient.id !== ingredientId);
		console.log(remainingIngredient);
		// console.log(newCart);
		const newTotal =
			orderTotal -
			cart
				.find((order) => order.id === orderId)
				.ingredients.filter((ingredient) => ingredient.id === ingredientId)
				.reduce((acc, curr) => acc + curr.price, 0);
		newCart.push({
			id: deletedOrder.id,
			ingredients: [...remainingIngredient],
			total: newTotal,
			recipeId: deletedOrder.recipeId,
		});
		let grandTotal;
		newCart = newCart.filter((order) => order.total !== 0);
		if (newCart.length === 0) {
			grandTotal = 0;
		} else {
			grandTotal = total - orderTotal + newTotal;
		}
		setTotal(grandTotal);
		setCart(newCart);
		console.log(newCart);
		console.log(grandTotal);
	};

	return (
		<SafeAreaView style={styles.container}>
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
						Cart Recipes
					</Text>
				</View>
			</View>
			{cart.length === 0 ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Text
						style={{
							fontSize: 24,
							fontFamily: 'Poppins_500Medium',
							color: 'black',
						}}
					>
						Cart is empty
					</Text>
				</View>
			) : (
				<FlatList
					style={{
						height: '100%',
						width: '100%',
					}}
					showsVerticalScrollIndicator={false}
					data={cart.filter((order) => order.ingredients.length > 0)}
					renderItem={({ item }) => {
						let parentData = item;
						return (
							<List.Accordion
								title={`Order ${item.id.split('-')[0].toUpperCase()}`}
								titleNumberOfLines={1}
								titleStyle={{
									color: '#694fad',
								}}
								style={{
									width: '100%',
									paddingBottom: 20,
								}}
							>
								<FlatList
									showsVerticalScrollIndicator={false}
									key={item.ingredients.id}
									data={item.ingredients.filter(
										(ingredient) => ingredient.checked === true
									)}
									renderItem={({ item }) => (
										<View
											style={{
												flex: 1,
												flexDirection: 'row',
												alignItems: 'center',
												marginLeft: 30,
											}}
										>
											<Checkbox
												status={item.checked ? 'checked' : 'unchecked'}
												onPress={() => {
													handleDelete(parentData.id, item.id);
												}}
												color='#694fad'
											/>
											<Text style={{ fontSize: 14 }}>
												{item.amount} {item.measurement} {item.name} Rs.
												{item.price}
											</Text>
										</View>
									)}
								/>
								<View
									style={{
										flex: 1,

										justifyContent: 'center',
									}}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
											marginHorizontal: 30,
										}}
									>
										<Button
											mode='contained'
											style={{
												fontSize: 14,
												fontFamily: 'Poppins_700Bold',
												color: '#694fad',
											}}
											onPress={() => handleOrder(parentData)}
										>
											<Text>Order now </Text>
										</Button>
										<Text>Total Rs.{parentData.total}</Text>
									</View>
								</View>
							</List.Accordion>
						);
					}}
				/>
			)}
		</SafeAreaView>
	);
};

export default CartScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
});
