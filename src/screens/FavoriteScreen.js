import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const FavoriteScreen = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const token = auth.token;
	const id = token.userId;
	const { data, loading, error } = useFetch(
		`https://recipetohome-api.herokuapp.com/api/v1/recipes/${id}/liked'`,
		{
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return (
		<SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
			<StatusBar />
			<Text
				style={{
					paddingRight: 0.5 * Dimensions.get('window').width,
					color: '#5F2EEA',
					fontSize: 24,
					fontFamily: 'Poppins_500Medium',
				}}
			>
				Favorite Recipes
			</Text>
			{loading && (
				<ActivityIndicator
					size={'large'}
					style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
				/>
			)}
			{data && console.log(data)}
		</SafeAreaView>
	);
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
