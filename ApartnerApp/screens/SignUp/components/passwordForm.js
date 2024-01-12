import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
const {width, height} = Dimensions.get('window');

const PasswordForm = ({resetPasswordPending, resetPassword}) => {
  const [userPassword, setUserPassword] = useState(null);
  const [confirmPassword, setUserConfirmPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const passwordChangeHandler = () => {
    if (userPassword === confirmPassword) {
      resetPassword({
        userPassword,
      });
    } else {
      setPasswordError('Password and Confirm not match');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputPwdContainer}>
            <Text style={styles.inputLableField}>Password *</Text>
            <Input
              inputContainerStyle={styles.inputContainerField}
              inputStyle={styles.inputField}
              placeholder="Password"
              placeholderTextColor={'gray'}
              lable={'Password *'}
              labelStyle={styles.inputLableField}
              secureTextEntry
              onChangeText={(text) => setUserPassword(text)}
            />
          </View>
          <View style={styles.inputConfirmPwdContainer}>
            <Text style={styles.inputLableField}>Confirm Password *</Text>
            <Input
              inputContainerStyle={styles.inputContainerField}
              inputStyle={styles.inputField}
              placeholder="Confirm Password"
              placeholderTextColor={'gray'}
              lable={'Confirm Password *'}
              labelStyle={styles.inputLableField}
              secureTextEntry
              onChangeText={(text) => setUserConfirmPassword(text)}
            />
          </View>
        </View>

        <View style={styles.passwordWrong}>
          {passwordError && (
            <Text style={styles.passwordWrongText}>{passwordError}</Text>
          )}
        </View>

        <Button
          rounded
          buttonStyle={styles.buttonLogin}
          title={resetPasswordPending ? 'Submiting...' : 'Confirm'}
          onPress={passwordChangeHandler}
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
  inputPwdContainer: {
    top: height * 0.2,
    width: width * 0.8,
    left: width * 0.08,
  },
  inputConfirmPwdContainer: {
    top: height * 0.2,
    left: width * 0.08,
  },

  inputContainerField: {
    width: width * 0.8,
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
    marginLeft: 10,
  },

  passwordWrong: {
    marginTop: height * 0.2,
    marginLeft: width * 0.2,
  },

  passwordWrongText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FF0000',
  },

  buttonContainer: {
    borderRadius: 25,
    marginTop: height * 0.1,
    left: width * 0.1,
    width: width * 0.8,
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

export default PasswordForm;
