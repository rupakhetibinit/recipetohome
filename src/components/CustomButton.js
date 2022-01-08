import React from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	Pressable,
	ActivityIndicator,
} from 'react-native';

const CustomButton = ({ onPress, text, loading }) => {
	return (
		<Pressable
			onPress={onPress}
			android_ripple={{
				color: '#2A00A2',
				borderless: false,
				radius: 0.4 * Dimensions.get('window').width,
				foreground: false,
			}}
			style={styles.container}
		>
			{loading ? (
				<ActivityIndicator animating={loading} size='large' color='#fff' />
			) : (
				<Text style={styles.text}>{text}</Text>
			)}
		</Pressable>
	);
};

export default CustomButton;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#5F2EEA',
		width: 0.85 * Dimensions.get('window').width,
		padding: 15,
		marginTop: 11,
		height: 64,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 16,
	},
	text: {
		color: '#F7F7FC',
		fontFamily: 'Poppins_600SemiBold',
		fontSize: 16,
	},
});
