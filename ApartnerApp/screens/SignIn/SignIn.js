import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Text,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';
import {connect} from 'react-redux';
import LoginForm from './components/loginForm';
import FooterLink from './components/footerLink';
// import {callLoginApi} from "./service/login-service";
import {loginAction, signInErrorResetAction} from './actions/signIn-action';
import {resetApartnerAccessLogin} from '../../actions/globle-action';


const {width, height} = Dimensions.get('window');

const SignIn = ({
  navigation,
  callloginAction,
  isLoginSuccess,
  isLoginPending,
  loginError,
  signInErrorReset,
  resetApartnerState,
}) => {
  const [userEmail, setUserEmail] = useState(false);
  const [userPassword, setUserPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginErrorText, setLoginErrorText] = useState('');
  const [enableShift, setEnableShift] = useState(false);

  useEffect(() => {
    signInErrorReset();
  }, [signInErrorReset]);

  useEffect(() => {
    if (isLoginSuccess) {
      resetApartnerState();
      navigation.navigate('AppIntro');
      resetForm(true);
    } else {
      resetForm(false);
    }

    if (loginError) {
      setLoginStatus('failed');
      setLoginErrorText(loginError.message);
    }
  }, [isLoginSuccess, loginError, navigation, resetApartnerState]);

  const resetForm = status => {
    if (status) {
      setUserEmail(false);
      setUserPassword(false);
    }
    // setIsLogin(status);
  };

  const loginHandler = () => {
    if (userEmail && userPassword) {
      setLoginStatus('pending');
      setLoginErrorText('false');

      Keyboard.dismiss();
      callloginAction({
        userName: userEmail,
        password: userPassword,
        type : 'mobile'
      });
    } else {
      setLoginStatus('failed');
      setLoginErrorText('Please type your username and password');
    }
  };

  const navigateToSignUpInt = () => {
    navigation.navigate('SignUpMobile');
  };

  const navigateToPwdChange = () => {
    navigation.navigate('ChangePassword');
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
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
              <View style={styles.page}>
                <View style={styles.bottomContainer}>
                  <SignInSignUpAppName customColor={'white'} />
                  <View style={styles.textContainer}>
                    <Text style={styles.textSecTop}>Login to your</Text>
                    <Text style={styles.textSecBottom}>Community</Text>
                  </View>

                  <LoginForm
                    setUserEmail={setUserEmail}
                    setUserPassword={setUserPassword}
                    loginHandler={loginHandler}
                    loginStatus={loginStatus}
                    loginErrorText={loginErrorText}
                    setEnableShift={setEnableShift}
                    navigateToPwdChange={navigateToPwdChange}
                  />

                  <FooterLink navigateToSignUpInt={navigateToSignUpInt} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppInitialContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingHorizontal: '10%',
  },
  bottomContainer: {
    height: height,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textContainer: {
    height: height * 0.2,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  textSecTop: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 30,
  },
  textSecBottom: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
    fontSize: 40,
    lineHeight: 50,
  },
});

const mapStateToProps = state => ({
  isLoginSuccess: state.signInState.isLoginSuccess,
  isLoginPending: state.signInState.isLoginPending,
  loginError: state.signInState.loginError,
});

const mapDispatchToProps = dispatch => ({
  callloginAction: payload => dispatch(loginAction(payload)),
  signInErrorReset: () => dispatch(signInErrorResetAction()),
  resetApartnerState: () => dispatch(resetApartnerAccessLogin()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
