import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import SelectedRecipeScreen from '../screens/SelectedRecipeScreen';
import RecipeScreen from '../screens/RecipeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CartScreen from '../screens/CartScreen';
import { Ionicons } from '@expo/vector-icons';
import FavoriteScreen from '../screens/FavoriteScreen';

const RecipeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName='Profile'
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'Profile') {
							iconName = focused ? 'md-person-sharp' : 'md-person-outline';
						} else if (route.name === 'RecipeStack') {
							iconName = focused
								? 'md-fast-food-sharp'
								: 'md-fast-food-outline';
						} else if (route.name === 'Cart') {
							iconName = focused ? 'md-cart-sharp' : 'md-cart-outline';
						} else if (route.name === 'Favorite') {
							iconName = focused ? 'md-heart-sharp' : 'md-heart-outline';
						}

						return <Ionicons size={size} color={color} name={iconName} />;
					},
					tabBarInactiveTintColor: 'gray',
					tabBarActiveTintColor: '#5f2eea',
					header: () => null,
				})}
			>
				<Tab.Screen name='RecipeStack' component={RecipeStackScreen} />
				<Tab.Screen name='Cart' component={CartScreen} />
				<Tab.Screen name='Favorite' component={FavoriteScreen} />
				<Tab.Screen name='Profile' component={ProfileScreen} />
			</Tab.Navigator>
		</NavigationContainer>
	);
};

const RecipeStackScreen = () => {
	return (
		<RecipeStack.Navigator
			screenOptions={{
				header: () => null,
			}}
		>
			<RecipeStack.Screen name='Recipe' component={RecipeScreen} />
			<RecipeStack.Screen
				name='SelectedRecipe'
				component={SelectedRecipeScreen}
			/>
		</RecipeStack.Navigator>
	);
};

export default MainStack;
