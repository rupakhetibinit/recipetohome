import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SelectedRecipeScreen = () => {
	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
		>
			<Text>This is the selected recipe screen</Text>
		</SafeAreaView>
	);
};

export default SelectedRecipeScreen;

const styles = StyleSheet.create({});
