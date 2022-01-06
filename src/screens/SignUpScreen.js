import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	View,
	SafeAreaView,
} from 'react-native';
import signup from '../../assets/signup.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomMessage from '../components/CustomMessage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useSetRecoilState } from 'recoil';
import { AuthAtom } from '../stores/atoms';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SignUpScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [message, setMessage] = useState(' ');
	const setAuth = useSetRecoilState(AuthAtom);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	function isEmailValid(str) {
		var lastAtPos = str.lastIndexOf('@');
		var lastDotPos = str.lastIndexOf('.');
		return (
			lastAtPos < lastDotPos &&
			lastAtPos > 0 &&
			str.indexOf('@@') == -1 &&
			lastDotPos > 2 &&
			str.length - lastDotPos > 2
		);
	}

	function onSignupPressed() {
		if (!name) {
			setMessage('Full name is required');
		} else if (!email) {
			setMessage('Email is required');
		} else if (!password || !confirmPassword) {
			setMessage('Password is required');
		} else if (password !== confirmPassword) {
			setMessage(`Passwords do not match`);
		} else if (!isEmailValid(email)) {
			setMessage('Invalid email');
		} else {
			setLoading(true);
			setMessage('');
			axios
				.post(
					'https://recipetohome-api.herokuapp.com/api/auth/register',
					{
						email: email,
						password: password,
						name: name,
						isAdmin: false,
					},
					config
				)
				.then((res) => {
					setLoading(true);
					if (res.data.error) setMessage(res.data.error);
					const storeData = async (auth) => {
						try {
							const jsonValue = JSON.stringify(auth);
							await AsyncStorage.setItem('user', jsonValue);
							// const asyncAuth = await AsyncStorage.getItem('user');
							// console.log(asyncAuth);
						} catch (e) {
							// saving error
						}
					};
					storeData(auth);
					setAuth(() => ({
						token: res.data.token,
						name: res.data.name,
						id: res.data.userId,
						email: res.data.email,
						isAdmin: res.data.isAdmin,
						phone: res.data.phone,
						location: res.data.location,
						wallet: res.data.wallet,
					}));
					setLoading(false);
				})
				.catch((err) => console.log(err))
				.finally(() => {
					setLoading(false);
				});
		}
	}

	return (
		<KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={140}>
			<StatusBar style='dark' />
			<SafeAreaView style={styles.container}>
				<Image source={signup} style={styles.logo} resizeMode='contain' />
				<Text style={styles.title}>Recipe To Home</Text>

				<CustomInput
					iconName='user'
					placeholder='Full Name'
					value={name}
					setValue={setName}
				/>
				<CustomInput
					iconName='mail'
					placeholder='Email'
					value={email}
					setValue={setEmail}
				/>
				<CustomInput
					iconName={secureTextEntry ? 'eye-off' : 'eye'}
					placeholder='Password'
					value={password}
					setValue={setPassword}
					secureTextEntry={secureTextEntry}
					isPassword={true}
					setSecureTextEntry={setSecureTextEntry}
				/>

				<CustomInput
					iconName={secureTextEntry ? 'eye-off' : 'eye'}
					placeholder='Confirm Password'
					value={confirmPassword}
					setValue={setConfirmPassword}
					secureTextEntry={secureTextEntry}
					isPassword={true}
					setSecureTextEntry={setSecureTextEntry}
				/>
				<CustomMessage text={message} setText={setMessage}></CustomMessage>

				<CustomButton
					onPress={onSignupPressed}
					text='Signup'
					loading={loading}
				/>
				<View style={styles.bottomText}>
					<Text
						style={{
							color: '#6E7191',
							fontSize: 16,
							fontFamily: 'Poppins_400Regular',
							letterSpacing: 0.75,
						}}
					>
						Aleady Have an Account?{' '}
					</Text>
					<Text
						style={{
							color: '#5F2EEA',
							fontSize: 16,
							fontFamily: 'Poppins_600SemiBold',
							letterSpacing: 0.75,
						}}
						onPress={() => (loading ? null : navigation.navigate('Login'))}
					>
						Login
					</Text>
				</View>
			</SafeAreaView>
		</KeyboardAwareScrollView>
	);
};
const styles = StyleSheet.create({
	container: {
		padding: 20,
		flex: 1,
		alignItems: 'center',
	},
	logo: {
		width: width * 0.9,
		height: height * 0.2,
		marginTop: height * 0.01,
	},
	title: {
		fontFamily: 'Poppins_700Bold',
		fontSize: 32,
		letterSpacing: 1,
		color: '#5F2EEA',
	},
	bottomText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 14,
	},
});

export default SignUpScreen;
