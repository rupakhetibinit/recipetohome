import { StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import {
	BottomHalf,
	IconBg,
	StyledContainer,
	TopHalf,
	Colors,
	PageTitle,
	EmphasizeText,
	InfoText,
	StyledButton,
	ButtonText,
} from '../components/styles';
// Colors
const { brand, green, primary, lightGreen, gray } = Colors;
// Icon
import { Ionicons, Octicons } from '@expo/vector-icons';
import CodeInputField from '../components/CodeInputField';
import ResendTimer from '../components/ResendTimer';
// Verification Modal
import VerificationModal from '../components/VerificationModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useSetRecoilState } from 'recoil';
import { AuthAtom } from '../stores/atoms';
// For saving key in securestore
async function save(key, value) {
	try {
		await SecureStore.setItemAsync(key, value);
	} catch (e) {
		console.log(e);
	}
}
const OtpVerification = ({ route, navigation }) => {
	useEffect(() => {
		navigation.addListener('beforeRemove', (e) => {
			e.preventDefault();
			alert('Please fill out the required fields');
		});
	}, []);
	const setAuth = useSetRecoilState(AuthAtom);
	const [code, setCode] = useState('');
	const [pinReady, setPinReady] = useState(false);
	const [response, setResponse] = useState(null);
	const { email } = route.params;
	// Verification button
	const [verifying, setVerifying] = useState(false);
	const MAX_CODE_LENGTH = 4;

	// Modal
	const [modalVisible, setModalVisible] = useState(false);
	const [verificationSuccessful, setVerificationSuccessful] = useState(false);
	const [requestMessage, setRequestMessage] = useState('');
	// Resend Code Timer
	const [timeLeft, setTimeLeft] = useState(null);
	const [targetTime, setTargetTime] = useState(null);
	const [activeResend, setActiveResend] = useState(false);

	const [resendingEmail, setResendingEmail] = useState(false);
	const [resendStatus, setResendStatus] = useState('Resend');

	const triggerTimer = (targetTimeInSeconds = 30) => {
		setTargetTime(targetTimeInSeconds);
		setActiveResend(false);
		const finalTime = +new Date() + targetTimeInSeconds * 1000;
		setInterval(() => calculateTimeLeft(finalTime), 1000);
	};

	let resendTimerInterval;
	const calculateTimeLeft = (finalTime) => {
		const difference = finalTime - +new Date();
		if (difference >= 0) {
			setTimeLeft(Math.round(difference / 1000));
		} else {
			clearInterval(resendTimerInterval);
			setActiveResend(true);
			setTimeLeft(null);
		}
	};

	// Persisting Login after verification
	const persistLoginAfterOTPVerification = async () => {
		try {
			console.log('this is persist', response);
			await save('token', response.data.token);
			setAuth(() => ({
				token: response.data.token,
				email: response.data.email,
				id: response.data.userId,
				name: response.data.name,
				isAdmin: response.data.isAdmin,
				location: response.data.location,
				phone: response.data.phone,
				wallet: response.data.wallet,
				verified: response.data.verified,
			}));
			console.log('saved');
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		triggerTimer();
		return () => {
			clearInterval(resendTimerInterval);
		};
	}, []);

	const resendEmail = async () => {
		try {
			const res = await axios.post(
				'https://recipetohome-api.herokuapp.com/api/auth/resend',
				{ email: email }
			);
		} catch (error) {
			console.log(error);
		}
	};

	const submitOTPVerification = async () => {
		try {
			setVerifying(true);
			const res = await axios.post(
				'https://recipetohome-api.herokuapp.com/api/auth/token',
				{ token: parseInt(code), email }
			);
			setResponse(res);
			if (res.data.success === false) {
				setVerificationSuccessful(false);
				setModalVisible(true);
			} else if (res.data.success === true) {
				setVerificationSuccessful(true);
				setModalVisible(true);
			}
			console.log(response.data);
		} catch (error) {
			if (error.message.includes('403')) {
				setVerificationSuccessful(false);
				setModalVisible(true);
			}
		} finally {
			setVerifying(false);
		}
	};

	return (
		<KeyboardAvoidingWrapper>
			<StyledContainer style={{ alignItems: 'center' }}>
				<TopHalf>
					<IconBg>
						<StatusBar style='dark' />
						<Octicons name='lock' size={125} color={brand} />
					</IconBg>
				</TopHalf>
				<BottomHalf>
					<PageTitle style={{ fontSize: 25 }}>Account Verification</PageTitle>
					<InfoText>
						Please enter the 4-digit code sent to
						<EmphasizeText> {email}</EmphasizeText>
					</InfoText>
					<CodeInputField
						setPinReady={setPinReady}
						code={code}
						setCode={setCode}
						maxLength={MAX_CODE_LENGTH}
					/>

					{!verifying && pinReady && (
						<StyledButton
							style={{ backgroundColor: green, flexDirection: 'row' }}
							onPress={submitOTPVerification}
						>
							<ButtonText>Verify </ButtonText>
							<Ionicons name='checkmark-circle' size={25} color={primary} />
						</StyledButton>
					)}

					{!verifying && !pinReady && (
						<StyledButton
							style={{ backgroundColor: lightGreen, flexDirection: 'row' }}
							disabled={true}
						>
							<ButtonText style={{ color: gray }}>Verify </ButtonText>
							<Ionicons name='checkmark-circle' size={25} color={gray} />
						</StyledButton>
					)}

					{verifying && (
						<StyledButton
							style={{ backgroundColor: lightGreen, flexDirection: 'row' }}
							disabled={true}
						>
							<ButtonText style={{ color: gray }}>Verify </ButtonText>
							<ActivityIndicator size='large' color={primary} />
						</StyledButton>
					)}

					<ResendTimer
						activeResend={activeResend}
						resendingEmail={resendingEmail}
						resendStatus={resendStatus}
						timeLeft={timeLeft}
						targetTime={targetTime}
						resendEmail={resendEmail}
					/>
				</BottomHalf>
				<VerificationModal
					successful={verificationSuccessful}
					setModalVisible={setModalVisible}
					modalVisible={modalVisible}
					persistLoginAfterOTPVerification={persistLoginAfterOTPVerification}
				/>
			</StyledContainer>
		</KeyboardAvoidingWrapper>
	);
};

export default OtpVerification;

const styles = StyleSheet.create({});
