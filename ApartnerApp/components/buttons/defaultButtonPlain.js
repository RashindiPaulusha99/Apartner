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
const DefaultButton = ({submit, title, customStyle,customTextStyle, disabled = false}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => submit()}
      style={[styles.buttonContinue, customStyle]}>
      <Text style={[styles.textContinue ,customTextStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContinue: {
    backgroundColor: '#0E9CC9',
    width: width * 0.35,
    height: height * 0.07,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default DefaultButton;
