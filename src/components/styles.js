import styled from 'styled-components';

import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';

import Constants from 'expo-constants';

const StatusBarHeight = Constants.statusBarHeight;

// Colors

export const Colors = {
	primary: '#ffffff',
	secondary: '#e5e7eb',
	tertiary: '#1f2937',
	darkLight: '#9ca3af',
	brand: '#6d28d9',
	green: '#10b981',
	red: '#ef4444',
	gray: '#6b7280',
	lightGreen: 'rgba(16,185,129,0.1)',
};

const {
	primary,
	secondary,
	tertiary,
	darkLight,
	brand,
	green,
	red,
	gray,
	lightGreen,
} = Colors;

export const StyledContainer = styled.View`
	flex: 1;
	padding: 25px;
	padding-top: ${StatusBarHeight + 30}px;
	background-color: ${primary};
`;

export const StyledButton = styled.TouchableOpacity`
	padding: 15px;
	background-color: ${brand};
	justify-content: center;
	align-items: center;
	border-radius: 5px;
	margin-vertical: 5px;
	height: 60px;

	${(props) =>
		props.google === true &&
		`
  background-color: ${green};
  flex-direction: row;
  justify-content: center;
`}
`;

export const ButtonText = styled.Text`
	color: ${primary};
	font-size: 16px;

	${(props) => props.google == true && `padding-left:25px;`}
`;

export const TopHalf = styled.View`
	flex: 1;
	justify-content: center;
	padding: 20px;
`;

export const IconBg = styled.View`
	width: 250px;
	height: 250px;
	background-color: ${Colors.lightGreen};
	border-radius: 250px;
	justify-content: center;
	align-items: center;
`;

export const BottomHalf = styled(TopHalf)`
	justify-content: space-around;
`;

export const PageTitle = styled.Text`
	font-size: 30px;
	text-align: center;
	font-weight: bold;
	color: ${brand};
	padding: 10px;

	${(props) => props.welcome && `font-size:35px;`}
`;

export const InfoText = styled.Text`
	color: ${Colors.gray};
	font-size: 15px;
	text-align: center;
`;

export const EmphasizeText = styled.Text`
	font-weight: bold;
	font-style: italic;
`;

// Pin input styles

export const CodeInputSection = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	margin-vertical: 30px;
`;

export const HiddenTextInput = styled.TextInput`
	position: absolute;
	width: 1px;
	height: 1px;
	opacity: 0;
`;

export const CodeInputsContainer = styled.Pressable`
	width: 70%;
	flex-direction: row;
	justify-content: space-between;
`;

export const CodeInput = styled.View`
	border-color: ${Colors.lightGreen};
	min-width: 15%;
	border-width: 2px;
	border-radius: 5px;
	padding: 12px;
`;

export const CodeInputText = styled.Text`
	font-size: 22px;
	font-weight: bold;
	text-align: center;
	color: ${Colors.brand};
`;

export const CodeInputFocused = styled(CodeInput)`
	border-color: ${Colors.green};
`;

// Resend Timer Component

export const InlineGroup = styled.View`
	flex-direction: row;
	padding: 10px;
	justify-content: center;
	align-items: center;
`;

export const TextLink = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
`;

export const TextLinkContent = styled.Text`
	color: ${brand};
	font-size: 15px;

	${(props) => {
		const { resendStatus } = props;
		if (resendStatus === 'Failed!') {
			return `color:${Colors.red}`;
		} else if (resendStatus === 'Sent!') {
			return `color:${Colors.green}`;
		}
	}}
`;

// Modal styles
export const ModalContainer = styled(StyledContainer)`
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.7);
`;

export const ModalView = styled.View`
	margin: 20px;
	background-color: white;
	border-radius: 20px;
	padding: 35px;
	align-items: center;
	elevation: 5;
	shadow-color: #000;
	shadow-offset: 0px 2px;
	shadow-opacity: 0.25;
	shadow-radius: 4px;
	width: 100%;
`;
