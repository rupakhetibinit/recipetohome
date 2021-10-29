import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const CustomMessage = ({ text, setText }) => {
  useEffect(() => {
    let timer = setTimeout(() => {
      setText(' ');
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [text]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default CustomMessage;

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    flexDirection: 'row',
    width: 0.9 * Dimensions.get('window').width,
  },
  text: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
    letterSpacing: 0.25,
    color: '#ED2E7E',
  },
});
