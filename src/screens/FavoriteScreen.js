import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FavoriteScreen = () => {
	return (
		<SafeAreaView
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<Text>This is the favorite Screen</Text>
		</SafeAreaView>
	);
};

export default FavoriteScreen;

const styles = StyleSheet.create({});
