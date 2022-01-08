import React from 'react';
import 'react-native-gesture-handler';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
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
	Poppins_200ExtraLight,
	Poppins_300Light,
	Poppins_400Regular,
	Poppins_500Medium,
	Poppins_600SemiBold,
	Poppins_700Bold,
	Poppins_800ExtraBold,
	Poppins_900Black,
} from '@expo-google-fonts/poppins';
import merge from 'deepmerge';
import { RecoilRoot } from 'recoil';
const queryClient = new QueryClient();

export default function App() {
	React.useEffect(() => {
		axios
			.get('https://recipetohome-api.herokuapp.com/check')
			.then(() => {})
			.catch(() => {});
		return () => null;
	}, []);
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
		Poppins_200ExtraLight,
		Poppins_300Light,
		Poppins_400Regular,
		Poppins_500Medium,
		Poppins_600SemiBold,
		Poppins_700Bold,
		Poppins_800ExtraBold,
		Poppins_900Black,
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
				<QueryClientProvider client={queryClient}>
					<RecoilRoot>
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
					</RecoilRoot>
				</QueryClientProvider>
			</SafeAreaProvider>
		);
	}
}
