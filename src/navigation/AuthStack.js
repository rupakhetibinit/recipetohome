import React, { useState, useRef, useEffect, useContext } from 'react';
import LoginScreen from '../screens/LoginScreen';
import SelectedRecipeScreen from '../screens/SelectedRecipeScreen';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

const AuthStack = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();
	useEffect(() => {
		registerForPushNotificationsAsync().then((token) => {
			setExpoPushToken(token);
			setAuth({ ...auth, pushNotificationToken: token });
		});

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	return (
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
			<Stack.Screen name='SelectedRecipe' component={SelectedRecipeScreen} />
		</Stack.Navigator>

		// 		// <View>
		// 		// 	<Text>hello world</Text>
		// 		// </View>
	);
};

export default AuthStack;

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}

async function schedulePushNotification() {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "You've got mail! 📬",
			body: 'Here is the notification body',
			data: { data: 'goes here' },
		},
		trigger: { seconds: 2 },
	});
}
