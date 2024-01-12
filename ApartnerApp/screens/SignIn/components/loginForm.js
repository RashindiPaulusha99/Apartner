import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import SnackBar from 'react-native-snackbar-component';
const {width, height} = Dimensions.get('window');
const LoginForm = ({
  setUserEmail,
  setUserPassword,
  loginHandler,
  loginStatus,
  loginErrorText,
  setEnableShift,
  navigateToPwdChange,
}) => {
  const [loginNotificationDisplay, setLoginNotificationDisplay] = useState(
    false,
  );

  useEffect(() => {
    if (loginStatus == 'failed') {
      setLoginNotificationDisplay(true);
      setTimeout(() => {
        setLoginNotificationDisplay(false);
      }, 5000);
    }
  }, [loginStatus]);

  const userLogin = () => {
    loginHandler();
  };
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <View style={styles.inputNameContainer}>
          <Text style={styles.inputLableField}>
            Your email ID or mobile number *
          </Text>
          <Input
            containerStyle={styles.inputMainContainer}
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            onFocus={() => setEnableShift(true)}
            placeholder="Email/Phone"
            placeholderTextColor={'gray'}
            lable={'Your email ID or mobile number *'}
            labelStyle={styles.inputLableField}
            onChangeText={text => {
              setUserEmail(text != '' ? text : false);
            }}
          />
        </View>

        <View style={styles.inputPwdContainer}>
          <Text style={styles.inputLableField}>Password *</Text>
          <Input
            containerStyle={styles.inputMainContainer}
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="Password"
            placeholderTextColor={'gray'}
            lable={'Password *'}
            labelStyle={styles.inputLableField}
            onFocus={() => setEnableShift(true)}
            secureTextEntry
            onChangeText={text => {
              setUserPassword(text != '' ? text : false);
            }}
          />
        </View>
      </View>

      <SnackBar
        visible={loginNotificationDisplay}
        textMessage={loginErrorText}
        backgroundColor="#FF6584"
        position="bottom"
      />

      <View style={styles.forgetPwd}>
        <Text style={styles.forgetPwdText}>
          Forgot Password?{' '}
          <Text style={styles.link} onPress={navigateToPwdChange}>
            Reset here
          </Text>
        </Text>
      </View>

      <Button
        rounded
        buttonStyle={styles.buttonLogin}
        title="Log In"
        onPress={userLogin}
        titleStyle={styles.buttonLogInTitle}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    height: height * 0.6,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  container: {
    height: '100%',
    flexDirection: 'column',
  },
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  inputNameContainer: {
    // maxWidth: 320,
    width: '100%',

    justifyContent: 'flex-start',
  },
  inputPwdContainer: {
    // maxWidth: 320,
    width: '100%',
  },
  inputContainerField: {
    // maxWidth: 310,
    width: '100%',
    borderBottomColor: 'white',
    justifyContent: 'flex-start',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'Roboto-Bold',
    color: 'white',
    fontSize: 16,
  },
  inputLableField: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
    fontSize: 16,
  },
  loginErrorLableField: {
    fontFamily: 'Roboto-Regular',
    color: 'red',
    fontSize: 12,
  },
  forgetPwd: {},
  forgetPwdText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#BFBFBF',
  },
  buttonContainer: {
    borderRadius: 25,
    marginTop: 40,
    maxWidth: 320,
    width: '100%',
  },
  buttonLogin: {
    height: 50,
    alignItems: 'center',
    backgroundColor: '#4C84FF',
    borderRadius: 25,
  },
  buttonLogInTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default LoginForm;
