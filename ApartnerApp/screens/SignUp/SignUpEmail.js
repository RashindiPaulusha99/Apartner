import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, KeyboardAvoidingView,Dimensions} from 'react-native';
import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';
import Message from './components/message';
import Form from './components/form';
import FooterLink from './components/footerLink';
const {width, height} = Dimensions.get('window');


const SignUpEmail = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);
  const changeSignUpMethod = () => {
    navigation.navigate('SignUpMobile');
  };

  const navigateToSignInInt = () => {
    navigation.navigate('SignIn');
  };
  return (
    <AppInitialContainer>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={enableShift}
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: () => 0,
            android: () => height * 0.1,
          })()}>
          <SignInSignUpAppName customColor={'white'} isLogged={true} />
          <Message textSecTop={'Sign up with'} textSecBottom={'email'} />
          <Form
            setEnableShift={setEnableShift}
            lable={'Your email'}
            type={'Email'}
          />
          <FooterLink
            signUpLinkNav={'Signup with mobile'}
            changeSignUpMethod={changeSignUpMethod}
            navigateToSignInInt={navigateToSignInInt}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppInitialContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#182850',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  textSecTop: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 30,
    top: 105,
    left: '10%',
  },
  textSecBottom: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
    fontSize: 44,
    top: 105,
    left: '10%',
  },
  textDot: {
    color: '#4C84FF',
    fontSize: 55,
  },
  bottomView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

export default SignUpEmail;
