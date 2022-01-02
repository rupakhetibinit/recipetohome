import React, { useEffect, useState, useRef } from 'react';
import 'react-native-gesture-handler';
import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
	DefaultTheme as PaperDefaultTheme,
	Provider as PaperProvider,
} from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/Routes';
import {
	useFonts,
	Poppins_100Thin,
	Poppins_100Thin_Italic,
	Poppins_200ExtraLight,
	Poppins_200ExtraLight_Italic,
	Poppins_300Light,
	Poppins_300Light_Italic,
	Poppins_400Regular,
	Poppins_400Regular_Italic,
	Poppins_500Medium,
	Poppins_500Medium_Italic,
	Poppins_600SemiBold,
	Poppins_600SemiBold_Italic,
	Poppins_700Bold,
	Poppins_700Bold_Italic,
	Poppins_800ExtraBold,
	Poppins_800ExtraBold_Italic,
	Poppins_900Black,
	Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import merge from 'deepmerge';

export default function App() {
	const DefaultTheme = merge(NavigationDefaultTheme, PaperDefaultTheme);
	const theme = {
		...DefaultTheme,
		roundness: 5,
		colors: {
			...DefaultTheme.colors,
		},
	};

	let [fontsLoaded] = useFonts({
		Poppins_100Thin,
		Poppins_100Thin_Italic,
		Poppins_200ExtraLight,
		Poppins_200ExtraLight_Italic,
		Poppins_300Light,
		Poppins_300Light_Italic,
		Poppins_400Regular,
		Poppins_400Regular_Italic,
		Poppins_500Medium,
		Poppins_500Medium_Italic,
		Poppins_600SemiBold,
		Poppins_600SemiBold_Italic,
		Poppins_700Bold,
		Poppins_700Bold_Italic,
		Poppins_800ExtraBold,
		Poppins_800ExtraBold_Italic,
		Poppins_900Black,
		Poppins_900Black_Italic,
	});
	if (!fontsLoaded) {
		return null;
		// 	// return <Text>Loading...</Text>;
	} else {
		// return (
		// 	<SafeAreaProvider>
		// 		<AuthProvider>
		// 			<Routes />
		// 		</AuthProvider>
		// 	</SafeAreaProvider>
		// );
		// }

		return (
			<SafeAreaProvider>
				<AuthProvider>
					<CartProvider>
						<PaperProvider theme={theme}>
							<NavigationContainer>
								<Routes />
							</NavigationContainer>
						</PaperProvider>
						{/* <View
						style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
						>
						<Text>Loading...</Text>
					</View> */}
					</CartProvider>
				</AuthProvider>
			</SafeAreaProvider>
		);
	}
}
