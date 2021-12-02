import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from '../screens/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

// const AuthStack = () => {
// 	return (
// <NavigationContainer>
// 			<Stack.Navigator
// 				initialRouteName='Login'
// 				screenOptions={{
// 					headerShown: false,
// 					header: () => null,
// 					contentStyle: { backgroundColor: 'white' },
// 				}}
// 			>
// 				<Stack.Screen name='Login' component={LoginScreen} />
// 				<Stack.Screen name='Signup' component={SignUpScreen} />
// 			</Stack.Navigator>
// </NavigationContainer>
// 		// <View>
// 		// 	<Text>hello world</Text>
// 		// </View>
// 	);
// };

// export default AuthStack;

const AuthStack = () => {
	return (
		<NavigationContainer>
			<LoginScreen />
		</NavigationContainer>
	);
};

export default AuthStack;
