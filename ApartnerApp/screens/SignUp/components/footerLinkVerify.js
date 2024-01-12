import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const FooterLinkVerify = ({signUpLinkNav, signIn, resendVerifyCode}) => {
  return (
    <React.Fragment>
      <View style={styles.bottomView}>
        <Text style={styles.signuplink}>
          Didn’t receive the code?{' '}
          <Text style={styles.link} onPress={resendVerifyCode}>
            resend
          </Text>
        </Text>
        <View style={styles.signUpEmail}>
          <Text style={styles.link} onPress={signIn}>
            {signUpLinkNav}
          </Text>
        </View>
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
    bottom: 21,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
  },
  signuplink: {
    bottom: 50,
    fontSize: 16,
    color: '#BFBFBF',
    fontFamily: 'Roboto-Regular',
  },
  link: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});

export default FooterLinkVerify;
