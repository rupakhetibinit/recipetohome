import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import SelectedRecipeScreen from '../screens/SelectedRecipeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import CartScreen from '../screens/CartScreen';
import { Ionicons } from '@expo/vector-icons';
import PendingOrders from '../screens/PendingOrders';
import DeliveredOrders from '../screens/DeliveredOrders';
import FavoriteScreen from '../screens/FavoriteScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import {
	CardStyleInterpolators,
	createStackNavigator,
	HeaderStyleInterpolators,
	TransitionSpecs,
} from '@react-navigation/stack';
const RecipeStack = createSharedElementStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const ProfileStack = createStackNavigator();
const OrderStack = createNativeStackNavigator();
const MainStack = () => {
	return (
		<Tab.Navigator
			initialRouteName='Home'
			activeColor='#fff'
			backBehavior='history'
			sceneAnimationEnabled={false}
			shifting={true}
		>
			<Tab.Screen
				name='Home'
				component={RecipeStackScreen}
				options={{
					tabBarLabel: 'Home',
					tabBarColor: '#009387',
					tabBarIcon: ({ color }) => (
						<Ionicons name='ios-home' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Profile'
				component={ProfileStackScreen}
				options={{
					tabBarLabel: 'Profile',
					tabBarColor: '#1f65ff',
					tabBarIcon: ({ color }) => (
						<Ionicons name='ios-person' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Shopping'
				component={OrderStackScreen}
				options={{
					tabBarLabel: 'Shopping',
					tabBarColor: '#694fad',
					tabBarIcon: ({ color }) => (
						<Ionicons name='ios-cart' color={color} size={26} />
					),
				}}
			/>
			<Tab.Screen
				name='Favorite'
				component={FavoriteScreen}
				options={{
					tabBarLabel: 'Favorite',
					tabBarColor: '#d02860',
					tabBarIcon: ({ color }) => (
						<Ionicons name='ios-heart' color={color} size={26} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

const RecipeStackScreen = () => {
	return (
		<View style={{ flex: 1 }} collapsable={false}>
			<RecipeStack.Navigator
				screenOptions={{
					headerShown: false,
					gestureEnabled: true,
					cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
				}}
				initialRouteName='Main'
			>
				<RecipeStack.Screen name='Main' component={RecipeScreen} />
				<RecipeStack.Screen
					sharedElements={(route) => {
						return [route.params.recipeId];
					}}
					name='SelectedRecipe'
					component={SelectedRecipeScreen}
				/>
			</RecipeStack.Navigator>
		</View>
	);
};

const ProfileStackScreen = () => {
	return (
		<View style={{ flex: 1 }} collapsable={false}>
			<ProfileStack.Navigator>
				<ProfileStack.Screen
					name='MainProfile'
					component={ProfileScreen}
					options={{
						headerShown: false,
					}}
				/>
				<ProfileStack.Screen
					name='EditProfile'
					component={EditProfileScreen}
					options={{
						headerShown: true,
						headerStyle: {
							backgroundColor: '#1f65ff',
						},
						headerTitle: 'Edit Profile',
					}}
				/>
				<ProfileStack.Screen
					name='PendingOrders'
					component={PendingOrders}
					options={{
						headerShown: true,
						headerStyle: {
							backgroundColor: '#1f65ff',
						},
						headerTitleStyle: {
							color: '#fff',
							fontFamily: 'Poppins_500Medium',
						},
						headerTitle: 'Pending Orders',
						gestureEnabled: true,
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
						headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
					}}
				/>
				<ProfileStack.Screen
					name='DeliveredOrders'
					component={DeliveredOrders}
					options={{
						headerShown: true,
						headerStyle: {
							backgroundColor: '#1f65ff',
						},
						headerTitle: 'Delivered Orders',
						headerTitleStyle: {
							color: '#fff',
							fontFamily: 'Poppins_500Medium',
						},
						gestureEnabled: true,
						cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
					}}
				/>
			</ProfileStack.Navigator>
		</View>
	);
};

const OrderStackScreen = () => {
	return (
		<View style={{ flex: 1 }} collapsable={false}>
			<OrderStack.Navigator>
				<OrderStack.Screen
					name='Cart'
					component={CartScreen}
					options={{ headerShown: false }}
				/>
				<OrderStack.Screen
					name='OrderConfirmation'
					component={OrderConfirmationScreen}
					options={{
						headerShown: true,
						headerStyle: {
							backgroundColor: '#694fad',
						},
						headerTitle: 'Order Confirmation',
					}}
				/>
			</OrderStack.Navigator>
		</View>
	);
};

export default MainStack;
