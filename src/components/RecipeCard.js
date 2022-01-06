import { Dimensions, StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
const width = Dimensions.get('window').width;
const RecipeCard = ({ title, url, servings, onPress = () => {} }) => {
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
				<Text>Servings : {servings}</Text>
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
