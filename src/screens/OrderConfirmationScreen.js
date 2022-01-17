import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { material, iOSUIKit } from 'react-native-typography';

const OrderConfirmationScreen = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const { order } = route.params;
	// console.log(order);
	const width = Dimensions.get('window').width;
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.textWrapper}>
				<Text style={styles.headerText}>
					Your order has been placed successfully!
				</Text>
			</View>
			<View style={{ alignItems: 'flex-start', marginHorizontal: 10 }}>
				<Text style={material.body2}>
					Your order number is: {order.id.split('-')[0].toUpperCase()}
				</Text>
				<Text style={material.body2}>Your order total is: {order.total}</Text>
				<Text style={iOSUIKit.title3Emphasized}>
					Your ordered ingredients are:
				</Text>
				<Text style={iOSUIKit.body}>
					{order.ingredients.map((item) => {
						return item.name + '\n';
					})}
				</Text>
			</View>
			<LottieView
				style={{ width: width }}
				source={require('../../assets/delivery-guy.json')}
				autoPlay={true}
				loop={true}
				autoSize={true}
			/>
			<Text
				style={[
					styles.headerText,
					{ alignSelf: 'center', color: '#485275', marginBottom: 5 },
				]}
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
		fontSize: 16,
		fontFamily: 'Poppins_600SemiBold',
		color: '#694fad',
	},
	textWrapper: {
		marginHorizontal: 10,
	},
});
