import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';
import Header from '../components/Header';

export default function Welcome() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="dark" />
      <Header />
      <Text></Text>
    </View>
  );
}
