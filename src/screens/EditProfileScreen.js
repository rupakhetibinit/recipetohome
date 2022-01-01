import React, { useContext } from 'react';
import {
	ImageBackground,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	MaterialCommunityIcons,
	FontAwesome,
	Feather,
} from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
function EditProfileScreen({ navigation }) {
	const { auth, setAuth } = useContext(AuthContext);
	// Regex to find initials
	const initials = auth.name
		.match(/(^\S\S?|\b\S)?/g)
		.join('')
		.match(/(^\S|\S$)?/g)
		.join('')
		.toUpperCase();

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ margin: 20 }}>
				<View style={{ alignItems: 'center' }}>
					<TouchableOpacity onPress={() => {}}>
						<View
							style={{
								height: 100,
								width: 100,
								borderRadius: 15,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<View
									style={{ alignItems: 'center', justifyContent: 'center' }}
								>
									<Avatar.Text label={initials} size={100} />
									{/* <MaterialCommunityIcons
										name='camera'
										size={35}
										color='brown'
										style={{
											opacity: 0.7,
											alignItems: 'center',
											justifyContent: 'center',
											borderWidth: 1,
											borderColor: '#fff',
											borderRadius: 10,
										}}
									/> */}
								</View>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
	commandButton: {
		padding: 15,
		borderRadius: 10,
		backgroundColor: '#FF6347',
		alignItems: 'center',
		marginTop: 10,
	},
	panel: {
		padding: 20,
		backgroundColor: '#FFFFFF',
		paddingTop: 20,
		// borderTopLeftRadius: 20,
		// borderTopRightRadius: 20,
		// shadowColor: '#000000',
		// shadowOffset: {width: 0, height: 0},
		// shadowRadius: 5,
		// shadowOpacity: 0.4,
	},
	header: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#333333',
		shadowOffset: { width: -1, height: -3 },
		shadowRadius: 2,
		shadowOpacity: 0.4,
		// elevation: 5,
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: 'center',
	},
	panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#00000040',
		marginBottom: 10,
	},
	panelTitle: {
		fontSize: 27,
		height: 35,
	},
	panelSubtitle: {
		fontSize: 14,
		color: 'gray',
		height: 30,
		marginBottom: 10,
	},
	panelButton: {
		padding: 13,
		borderRadius: 10,
		backgroundColor: '#FF6347',
		alignItems: 'center',
		marginVertical: 7,
	},
	panelButtonTitle: {
		fontSize: 17,
		fontWeight: 'bold',
		color: 'white',
	},
	action: {
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2',
		paddingBottom: 5,
	},
	actionError: {
		flexDirection: 'row',
		marginTop: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#FF0000',
		paddingBottom: 5,
	},
	textInput: {
		flex: 1,
		marginTop: Platform.OS === 'ios' ? 0 : -12,
		paddingLeft: 10,
		color: '#05375a',
	},
});

export default EditProfileScreen;
