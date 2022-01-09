import axios from 'axios';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { List, ActivityIndicator } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRecoilValue } from 'recoil';
import { AuthAtom } from '../stores/atoms';

const PendingOrders = () => {
	const { id, token } = useRecoilValue(AuthAtom);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	function fetchDeliveredOrders() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/orders/user/' + id,
			config
		);
	}
	const { data, isLoading, isError, error, refetch } = useQuery(
		'deliveredOrders',
		fetchDeliveredOrders,
		{
			select: (data) =>
				data.data.orders.filter((order) => order.delivered === true),
		}
	);
	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	return (
		<View style={styles.container}>
			{isLoading && <ActivityIndicator size={25} style={{ margin: 20 }} />}
			{isError && (
				<Text style={{ margin: 30, color: 'red', fontSize: 20 }}>
					{error.message}
				</Text>
			)}
			{data?.length === 0 ? (
				<ScrollView
					contentContainerStyle={styles.container}
					refreshing={isRefetchingByUser}
					RefreshControl={
						<RefreshControl
							onRefresh={refetchByUser}
							refreshing={isRefetchingByUser}
						/>
					}
				>
					<Text style={styles.deliveredOrdersText}>
						You have no delivered orders
					</Text>
				</ScrollView>
			) : (
				<View>
					<FlatList
						data={data}
						extraData={data}
						renderItem={({ item }) => (
							<List.Accordion
								title={`Order ${item.id.split('-')[0].toUpperCase()}`}
							>
								<List.Item title='Total' description={`Rs. ${item.total}`} />
							</List.Accordion>
						)}
						keyExtractor={(item) => item.id}
						refreshing={isRefetchingByUser}
						onRefresh={refetchByUser}
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
	deliveredOrdersText: {
		fontFamily: 'Poppins_500Medium',
		fontSize: 20,
		marginHorizontal: 10,
	},
});
