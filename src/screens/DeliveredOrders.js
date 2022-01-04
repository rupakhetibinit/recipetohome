import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { List, ActivityIndicator } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';

const PendingOrders = () => {
	const { auth, setAuth } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [data, setData] = useState(null);
	const config = {
		headers: {
			Authorization: `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
	};
	async function getData() {
		setLoading(true);
		axios
			.get(
				'https://recipetohome-api.herokuapp.com/api/v1/orders/user/' + auth.id,
				config
			)
			.then((res) => {
				// console.log(res);
				setData(res.data.orders);
				// console.log(res.data.orders);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	}
	useEffect(() => {
		getData();
		return () => {};
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		getData();
		setRefreshing(false);
	};

	return (
		<View style={styles.container}>
			{loading && <ActivityIndicator size={25} style={{ margin: 20 }} />}
			{data && data.filter((item) => item.delivered === true).length === 0 && (
				<ScrollView
					contentContainerStyle={styles.container}
					refreshing={refreshing}
					RefreshControl={
						<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
					}
				>
					<Text
						style={{
							fontFamily: 'Poppins_500Medium',
							fontSize: 20,
							marginHorizontal: 10,
						}}
					>
						You have no delivered orders
					</Text>
				</ScrollView>
			)}

			{data && (
				<View>
					<FlatList
						data={data.filter((item) => item.delivered === true)}
						extraData={data.filter((item) => item.delivered === true)}
						renderItem={({ item }) => (
							<List.Accordion
								title={`Order ${item.id.split('-')[0].toUpperCase()}`}
							>
								<List.Item title='Total' description={`Rs. ${item.total}`} />
							</List.Accordion>
						)}
						keyExtractor={(item) => item.id}
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				</View>
			)}
		</View>
	);
};

export default PendingOrders;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
