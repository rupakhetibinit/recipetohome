import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import useNavigation from '@react-navigation/native';
const RecipeCard = ({ title, url, onPress = () => {} }) => {
	return (
		<Card
			style={{
				width: 0.9 * width,
				height: 300,
				marginVertical: 10,
			}}
			onPress={onPress}
		>
			<Card.Title title={title} />
			<Card.Cover resizeMode='cover' source={{ uri: url }} />
			<Card.Actions>
				<Button>
					<FontAwesome name='heart' size={25} />
				</Button>
			</Card.Actions>
		</Card>
	);
};

export default RecipeCard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 0.9 * width,
		height: 0.75 * width,
	},
});
