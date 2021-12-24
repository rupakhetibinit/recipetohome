import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';

const FavoriteScreen = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const token = auth.token;
	const id = auth.id;
	const [error, setError] = useState(true);
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	useEffect(() => {
		axios
			.get(
				'https://recipetohome-api.herokuapp.com/api/v1/recipes/' +
					'liked/' +
					id,
				config
			)
			.then((res) => {
				console.log(res);
				setLoading(true);
				setData(res.data.recipe);
				setLoading(false);
				setError(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setError('something went wrong');
			});
	});

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
			{error && (
				<Text
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						color: 'red',
					}}
				>
					{error}
				</Text>
			)}
		</SafeAreaView>
	);
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
