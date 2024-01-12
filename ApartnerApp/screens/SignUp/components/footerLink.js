import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const FooterLink = ({
  signUpLinkNav,
  changeSignUpMethod,
  navigateToSignInInt,
}) => {
  return (
    <React.Fragment>
      <View style={styles.bottomView}>
        <View style={styles.signUpEmail}>
          <Text style={styles.link} onPress={changeSignUpMethod}>
            {signUpLinkNav}
          </Text>
        </View>
        <Text style={styles.signuplink}>
          Have an account?{' '}
          <Text style={styles.link} onPress={navigateToSignInInt}>
            Log in here
          </Text>
        </Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  signUpEmail: {
    bottom: 50,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
  },
  signuplink: {
    bottom: 21,
    fontSize: 16,
    color: '#BFBFBF',
    fontFamily: 'Roboto-Regular',
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default FooterLink;
