import React, { useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { AuthAtom, nameInitials } from '../stores/atoms';
import { useQuery } from 'react-query';
import { useRefreshByUser } from '../hooks/useRefreshByUser';

const ProfileScreen = () => {
	const resetAuthState = useResetRecoilState(AuthAtom);
	const initials = useRecoilValue(nameInitials);
	const navigation = useNavigation();
	const setAuth = useSetRecoilState(AuthAtom);
	const { token, id, name, email, location, phone } = useRecoilValue(AuthAtom);

	const [loggingOut, setLoggingOut] = useState(false);
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	};

	function getUserData() {
		return axios.get(
			'https://recipetohome-api.herokuapp.com/api/v1/users/wallet/' + id,
			config
		);
	}
	const { data, isLoading, error, isError, refetch } = useQuery(
		'getUserData',
		getUserData,
		{
			select: (data) => data.data.user,
			onSuccess: (data) => {
				console.log(data);
			},
			// 	setAuth((prevState) => ({ ...prevState, wallet: data.wallet }));
			// },
		}
	);

	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	const onLogoutPressed = () => {
		setLoggingOut(true);
		const deleteData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem('user');
				if (jsonValue !== null && jsonValue !== undefined) {
					await AsyncStorage.removeItem('user');
					// console.log('deleted');
				} else {
					setLoggingOut(false);
				}
			} catch (e) {
				console.log(e);
				setLoggingOut(false);
			}
		};
		deleteData()
			.then(() => {
				// console.log('data finally deleted');
				resetAuthState();
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={{ flex: 1 }}
				refreshControl={
					<RefreshControl
						refreshing={isRefetchingByUser}
						onRefresh={refetchByUser}
					/>
				}
			>
				<StatusBar style='dark' />
				{isLoading && <ActivityIndicator />}
				<View style={styles.userInfoSection}>
					<View style={{ flexDirection: 'row', marginTop: 15 }}>
						<Avatar.Text size={80} label={initials} />
						<View style={{ marginLeft: 20 }}>
							<Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
								{name}
							</Title>
							<Caption style={styles.caption}>{email}</Caption>
						</View>
					</View>
				</View>

				<View style={styles.userInfoSection}>
					<View style={styles.row}>
						<MaterialCommunityIcons
							color='#777777'
							name='map-marker-radius'
							size={20}
						/>

						<Text style={{ color: '#777777', marginLeft: 20 }}>
							{location ? location : 'Location not set'}
						</Text>
					</View>
					<View style={styles.row}>
						<MaterialCommunityIcons color='#777777' name='phone' size={20} />

						<Text style={{ color: '#777777', marginLeft: 20 }}>
							{phone ? `+977-${phone}` : 'Phone not set'}
						</Text>
					</View>
				</View>

				{!isLoading && (
					<View style={styles.infoBoxWrapper}>
						<View
							style={[
								styles.infoBox,
								{ borderRightColor: '#dddddd', borderRightWidth: 1 },
							]}
						>
							<Title>Rs. {data.wallet}</Title>
							<Caption>Wallet</Caption>
						</View>
						<View style={styles.infoBox}>
							<Title>{data?._count.orders}</Title>
							<Caption>Orders</Caption>
						</View>
					</View>
				)}
				<View style={styles.menuWrapper}>
					<MenuItem
						navigation={navigation}
						route='PendingOrders'
						icon='shopping-outline'
						text='Pending Orders'
					/>
					<MenuItem
						navigation={navigation}
						route='DeliveredOrders'
						icon='shopping'
						text='Delivered Orders'
					/>
					<TouchableRipple onPress={onLogoutPressed}>
						<View style={styles.menuItem}>
							<MaterialCommunityIcons name='logout' color='#5f2eea' size={25} />
							<Text style={styles.menuItemText}>Logout</Text>
						</View>
					</TouchableRipple>
				</View>
				{isError && <Text style={{ color: 'red' }}>Something went wrong</Text>}
				<FloatButton navigation={navigation} />
			</ScrollView>
		</SafeAreaView>
	);
};

const MenuItem = React.memo(function ({
	navigation = null,
	route = null,
	icon,
	text,
}) {
	return (
		<TouchableRipple onPress={() => navigation.navigate(route)}>
			<View style={styles.menuItem}>
				<MaterialCommunityIcons name={icon} color='#5f2eea' size={25} />
				<Text style={styles.menuItemText}>{text}</Text>
			</View>
		</TouchableRipple>
	);
});

class FloatButton extends React.PureComponent {
	navigation = this.props.navigation;
	render() {
		return (
			<FAB
				style={{ position: 'absolute', bottom: 0, right: 0, margin: 20 }}
				small={false}
				color='#5f2eea'
				icon={() => {
					return (
						<MaterialCommunityIcons
							name='account-edit'
							color='black'
							size={24}
						/>
					);
				}}
				onPress={() => this.navigation.navigate('EditProfile')}
			/>
		);
	}
}
export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	userInfoSection: {
		paddingHorizontal: 30,
		marginBottom: 25,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
		fontWeight: '500',
	},
	row: {
		flexDirection: 'row',
		marginBottom: 10,
		alignItems: 'center',
	},
	infoBoxWrapper: {
		borderBottomColor: '#dddddd',
		borderBottomWidth: 1,
		borderTopColor: '#dddddd',
		borderTopWidth: 1,
		flexDirection: 'row',
		height: 100,
	},
	infoBox: {
		width: '50%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	menuWrapper: {
		marginTop: 10,
	},
	menuItem: {
		flexDirection: 'row',
		paddingVertical: 15,
		paddingHorizontal: 30,
	},
	menuItemText: {
		color: '#777777',
		marginLeft: 20,
		fontWeight: '600',
		fontSize: 16,
		lineHeight: 26,
	},
	textInput: {
		marginHorizontal: 20,
		width: '70%',
		height: 40,
	},
});
