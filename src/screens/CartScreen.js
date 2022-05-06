import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useQueryClient } from 'react-query';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
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
						id: item.id,
					};
				});
				// console.log(ingredients);
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
			newCart[index].ingredients.find((item) => item.id === ingredientId).price;
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
												onPress={() => handleUnchecked(parentData.id, item.id)}
												color='#694fad'
											/>
											<Text style={{ fontSize: 14 }}>
												{item.amount} {item.measurement} {item.name} Rs.
												{item.price}
											</Text>
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
										<Text>Total Rs.{parentData.total}</Text>
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
