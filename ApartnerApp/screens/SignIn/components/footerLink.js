import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const FooterLink = ({navigateToSignUpInt}) => {
  return (
    <View style={styles.bottomView}>
      <Text style={styles.signuplink}>
        Don’t have an account?{' '}
        <Text style={styles.link} onPress={navigateToSignUpInt}>
          Sign up here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  signuplink: {
    bottom: 21,
    fontSize: 16,
    color: '#BFBFBF',
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default FooterLink;
