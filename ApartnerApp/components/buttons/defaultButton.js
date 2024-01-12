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
const DefaultButton = ({submit, title, customStyle}) => {
  return (
    <View style={styles.customStyle}>
      <TouchableOpacity onPress={submit} style={styles.buttonContinue}>
        <Text style={styles.textContinue}>{title}</Text>
        <ForwardBtn style={styles.continueArrow} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContinue: {
    backgroundColor: '#0E9CC9',
    width: width * 0.85,
    height: 50,
    borderRadius: 27.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  continueArrow: {
    position: 'absolute',
    right: width * 0.1,
  },
});

export default DefaultButton;
