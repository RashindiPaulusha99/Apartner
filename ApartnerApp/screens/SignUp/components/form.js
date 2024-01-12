import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {Button, Input} from 'react-native-elements';

const Form = ({lable, type, setEnableShift}) => {
  const navigateToLoginInt = () => {};
  return (
    <React.Fragment>
      <View style={styles.inputContainer}>
        <View style={styles.inputTextFieldContainer}>
          <Text style={styles.inputLableField}>{lable}</Text>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder={type}
            placeholderTextColor={'gray'}
            lable={lable}
            labelStyle={styles.inputLableField}
            onFocus={() => setEnableShift(false)}
          />
        </View>
      </View>

      <Button
        rounded
        buttonStyle={styles.buttonSubmit}
        title="Proceed"
        onPress={navigateToLoginInt}
        titleStyle={styles.buttonSubmitTitle}
        containerStyle={styles.buttonContainer}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  inputTextFieldContainer: {
    top: 150,
    width: 320,
    marginLeft: 32,
  },
  inputContainerField: {
    width: 320,
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
    marginTop: 250,
    marginLeft: '8%',
    width: '84%',
    alignItems: 'center',
  },
  buttonSubmit: {
    width: 350,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#4C84FF',
    borderRadius: 25,
  },
  buttonSubmitTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default Form;
