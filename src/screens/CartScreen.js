import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useQueryClient } from 'react-query';
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { Button, Checkbox, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';
import { useSnapshot } from 'valtio';
import { AuthAtom, config } from '../stores/atoms';
import state from '../stores/valtioStore';
import axios from 'axios';

const CartScreen = () => {
	const apiConfig = useRecoilValue(config);
	const queryClient = useQueryClient();
	const navigation = useNavigation();
	const { wallet, id } = useRecoilValue(AuthAtom);
	const snap = useSnapshot(state);
	const [reload, setReload] = React.useState(false);

	async function handleOrder(order) {
		try {
			if (wallet < order.total) {
				alert('You do not have enough money in your wallet to make this order');
				return;
			} else {
				const givenOrder = order;
				// console.log(givenOrder);
				const ingredients = givenOrder.ingredients.map((item) => {
					return {
						amount: item.amount,
						grandTotal: item.grandTotal,
						measurement: item.measurement,
						name: item.name,
						price: item.price,
						required: item.required,
						quantity: item.quantity,
					};
				});
				// console.log(ingredients);
				// console.log(
				// 	JSON.stringify({
				// 		userId: id,
				// 		total: order.total,
				// 		recipeId: order.recipeId,
				// 		id: order.id,
				// 		ingredients: ingredients,
				// 	})
				// );
				const res = await axios.post(
					'https://recipetohome-api.herokuapp.com/api/v1/order',
					{
						userId: id,
						total: order.total,
						recipeId: order.recipeId,
						id: order.id,
						ingredients: ingredients,
					},
					apiConfig
				);
				if (res.data.success === true) {
					state.cartState.splice(state.cartState.indexOf(givenOrder), 1);
					queryClient.invalidateQueries('pendingOrders');
					navigation.navigate('OrderConfirmation', {
						order: res.data.transaction[1],
					});
				} else if (res.data.message === 'Insufficient wallet balance') {
					alert(
						'You do not have enough money in your wallet to make this order'
					);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			setReload(!reload);
		}
	}

	function increaseQuantity(orderId, ingredientId) {
		const newCart = [...snap.cartState];
		const index = newCart.findIndex((item) => item.id === orderId);
		// console.log(newCart[index]);
		const ingredientIndex = newCart[index].ingredients.findIndex(
			(item) => item.id === ingredientId
		);
		// console.log(ingredientIndex);
		let ingredients = [...newCart[index].ingredients];
		let ingredient = { ...newCart[index].ingredients[ingredientIndex] };
		const oldTotal = ingredient.grandTotal;
		// console.log(ingredient);
		let newQuantity = ingredient.quantity;
		newQuantity += 1;
		// console.log(newQuantity);
		ingredient.grandTotal = ingredient.price * newQuantity;
		ingredients.splice(ingredientIndex, 1, {
			...ingredient,
			quantity: newQuantity,
		});
		// console.log(ingredients);

		const newTotal = newCart[index].total - oldTotal + ingredient.grandTotal;
		console.log(newTotal);
		state.cartState.splice(index, 1, {
			...newCart[index],
			ingredients: ingredients,
			total: newTotal,
		});
		// newCart.splice(index, 1, {
		// 	...newCart[index],
		// 	ingredients: ingredients,
		// 	total: newTotal,
		// });

		// console.log(newCart);
	}

	function decreaseQuantity(orderId, ingredientId) {
		const newCart = [...snap.cartState];
		const index = newCart.findIndex((item) => item.id === orderId);
		// console.log(newCart[index]);
		const ingredientIndex = newCart[index].ingredients.findIndex(
			(item) => item.id === ingredientId
		);
		console.log(ingredientIndex);
		let ingredients = [...newCart[index].ingredients];
		let ingredient = { ...newCart[index].ingredients[ingredientIndex] };
		const oldTotal = ingredient.grandTotal;
		// console.log(ingredient);
		let newQuantity = ingredient.quantity;
		newQuantity -= 1;
		// console.log(newQuantity);
		ingredient.grandTotal = ingredient.price * newQuantity;
		ingredients.splice(ingredientIndex, 1, {
			...ingredient,
			quantity: newQuantity,
		});
		// console.log(ingredients);

		const newTotal = newCart[index].total - oldTotal + ingredient.grandTotal;
		// console.log(newTotal);
		state.cartState.splice(index, 1, {
			...newCart[index],
			ingredients: ingredients,
			total: newTotal,
		});
	}

	function handleUnchecked(orderId, ingredientId) {
		// Make a copy of the cart
		const newCart = [...snap.cartState];
		// Find the index of item to remove
		const index = newCart.findIndex((item) => item.id === orderId);
		// Remove the ingredient that was unchecked
		let ingredients = newCart[index].ingredients.filter(
			(item) => item.id !== ingredientId
		);
		// Calculate the reduced total
		let newTotal =
			newCart[index].total -
			newCart[index].ingredients.find((item) => item.id === ingredientId)
				.grandTotal;
		// Remove the item from the array if it is the last ingredient
		ingredients.length === 0 && state.cartState.splice(index, 1);
		ingredients.length > 0 &&
			state.cartState.splice(index, 1, {
				...newCart[index],
				ingredients: ingredients,
				total: newTotal,
			});
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
			{snap.cartState.length === 0 ? (
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
					data={snap.cartState}
					extraData={snap.cartState}
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
									data={item.ingredients}
									renderItem={({ item }) => (
										<View>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													alignItems: 'center',
													marginLeft: 30,
												}}
											>
												<Checkbox
													status='checked'
													onPress={() =>
														handleUnchecked(parentData.id, item.id)
													}
													color='#694fad'
												/>
												<Text style={{ fontSize: 14 }}>
													{item.amount} {item.measurement} {item.name} Rs.
													{item.price}
												</Text>
											</View>
											<View
												style={{
													flex: 1,
													flexDirection: 'row',
													alignItems: 'center',
													alignContent: 'center',
													marginLeft: 30,
												}}
											>
												<Button
													disabled={item?.quantity === 1}
													mode='contained'
													style={{ color: '#694fad' }}
													onPress={() =>
														decreaseQuantity(parentData.id, item.id)
													}
												>
													<Text>-</Text>
												</Button>
												<Text style={{ fontSize: 14, fontWeight: 'bold' }}>
													Quantity : {item.quantity}
												</Text>
												<Button
													mode='contained'
													style={{ color: '#694fad' }}
													onPress={() =>
														increaseQuantity(parentData.id, item.id)
													}
												>
													<Text>+</Text>
												</Button>
												<Text
													style={{
														fontSize: 14,
														fontWeight: 'bold',
														right: 0,
														marginRight: 30,
														position: 'absolute',
													}}
												>
													Total {item.grandTotal}
												</Text>
											</View>
										</View>
									)}
									keyExtractor={(item) => item.id}
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
										<Text>Grand Total Rs.{parentData.total}</Text>
									</View>
								</View>
							</List.Accordion>
						);
					}}
					keyExtractor={(item) => item.id}
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
