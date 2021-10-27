import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react/cjs/react.development';
import logo from '../../assets/logo.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomMessage from '../components/CustomMessage';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [message, setMessage] = useState(null);
  const onLoginPressed = () => {
    if (!email && !password) {
      setMessage('Email and Password are required');
    } else if (!password) {
      setMessage('Password is required');
    } else if (!email) {
      setMessage('Email is required');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Recipe To Home</Text>
      <CustomInput iconName="mail" placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput
        iconName={secureTextEntry ? 'eye-off' : 'eye'}
        placeholder="Password"
        value={password}
        setValue={setPassword}
        secureTextEntry={secureTextEntry}
        isPassword={true}
        setSecureTextEntry={setSecureTextEntry}
      />
      <CustomMessage text={message} setText={setMessage}></CustomMessage>
      <CustomButton onPress={onLoginPressed} text="Login" />
      <View style={styles.bottomText}>
        <Text
          style={{
            color: '#6E7191',
            fontSize: 16,
            fontFamily: 'Poppins_400Regular',
            letterSpacing: 0.75,
          }}
        >
          Don't Have an Account?{'  '}
        </Text>
        <Text
          style={{
            color: '#5F2EEA',
            fontSize: 16,
            fontFamily: 'Poppins_600SemiBold',
            letterSpacing: 0.75,
          }}
        >
          SignUp
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.9,
    height: height * 0.3,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    letterSpacing: 1,
    color: '#5F2EEA',
  },
  bottomText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
});

export default LoginScreen;
