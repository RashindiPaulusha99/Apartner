import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import BacktBtn from '../../assets/icons/back-icon.svg';
const {width, height} = Dimensions.get('window');
const signInSignUpAppName = ({
  customColor,
  backBtn,
  isLogged = false,
  top = 75,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            Platform.OS === 'ios' && !isLogged ? top : StatusBar.currentHeight,
        },
      ]}>
      <Text style={[styles.textAppName, {color: customColor}]}>
        aPartner<Text style={styles.textAppNameDot}>.</Text>
      </Text>
      {backBtn && <BacktBtn />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  textAppName: {
    fontFamily: 'Montserrat-Black',
    fontSize: 21,
    color: 'white',
    lineHeight: 24,
  },
  textAppNameDot: {
    fontFamily: 'Montserrat-Black',
    color: '#4C84FF',
    fontSize: 33,
    lineHeight: 24,
  },
  backIcon: {},
});

export default signInSignUpAppName;
