import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderConfirmationScreen = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const { order } = route.params;
	// console.log(order);
	return (
		<SafeAreaView style={styles.container}>
			<View style={{ marginHorizontal: 30 }}>
				<Text style={styles.headerText}>
					Your order has been placed successfully!
				</Text>
			</View>
			<View style={{ alignItems: 'flex-start', marginHorizontal: 30 }}>
				<Text>
					Your order number is: {order.id.split('-')[0].toUpperCase()}
				</Text>
				<Text>Your order total is: {order.total}</Text>
				<Text>Your ordered ingredients are:</Text>
				<Text>
					{order.ingredients.map((item) => {
						return item.name + '\n';
					})}
				</Text>
			</View>
			<LottieView
				style={{ width: 200, height: 200, alignSelf: 'center' }}
				source={require('../../assets/delivery.json')}
				autoPlay={true}
				loop={true}
				autoSize={true}
			/>
			<Text
				style={[styles.headerText, { alignSelf: 'center', color: '#BC1141' }]}
			>
				We will be delivering your items soon
			</Text>
			<View style={{ alignItems: 'center' }}>
				<Button
					mode='contained'
					style={{
						fontSize: 14,
						fontFamily: 'Poppins_700Bold',
						color: '#694fad',
						width: 200,
					}}
					onPress={() => navigation.goBack()}
				>
					Go Back
				</Button>
			</View>
		</SafeAreaView>
	);
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	text: {
		fontSize: 20,
		fontFamily: 'Poppins_500Medium',
	},
	headerText: {
		fontSize: 20,
		fontFamily: 'Poppins_600SemiBold',
		color: '#694fad',
	},
});
