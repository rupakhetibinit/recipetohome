import React, { useState, useEffect } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
	const navigation = useNavigation();
	const storeData = async (user) => {
		try {
			const jsonValue = JSON.stringify(user);
			await AsyncStorage.setItem('user', jsonValue);
			// const asyncUser = await AsyncStorage.getItem('user');
			// console.log(asyncUser);
			// console.log('stored');
		} catch (e) {
			// saving error
			console.log('Error saving token');
		}
	};

	const { auth, setAuth } = useContext(AuthContext);

	const [loggingOut, setLoggingOut] = useState(false);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const config = {
		headers: {
			Authorization: `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		getUserData();
		return () => {};
	}, []);

	async function getUserData() {
		axios
			.get(
				'https://recipetohome-api.herokuapp.com/api/v1/users/wallet/' + auth.id,
				config
			)
			.then((res) => {
				// console.log(res.data.user);
				setData(res.data.user);
				storeData(auth)
					.then(() => {
						setAuth({
							...auth,
							isAdmin: res.data.user.isAdmin,
							email: res.data.user.email,
							location: res.data.user.location,
							phone: res.data.user.phone,
							name: res.data.user.name,
							wallet: res.data.user.wallet,
						});
						// console.log('stored');
					})
					.catch((err) => console.log(err));
			})
			.catch((err) => console.log(err))
			.finally(() => {
				setLoading(false);
			});
	}

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		getUserData();
		setRefreshing(false);
	}, []);

	const initials = auth.name
		.match(/(^\S\S?|\b\S)?/g)
		.join('')
		.match(/(^\S|\S$)?/g)
		.join('')
		.toUpperCase();

	const onLogoutPressed = () => {
		setLoggingOut(true);
		const deleteData = async () => {
			try {
				const jsonValue = await AsyncStorage.getItem('user');
				if (jsonValue !== null && jsonValue !== undefined) {
					await AsyncStorage.removeItem('user');
					setAuth({
						isAdmin: false,
						email: '',
						token: '',
						name: '',
						id: null,
						location: null,
						phone: null,
						wallet: 0,
					});
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
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				<StatusBar style='dark' />
				{loading && <ActivityIndicator />}
				<View style={styles.userInfoSection}>
					<View style={{ flexDirection: 'row', marginTop: 15 }}>
						<Avatar.Text size={80} label={initials} />
						<View style={{ marginLeft: 20 }}>
							<Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
								{auth.name}
							</Title>
							<Caption style={styles.caption}>{auth.email}</Caption>
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
							{auth.location ? auth.location : 'Location not set'}
						</Text>
					</View>
					<View style={styles.row}>
						<MaterialCommunityIcons color='#777777' name='phone' size={20} />

						<Text style={{ color: '#777777', marginLeft: 20 }}>
							{auth.phone ? `+977-${auth.phone}` : 'Phone not set'}
						</Text>
					</View>
				</View>

				{!loading && (
					<View style={styles.infoBoxWrapper}>
						<View
							style={[
								styles.infoBox,
								{ borderRightColor: '#dddddd', borderRightWidth: 1 },
							]}
						>
							<Title>Rs. {auth.wallet}</Title>
							<Caption>Wallet</Caption>
						</View>
						<View style={styles.infoBox}>
							<Title>{data?._count?.orders}</Title>
							<Caption>Orders</Caption>
						</View>
					</View>
				)}
				<View style={styles.menuWrapper}>
					<TouchableRipple onPress={() => navigation.navigate('PendingOrders')}>
						<View style={styles.menuItem}>
							<MaterialCommunityIcons
								name='shopping-outline'
								color='#5f2eea'
								size={25}
							/>
							<Text style={styles.menuItemText}>Pending Orders</Text>
						</View>
					</TouchableRipple>
					<TouchableRipple
						onPress={() => navigation.navigate('DeliveredOrders')}
					>
						<View style={styles.menuItem}>
							<MaterialCommunityIcons
								name='shopping'
								color='#5f2eea'
								size={25}
							/>
							<Text style={styles.menuItemText}>Delivered Orders</Text>
						</View>
					</TouchableRipple>
					<TouchableRipple onPress={onLogoutPressed}>
						<View style={styles.menuItem}>
							<MaterialCommunityIcons name='logout' color='#5f2eea' size={25} />
							<Text style={styles.menuItemText}>Logout</Text>
						</View>
					</TouchableRipple>
				</View>

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
					onPress={() => navigation.navigate('EditProfile')}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

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
