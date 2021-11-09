import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';

const RecipeScreen = (navigation) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is the recipe screen</Text>
      <CustomButton onPress={() => navigation.navigate('SelectedRecipeScreen')} />
    </View>
  );
};

export default RecipeScreen;

const styles = StyleSheet.create({});
