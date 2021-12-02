import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName='Login'
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#fff' },
				}}
			>
				{/* <Stack.Screen name='Login' component={LoginScreen} />*/}
				<Stack.Screen name='Signup' component={SignUpScreen} />
				<Stack.Screen name='Login' component={LoginScreen} />
			</Stack.Navigator>
		</NavigationContainer>
		// 		// <View>
		// 		// 	<Text>hello world</Text>
		// 		// </View>
	);
};

const HomeScreen = () => {
	return (
		<View>
			<Text>Hello</Text>
		</View>
	);
};

export default AuthStack;

// const AuthStack = () => {
// 	return (
// 		<NavigationContainer>
// 			<LoginScreen />
// 		</NavigationContainer>
// 	);
// };

// export default AuthStack;
