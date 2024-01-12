import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, KeyboardAvoidingView,Dimensions,View,Text,TextInput} from 'react-native';
import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';

import Message from './components/message';
import Form from './components/form';
import FooterLink from './components/footerLink';

const {width, height} = Dimensions.get('window');


const SignUpMobile = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);

  const changeSignUpMethod = () => {
    navigation.navigate('SignUpEmail');
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
          <Message textSecTop={'Sign up with'} textSecBottom={'mobile'} />
          <Form
            setEnableShift={setEnableShift}
            lable={'Your mobile number'}
            type={'Mobile'}
          />
          <FooterLink
            signUpLinkNav={'Signup with email'}
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
  inputNameContainer: {
    // maxWidth: 320,
    width: '100%',
    lineHeight:40,
    justifyContent: 'flex-start',
  },
  inputNameContainer: {
    // maxWidth: 320,
    width: '100%',

    justifyContent: 'flex-start',
  },
  inputLableField: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
    fontSize: 16,
  },
  inputContainerField: {
    // maxWidth: 310,
    width: '100%',
    borderBottomColor: 'white',
    justifyContent: 'flex-start',
  },
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  formContainer: {
    height: height * 0.6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
});

export default SignUpMobile;
