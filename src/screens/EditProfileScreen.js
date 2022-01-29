import { useState } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { Avatar, Button } from 'react-native-paper';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthAtom, config } from '../stores/atoms';
function EditProfileScreen({ navigation }) {
	const { id, name } = useRecoilValue(AuthAtom);
	const setAuth = useSetRecoilState(AuthAtom);
	const [userInfo, setUserInfo] = useState({
		name: '',
		location: '',
		phone: '',
		email: '',
	});
	const apiConfig = useRecoilValue(config);
	// Regex to find initials
	const initials = name
		.match(/(^\S\S?|\b\S)?/g)
		.join('')
		.match(/(^\S|\S$)?/g)
		.join('')
		.toUpperCase();

	async function handleEdit() {
		try {
			if (
				userInfo.name === '' ||
				userInfo.location === '' ||
				userInfo.phone === '' ||
				userInfo.email === ''
			) {
				alert('Please fill in all fields');
			} else {
				const res = await axios.patch(
					'https://recipetohome-api.herokuapp.com/api/v1/users/update',
					{
						userId: id,
						name: userInfo.name,
						location: userInfo.location,
						phone: userInfo.phone,
						email: userInfo.email,
					},
					apiConfig
				);
				if (res.data.success === true) {
					setAuth((prevState) => {
						return {
							...prevState,
							name: userInfo.name,
							location: userInfo.location,
							phone: userInfo.phone,
							email: userInfo.email,
						};
					});
					navigation.navigate('MainProfile');
				} else {
					alert('Error saving data');
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ margin: 5 }}>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={() => {}}>
						<View
							style={{
								height: 100,
								width: 100,
								borderRadius: 15,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<View
									style={{
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Avatar.Text label={initials} size={100} />
									{/* <MaterialCommunityIcons
										name='camera'
										size={35}
										color='brown'
										style={{
											opacity: 0.7,
											alignItems: 'center',
											justifyContent: 'center',
											borderWidth: 1,
											borderColor: '#fff',
											borderRadius: 10,
										}}
									/> */}
								</View>
							</View>
						</View>
					</TouchableOpacity>
					<Text style={{ marginTop: 5, fontSize: 16, fontWeight: 'bold' }}>
						{name}
					</Text>
				</View>
				<View style={styles.action}>
					<FontAwesome name='user-o' size={25} />
					<TextInput
						value={userInfo.name}
						placeholder='Full Name'
						placeholderTextColor='#666666'
						style={styles.textInput}
						autoCorrect={false}
						onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
					/>
				</View>
				<View style={styles.action}>
					<FontAwesome name='envelope-o' size={25} />
					<TextInput
						value={userInfo.email}
						placeholder='Email'
						placeholderTextColor='#666666'
						style={styles.textInput}
						autoCorrect={false}
						keyboardType='email-address'
						onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
					/>
				</View>
				<View style={styles.action}>
					<FontAwesome name='phone' size={25} />
					<TextInput
						value={userInfo.phone}
						placeholder='Phone'
						placeholderTextColor='#666666'
						style={styles.textInput}
						autoCorrect={false}
						keyboardType='numeric'
						onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
					/>
				</View>
				<View style={styles.action}>
					<MaterialCommunityIcons name='map-marker-outline' size={25} />
					<TextInput
						value={userInfo.location}
						placeholder='Location'
						placeholderTextColor='#666666'
						style={styles.textInput}
						autoCorrect={false}
						onChangeText={(text) =>
							setUserInfo({ ...userInfo, location: text })
						}
					/>
				</View>
				<Button
					mode='contained'
					style={{ alignSelf: 'center', width: '50%' }}
					onPress={handleEdit}
				>
					<Text style={{ color: '#fff' }}>Save</Text>
				</Button>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	commandButton: {
		padding: 15,
		borderRadius: 10,
		backgroundColor: '#FF6347',
		alignItems: 'center',
		marginTop: 10,
	},
	panel: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		paddingTop: 20,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
		// shadowColor: '#000000',
		// shadowOffset: {width: 0, height: 0},
		// shadowRadius: 5,
		// shadowOpacity: 0.4,
	},
	header: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#333333',
		shadowOffset: { width: -1, height: -3 },
		shadowRadius: 2,
		shadowOpacity: 0.4,
		// elevation: 5,
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: 'center',
	},
	panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00000040',
		marginBottom: 10,
	},
	panelTitle: {
		fontSize: 27,
		height: 35,
	},
	panelSubtitle: {
		fontSize: 14,
		color: 'gray',
		height: 30,
		marginBottom: 10,
	},
	panelButton: {
		padding: 13,
		borderRadius: 10,
		backgroundColor: '#FF6347',
		alignItems: 'center',
		marginVertical: 7,
	},
	panelButtonTitle: {
		fontSize: 17,
		fontWeight: 'bold',
		color: 'white',
	},
	action: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 5,
		marginLeft: 10,
	},
	actionError: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		paddingBottom: 5,
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -5,
		paddingLeft: 10,
		color: '#05375a',
	},
});

export default EditProfileScreen;
