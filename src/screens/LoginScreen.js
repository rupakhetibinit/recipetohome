import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import logo from '../../assets/logo.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { AuthAtom } from '../stores/atoms';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const LoginScreen = ({ navigation }) => {
	function onLogin() {
		return axios.post('https://recipetohome-api.herokuapp.com/api/auth/login', {
			email,
			password,
		});
	}

	const { mutate: handleOnLogin, isLoading } = useMutation(onLogin);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [message, setMessage] = useState('');
	const setAuth = useSetRecoilState(AuthAtom);
	function onLoginPressed() {
		if (!email && !password) {
			setMessage('Email and Password are required');
		} else if (!password) {
			setMessage('Password is required');
		} else if (!email) {
			setMessage('Email is required');
		} else {
			handleOnLogin(
				{
					email,
					password,
				},
				{
					onSuccess: (data) => {
						if (data.data.success === false) {
							setMessage(data.data.message);
						} else {
							console.log(data.data.accessToken);
							AsyncStorage.setItem('token', data.data.accessToken)
								.then(() => {
									setAuth({
										token: data.data.accessToken,
										email: data.data.email,
										id: data.data.userId,
										name: data.data.name,
										isAdmin: data.data.isAdmin,
										location: data.data.location,
										phone: data.data.phone,
										wallet: data.data.wallet,
									});
								})
								.catch((err) => console.log(err));
						}
					},
					onError: () => {
						setMessage('Something Went wrong. Please try again later');
					},
					onSettled: () => {
						setMessage('');
					},
				}
			);
		}
	}

	return (
		<KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={140}>
			<StatusBar style='dark' />
			<View style={styles.container}>
				<Image source={logo} style={styles.logo} resizeMode='contain' />
				<Text style={styles.title}>Recipe To Home</Text>
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
				{message.length > 0 && <Text style={{ color: 'red' }}>{message}</Text>}
				<CustomButton
					onPress={onLoginPressed}
					text='Login'
					loading={isLoading}
				/>
				<View style={styles.bottomText}>
					<Text
						style={{
							color: '#6E7191',
							fontSize: 16,
							fontFamily: 'Poppins_400Regular',
							letterSpacing: 1,
						}}
					>
						Don't have an account?
					</Text>
					<Text
						style={{
							color: '#5F2EEA',
							fontSize: 16,
							fontFamily: 'Poppins_600SemiBold',
							letterSpacing: 1,
						}}
						onPress={() => navigation.navigate('Signup')}
					>
						SignUp
					</Text>
				</View>
			</View>
		</KeyboardAwareScrollView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		width: width * 0.9,
		height: height * 0.3,
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

export default LoginScreen;
