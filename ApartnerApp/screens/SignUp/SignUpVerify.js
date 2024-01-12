import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {confirmVerifyCodeAction} from './actions/signUp-action';

import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';
import Message from './components/message';
import VerifyForm from './components/verifyForm';
import FooterLinkVerify from './components/footerLinkVerify';

const {width, height} = Dimensions.get('window');

const SignUpVerify = ({
  navigation,
  confirmVerifyCode,
  emailOrMobile,
  emailOrMobileType,
  confirmVerifyCodePending,
  confirmVerifyCodeSuccess,
  confirmVerifyCodeError,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  useEffect(() => {
    if (confirmVerifyCodeSuccess) {
      navigation.navigate('ChangePassword');
    }
  }, [confirmVerifyCodeSuccess, navigation]);

  const confrmOTPcode = otpCode => {
    confirmVerifyCode({verifyCode: otpCode});
  };

  const signInHandler = () => {
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
          <SignInSignUpAppName customColor={'white'} />
          <Message textSecTop={'Your just a'} textSecBottom={'step away'} />
          <VerifyForm
            lable={`Enter the 4 digit OTP code sent to your ${emailOrMobileType}`}
            type={emailOrMobileType}
            emailOrMobile={emailOrMobile}
            confrmOTPcode={confrmOTPcode}
            confirmVerifyCodePending={confirmVerifyCodePending}
            confirmVerifyCodeError={confirmVerifyCodeError}
          />
          <FooterLinkVerify
            signUpLinkNav={'Sign in with password'}
            signIn={signInHandler}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppInitialContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  textSecTop: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 30,
    top: 105,
    left: width * 0.1,
  },
  textSecBottom: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
    fontSize: 44,
    top: 105,
    left: width * 0.1,
  },
  textDot: {
    color: '#4C84FF',
    fontSize: 55,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#182850',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
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

const mapStateToProps = state => ({
  confirmVerifyCodePending: state.signUpState.confirmVerifyCodePending,
  confirmVerifyCodeSuccess: state.signUpState.confirmVerifyCodeSuccess,
  confirmVerifyCodeError: state.signUpState.confirmVerifyCodeError,
  emailOrMobile: state.signUpState.emailOrMobile,
  emailOrMobileType: state.signUpState.emailOrMobileType,
});

const mapDispatchToProps = dispatch => ({
  confirmVerifyCode: payload => dispatch(confirmVerifyCodeAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpVerify);
