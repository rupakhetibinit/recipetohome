import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
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
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'md-home-sharp' : 'md-home-outline';
            } else if (route.name === 'RecipeStack') {
              iconName = focused ? 'md-fast-food-sharp' : 'md-fast-food-outline';
            } else if (route.name === 'CartScreen') {
              iconName = focused ? 'md-cart-sharp' : 'md-cart-outline';
            } else if (route.name === 'FavoriteScreen') {
              iconName = focused ? 'md-heart-sharp' : 'md-heart-outline';
            }

            return <Ionicons size={size} color={color} name={iconName} />;
          },
          tabBarInactiveTintColor: 'gray',
          tabBarActiveTintColor: '#5f2eea',
          header: () => null,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="RecipeStack" component={RecipeStackScreen} />
        <Tab.Screen name="CartScreen" component={CartScreen} />
        <Tab.Screen name="FavoriteScreen" component={FavoriteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const RecipeStackScreen = () => {
  return (
    <RecipeStack.Navigator>
      <RecipeStack.Screen name="Recipe" component={RecipeScreen} />
      <RecipeStack.Screen name="SelectedRecipe" component={SelectedRecipeScreen} />
    </RecipeStack.Navigator>
  );
};

export default MainStack;
