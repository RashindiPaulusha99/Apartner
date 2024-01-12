import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import {Button, Input} from 'react-native-elements';

const LoginForm = ({navigateToPwdChange}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="Email/Phone"
            placeholderTextColor={'gray'}
            lable={'Password *'}
            labelStyle={styles.inputLableField}
          />
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="Password"
            placeholderTextColor={'gray'}
            lable={'Password *'}
            labelStyle={styles.inputLableField}
            secureTextEntry
          />
        </View>

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
          onPress={navigateToLoginInt}
          titleStyle={styles.buttonLogInTitle}
          containerStyle={styles.buttonContainer}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  inputContainer: {},
  inputContainerField: {
    top: 254,
    width: 350,
    marginLeft: 32,
    borderBottomColor: 'white',
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
  forgetPwd: {
    marginTop: 270,
    marginLeft: 103,
  },
  forgetPwdText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#BFBFBF',
  },
  buttonContainer: {
    borderRadius: 25,
    marginTop: 40,
    marginLeft: 30,
  },
  buttonLogin: {
    width: 350,
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
  },
});

export default LoginForm;
