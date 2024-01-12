import React from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import BacktBtn from '../../assets/icons/back-icon.svg';

const signInSignUpAppName = ({
  customColor = 'white',
  customTop = 40,
  customLeft = '10%',
  showIcon = false,
}) => {
  return (
    <View style={styles.apartner}>
      <Text
        style={{
          ...styles.textAppName,
          color: customColor,
          top: customTop,
          left: customLeft,
        }}>
        aPartner<Text style={styles.textAppNameDot}>.</Text>
      </Text>
      <Image style={styles.backIcon} source={BacktBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  textAppName: {
    fontFamily: 'Montserrat-Black',
    fontSize: 21,
  },
  textAppNameDot: {
    fontFamily: 'Montserrat-Black',
    color: '#4C84FF',
    fontSize: 21,
    top: 40,
    left: '10%',
  },
  backIcon: {
    marginLeft: '90%',
    height: 20,
    top: 40,
  },
});

export default signInSignUpAppName;
