import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Button, Checkbox, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';
import { CartContext } from '../context/CartContext';
import { AuthAtom } from '../stores/atoms';
const CartScreen = () => {
	const navigation = useNavigation();
	const { wallet, token } = useRecoilValue(AuthAtom);
	const { cart, setCart, total } = useContext(CartContext);
	const [reload, setReload] = React.useState(false);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	function handleOrder(order) {
		if (wallet < order.total) {
			alert('You do not have enough money in your wallet to make this order');
			return;
		} else {
			const givenOrder = order;
			// console.log(givenOrder);
			const ingredients = givenOrder.ingredients.map((item) => {
				return {
					id: item.id,
				};
			});
			// console.log(ingredients);
			axios
				.post(
					'https://recipetohome-api.herokuapp.com/api/v1/order',
					{
						userId: auth.id,
						total: order.total,
						recipeId: order.recipeId,
						id: order.id,
						ingredients: ingredients,
					},
					config
				)
				.then((res) => {
					// console.log(res);
					// console.log(res.data);
					if (res.data.success === true) {
						const newCart = cart.filter((item) => item.id !== givenOrder.id);
						// const newTotal = total - givenOrder.total;
						// setTotal(newTotal);
						setCart(newCart);
						// console.log(JSON.stringify(ingredients));
						// console.log(res.data.order);
						navigation.navigate('OrderConfirmation', {
							order: res.data.transaction[1],
						});
					} else if (res.data.message === 'Insufficient wallet balance') {
						alert(
							'You do not have enough money in your wallet to make this order'
						);
					}
				})
				.catch(() => {
					// console.log(err);
				});
			setReload(!reload);
		}
	}

	function handleUnchecked(orderId, ingredientId) {
		// Make a copy of the cart
		const newCart = [...cart];
		// Find the index of item to remove
		const index = newCart.findIndex((item) => item.id === orderId);
		// Remove the ingredient that was unchecked
		let ingredients = newCart[index].ingredients.filter(
			(item) => item.id !== ingredientId
		);
		// Calculate the reduced total
		let newTotal =
			newCart[index].total -
			newCart[index].ingredients.find((item) => item.id === ingredientId).price;
		// Remove the item from the array if it is the last ingredient
		ingredients.length === 0 && newCart.splice(index, 1);
		ingredients.length > 0 &&
			newCart.splice(index, 1, {
				...newCart[index],
				ingredients: ingredients,
				total: newTotal,
			});
		// Update the state with the new array
		setCart(newCart);
	}

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
					data={cart}
					extraData={cart}
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
												onPress={() => handleUnchecked(parentData.id, item.id)}
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
