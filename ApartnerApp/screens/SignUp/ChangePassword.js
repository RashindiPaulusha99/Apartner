import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import {resetPasswordAction} from './actions/signUp-action';

import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';
import Message from './components/message';
import PasswordForm from './components/passwordForm';

const {width, height} = Dimensions.get('window');

const ChangePassword = ({
  navigation,
  resetPasswordPending,
  resetPasswordSuccess,
  resetPasswordError,
  resetPassword,
  signUpUserId,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  useEffect(() => {
    if (resetPasswordSuccess) {
      navigation.navigate('SignIn');
    }
  }, [resetPasswordSuccess, navigation]);

  const resetPasswordData = data => {
    resetPassword({...data, userId: signUpUserId});
  };

  return (
    <AppInitialContainer>
      <SafeAreaView style={{flex: 1},{width:width},{height:height}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={enableShift}
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: () => 0,
            android: () => height * 0.1,
          })()}>
          <SignInSignUpAppName customColor={'white'} />
          <Message textSecTop={'Set your'} textSecBottom={'new password'} />
          <PasswordForm
            resetPasswordPending={resetPasswordPending}
            resetPasswordError={resetPasswordError}
            resetPassword={resetPasswordData}
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
  resetPasswordPending: state.signUpState.resetPasswordPending,
  resetPasswordSuccess: state.signUpState.resetPasswordSuccess,
  resetPasswordError: state.signUpState.resetPasswordError,
  signUpUserId: state.signUpState.signUpUserId,
});

const mapDispatchToProps = dispatch => ({
  resetPassword: payload => dispatch(resetPasswordAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePassword);
