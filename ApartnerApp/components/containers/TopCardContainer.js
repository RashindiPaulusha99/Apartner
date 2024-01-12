import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';

const {width, height} = Dimensions.get('window');
const TopCardContainer = ({children, customHeight, customStyle}) => {
  return (
    <View
      style={[
        styles.container,
        {height: customHeight ? customHeight : height * 0.872},
        customStyle && customStyle,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFFDD',
    height: height * 0.872,
    width: '95%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
});

export default TopCardContainer;
