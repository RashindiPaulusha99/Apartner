import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const FooterLink = ({navigateToApartmentSelection}) => {
  return (
    <View style={styles.bottomView}>
      <Text style={styles.link} onPress={navigateToApartmentSelection}>
        Skip and proceed
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
    bottom: 40,
  },
  link: {
    fontFamily: 'Roboto-Regular',
    color: '#6B7BA2',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default FooterLink;
