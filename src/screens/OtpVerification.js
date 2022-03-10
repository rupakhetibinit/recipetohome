import { StyleSheet, Text, View } from 'react-native';
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
const OtpVerification = () => {
	const [code, setCode] = useState('');
	const [pinReady, setPinReady] = useState(false);

	// Verification button
	const [verifying, setVerifying] = useState(false);

	const MAX_CODE_LENGTH = 4;

	// Modal
	const [modalVisible, setModalVisible] = useState(false);
	const [verificationSuccessful, SetVerificationSuccessful] = useState(false);
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
	const persistLoginAfterOTPVerification = async () => {};

	useEffect(() => {
		triggerTimer();
		return () => {
			clearInterval(resendTimerInterval);
		};
	}, []);

	const resendEmail = async () => {};

	const submitOTPVerification = () => {};

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
						<EmphasizeText> testmail@gmail.com</EmphasizeText>
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
							<ActivityIndicator size={large} color={primary} />
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
