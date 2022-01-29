import axios from 'axios';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { List } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useRefreshByUser } from '../hooks/useRefreshByUser';
import { useRecoilValue } from 'recoil';
import { AuthAtom } from '../stores/atoms';

const PendingOrders = () => {
	const { token, id } = useRecoilValue(AuthAtom);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	function fetchPendingOrders() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/orders/user/' + id,
			config
		);
	}
	const { data, isLoading, isError, error, refetch } = useQuery(
		'pendingOrders',
		fetchPendingOrders,
		{
			select: (data) =>
				data.data.orders.filter((order) => order.delivered === false),
		}
	);
	{
		data && console.log(data);
	}
	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	return (
		<SafeAreaView style={styles.container}>
			{isError && <Text style={{ color: 'red' }}>Error! {error.message}</Text>}
			{data?.length === 0 ? (
				<ScrollView
					contentContainerStyle={styles.container}
					refreshControl={
						<RefreshControl
							onRefresh={refetchByUser}
							refreshing={isRefetchingByUser}
						/>
					}
				>
					<Text
						style={{
							fontFamily: 'Poppins_500Medium',
							fontSize: 20,
							marginHorizontal: 10,
						}}
					>
						You have no pending orders
					</Text>
				</ScrollView>
			) : (
				<View>
					<FlatList
						data={data}
						extraData={data}
						initialNumToRender={15}
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
		</SafeAreaView>
	);
};

export default PendingOrders;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
