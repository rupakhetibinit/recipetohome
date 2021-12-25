import React, { useContext, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import logo from '../../assets/logo.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomMessage from '../components/CustomMessage';
import { AuthContext } from '../context/AuthContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const LoginScreen = ({ navigation }) => {
	const { setAuth } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [message, setMessage] = useState('');
	const onLoginPressed = () => {
		if (!email && !password) {
			setMessage('Email and Password are required');
		} else if (!password) {
			setMessage('Password is required');
		} else if (!email) {
			setMessage('Email is required');
		} else {
			setLoading(true);
			axios
				.post('https://recipetohome-api.herokuapp.com/api/auth/login', {
					email,
					password,
				})
				.then((res) => {
					console.log(res);
					if (res.data.error) setMessage(res.data.error);
					setAuth({
						token: res.data.accessToken,
						name: res.data.name,
						isAdmin: res.data.isAdmin,
						email: res.data.email,
						id: res.data.userId,
					});
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					console.log(err);
					setMessage('Invalid email or password');
				});
		}
	};

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
				<CustomMessage text={message} setText={setMessage} />
				<CustomButton onPress={onLoginPressed} text='Login' loading={loading} />
				<View style={styles.bottomText}>
					<Text
						style={{
							color: '#6E7191',
							fontSize: 16,
							fontFamily: 'Poppins_400Regular',
							letterSpacing: 1,
						}}
					>
						Don't Have an Account?{'  '}
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

// import React from 'react';
// import { View, Text } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const LoginScreen = () => {
// 	return (
// 		<View>
// 			<KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={140}>
// 				<Text>LoginScreen</Text>
// 			</KeyboardAwareScrollView>
// 		</View>
// 	);
// };

// export default LoginScreen;
