import React from 'react';
import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
const width = Dimensions.get('window').width;

const CustomInput = ({
	iconName,
	placeholder,
	value,
	setValue,
	secureTextEntry,
	setSecureTextEntry,
	isPassword = false,
	...props
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const hidePasswordToggle = () => {
		setSecureTextEntry(!secureTextEntry);
	};
	return (
		<View>
			<Text style={styles.placeholder}>{placeholder}</Text>
			<View
				style={[
					styles.container,
					{ borderColor: isFocused ? '#5F2EEA' : 'white' },
					{ backgroundColor: isFocused ? 'white' : '#EFF0F6' },
				]}
			>
				<View style={styles.inputSection}>
					<Feather
						name={iconName}
						size={24}
						color='#A0A3BD'
						onPress={isPassword ? hidePasswordToggle : null}
					/>
					<TextInput
						style={styles.input}
						value={value}
						onChangeText={(value) => setValue(value)}
						secureTextEntry={secureTextEntry}
						onBlur={() => setIsFocused(false)}
						onFocus={() => setIsFocused(true)}
						keyboardType={isPassword ? 'default' : 'email-address'}
						caretHidden={false}
						{...props}
					></TextInput>
				</View>
			</View>
		</View>
	);
};

export default CustomInput;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#EFF0F6',
		width: 0.9 * width,
		height: 64,

		paddingHorizontal: 10,
		marginVertical: 5,
		borderRadius: 16,
		borderWidth: 1,
	},
	inputSection: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 11,
	},
	input: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 5,
		fontFamily: 'Poppins_400Regular',
		letterSpacing: 0.75,
		color: '#14142B',
		fontSize: 16,
	},
	placeholder: {
		fontFamily: 'Poppins_500Medium',
		color: '#6E7191',
		fontSize: 14,
	},
});
