import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { List, ActivityIndicator } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { AuthContext } from '../context/AuthContext';

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
	const getData = async () => {
		setLoading(true);
		axios
			.get(
				'https://recipetohome-api.herokuapp.com/api/v1/orders/user/' + auth.id,
				config
			)
			.then((res) => {
				console.log(res);
				setData(res.data.orders);
				console.log(res.data.orders);
			})
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};
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

			{data && (
				<View>
					<FlatList
						data={data.filter((item) => item.delivered === false)}
						extraData={data.filter((item) => item.delivered === false)}
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
