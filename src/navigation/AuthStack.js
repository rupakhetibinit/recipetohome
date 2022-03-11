import LoginScreen from '../screens/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';
import OtpVerification from '../screens/OtpVerification';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
	return (
		<Stack.Navigator
			initialRouteName='Login'
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#fff' },
			}}
		>
			<Stack.Screen name='Signup' component={SignUpScreen} />
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Verification' component={OtpVerification} />
		</Stack.Navigator>
	);
};

export default AuthStack;
