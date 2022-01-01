import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import SelectedRecipeScreen from '../screens/SelectedRecipeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import CartScreen from '../screens/CartScreen';
import { Ionicons } from '@expo/vector-icons';
import FavoriteScreen from '../screens/FavoriteScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import EditProfileScreen from '../screens/EditProfileScreen';
const RecipeStack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

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
				name='Cart'
				component={CartScreen}
				options={{
					tabBarLabel: 'Cart',
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
				}}
			>
				<RecipeStack.Screen name='Main' component={RecipeScreen} />
				<RecipeStack.Screen
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
			<ProfileStack.Navigator
				screenOptions={{
					headerShown: false,
				}}
			>
				<ProfileStack.Screen name='MainProfile' component={ProfileScreen} />
				<ProfileStack.Screen name='EditProfile' component={EditProfileScreen} />
			</ProfileStack.Navigator>
		</View>
	);
};

export default MainStack;
