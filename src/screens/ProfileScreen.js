import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	Button,
	Avatar,
	Title,
	Caption,
	TouchableRipple,
	FAB,
} from 'react-native-paper';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
	const { auth, setAuth } = useContext(AuthContext);
	const [loggingOut, setLoggingOut] = useState(false);
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
					await AsyncStorage.removeItem('auth');
					setAuth({
						token: '',
						name: '',
						email: '',
						id: '',
						isAdmin: false,
					});
					console.log('deleted');
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
				console.log('data finally deleted');
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style='dark' />
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
						Kathmandu, Nepal
					</Text>
				</View>
				<View style={styles.row}>
					<MaterialCommunityIcons color='#777777' name='phone' size={20} />
					<Text style={{ color: '#777777', marginLeft: 20 }}>
						+977-9865055827
					</Text>
				</View>
			</View>

			<View style={styles.infoBoxWrapper}>
				<View
					style={[
						styles.infoBox,
						{ borderRightColor: '#dddddd', borderRightWidth: 1 },
					]}
				>
					<Title>Rs. 1400</Title>
					<Caption>Wallet</Caption>
				</View>
				<View style={styles.infoBox}>
					<Title>10</Title>
					<Caption>Orders</Caption>
				</View>
			</View>

			<View style={styles.menuWrapper}>
				<TouchableRipple onPress={() => {}}>
					<View style={styles.menuItem}>
						<MaterialCommunityIcons
							name='heart-outline'
							color='#5f2eea'
							size={25}
						/>
						<Text style={styles.menuItemText}>Your Favorites</Text>
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
				style={{ position: 'absolute', bottom: 0, right: 0, margin: 18 }}
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
});
