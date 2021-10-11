import React from 'react';
import { View, Text } from 'react-native';

const Header = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
      }}
    >
      <Text>Hello World</Text>
      <Text> This is flex row</Text>
    </View>
  );
};

export default Header;
