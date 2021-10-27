import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react/cjs/react.development';
import signup from '../../assets/signup.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomMessage from '../components/CustomMessage';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [message, setMessage] = useState(null);
  const onSignupPressed = () => {
    if (!name) {
      setMessage('Full name is required');
    } else if (!email) {
      setMessage('Email is required');
    } else if (!password || !confirmPassword) {
      setMessage('Password is required');
    } else if (password !== confirmPassword) {
      setMessage(`Passwords do not match`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={signup} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Recipe To Home</Text>
      <CustomInput iconName="user" placeholder="Full Name" value={name} setValue={setName} />
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
      <CustomInput
        iconName={secureTextEntry ? 'eye-off' : 'eye'}
        placeholder="Confirm Password"
        value={confirmPassword}
        setValue={setConfirmPassword}
        secureTextEntry={secureTextEntry}
        isPassword={true}
        setSecureTextEntry={setSecureTextEntry}
      />
      <CustomMessage text={message} setText={setMessage}></CustomMessage>
      <CustomButton onPress={onSignupPressed} text="Signup" />
      <View style={styles.bottomText}>
        <Text
          style={{
            color: '#6E7191',
            fontSize: 16,
            fontFamily: 'Poppins_400Regular',
            letterSpacing: 0.75,
          }}
        >
          Aleady Have an Account?{' '}
        </Text>
        <Text
          style={{
            color: '#5F2EEA',
            fontSize: 16,
            fontFamily: 'Poppins_600SemiBold',
            letterSpacing: 0.75,
          }}
          onPress={() => navigation.navigate('Login')}
        >
          Login
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

export default SignUpScreen;
