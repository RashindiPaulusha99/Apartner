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
import {Button} from 'react-native-elements';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const {width, height} = Dimensions.get('window');

const VerifyForm = ({
  lable,
  type,
  emailOrMobile,
  confrmOTPcode,
  confirmVerifyCodePending,
  confirmVerifyCodeError,
}) => {
  const [otpCode, setOtpCode] = useState(null);
  const onSubmitHandler = () => {
    confrmOTPcode(otpCode);
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputTextFieldContainer}>
            <Text style={styles.inputLableField}>{lable}</Text>
            <Text style={styles.inputLableFieldBottom}>
              {type}{' '}
              <Text style={styles.inputLableFieldHiglight}>
                {emailOrMobile}
              </Text>
            </Text>
            <OTPInputView
              style={styles.otpInput}
              pinCount={4}
              secureTextEntry={true}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {
                setOtpCode(code);
              }}
            />
            <Text style={styles.inputLableFieldExpire}>
              Code expires in{' '}
              <Text style={styles.inputLableFieldHiglight}>30 Seconds</Text>
            </Text>
          </View>
        </View>
        <View style={styles.confirmVerifyError}>
          {confirmVerifyCodeError && (
            <Text style={styles.confirmVerifyErrorText}>
              Verify code not match
            </Text>
          )}
        </View>
        <Button
          rounded
          buttonStyle={styles.buttonSubmit}
          title={confirmVerifyCodePending ? 'Processing...' : 'Proceed'}
          titleStyle={styles.buttonSubmitTitle}
          containerStyle={styles.buttonContainer}
          onPress={onSubmitHandler}
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
  inputTextFieldContainer: {
    top: height * 0.25,
    marginLeft: width * 0.08,
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
  inputLableFieldBottom: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  inputLableFieldHiglight: {
    fontFamily: 'Roboto-Regular',
    color: '#F2B01C',
  },
  inputLableFieldExpire: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
    fontSize: 14,
    marginLeft: width * 0.2,
    marginBottom: 10,
  },
  confirmVerifyError: {
    marginTop: height * 0.25,
    marginLeft: width * 0.2,
  },
  confirmVerifyErrorText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#FF0000',
  },
  buttonContainer: {
    borderRadius: 25,
    marginTop: height * 0.02,
    marginLeft: width * 0.08,
  },
  buttonSubmit: {
    width: width * 0.85,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#4C84FF',
    borderRadius: 25,
  },
  buttonSubmitTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  otpInput: {
    width: width * 0.85,
    height: 150,
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  borderStyleBase: {
    width: width * 0.17,
    height: 80,
  },

  borderStyleHighLighted: {
    fontSize: 30,
    color: '#FFFFFF',
  },

  underlineStyleBase: {
    width: width * 0.17,
    height: 80,
    borderWidth: 0,
    fontSize: 30,
    borderBottomWidth: 2,
  },

  underlineStyleHighLighted: {
    borderColor: '#4C84FF',
  },
});

export default VerifyForm;
