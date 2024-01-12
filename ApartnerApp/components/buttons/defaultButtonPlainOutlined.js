import React, {useState} from 'react';
import {
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import ForwardBtn from '../../assets/icons/new_ui/ic_arrow_forward_24px_white.svg';

const {width, height} = Dimensions.get('window');
const DefaultButton = ({submit, title, customStyle, disabled = false}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => submit()}
      style={[styles.buttonContinue, customStyle]}>
      <Text style={styles.textContinue}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContinue: {
    backgroundColor: '#DBEAEF',
    width: width * 0.35,
    height: height * 0.07,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0E9CC9',
    borderWidth: 1.3,
  },
  textContinue: {
    color: '#0E9CC9',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default DefaultButton;
