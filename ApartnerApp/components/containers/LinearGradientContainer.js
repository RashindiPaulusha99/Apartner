import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LinearGradientContainer = ({children, styles, colors}) => {
  return (
    <LinearGradient colors={colors} style={styles}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientContainer;
