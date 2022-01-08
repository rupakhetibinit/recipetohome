import LoginScreen from '../screens/LoginScreen';
import SelectedRecipeScreen from '../screens/SelectedRecipeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';

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
		</Stack.Navigator>
	);
};

export default AuthStack;
