import React, { useRef, useState, useEffect } from 'react';

import {
	CodeInput,
	CodeInputFocused,
	CodeInputsContainer,
	CodeInputSection,
	CodeInputText,
	HiddenTextInput,
} from './styles';

const CodeInputField = ({ code, setCode, setPinReady, maxLength }) => {
	const codeDigitsArray = new Array(maxLength).fill(0);

	// ref for text input
	const textInputRef = useRef(null);

	// Monitoring input focus
	const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);

	const handleOnBlur = () => {
		setInputContainerIsFocused(false);
	};

	const handleOnPress = () => {
		setInputContainerIsFocused(true);
		textInputRef?.current?.focus();
	};

	useEffect(() => {
		// Toggle submit button state
		setPinReady(code.length === maxLength);
		return () => setPinReady(false);
	}, [code]);

	const toCodeDigitInput = (_value, index) => {
		const emptyInputChar = '';
		const digit = code[index] || emptyInputChar;

		// Formatting for code
		const isCurrentDigit = index === code.length;
		const isLastDigit = index === maxLength - 1;
		const isCodeFull = code.length === maxLength;

		const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

		const StyledCodeInput =
			inputContainerIsFocused && isDigitFocused ? CodeInputFocused : CodeInput;

		return (
			<StyledCodeInput key={index}>
				<CodeInputText>{digit}</CodeInputText>
			</StyledCodeInput>
		);
	};

	return (
		<CodeInputSection>
			<CodeInputsContainer onPress={handleOnPress}>
				{codeDigitsArray.map(toCodeDigitInput)}
			</CodeInputsContainer>
			<HiddenTextInput
				ref={textInputRef}
				value={code}
				onChangeText={setCode}
				onSubmitEditing={handleOnBlur}
				keyboardType='number-pad'
				returnKeyType='done'
				textContentType='oneTimeCode'
				maxLength={maxLength}
			/>
		</CodeInputSection>
	);
};
export default CodeInputField;
