import React from 'react';
import {StyleSheet, View} from 'react-native';

const SignInSingUpContainer = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInSingUpContainer;
