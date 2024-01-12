import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import ApartmentSelectionForm from '../../../components/header/signInSignUpAppName';

import WelcomeMessage from './welcomeMessage';
const HomeHeader = () => {
  return (
    <View style={styles.headerView}>
      <ApartmentSelectionForm
        customColor={'white'}
        customTop={50}
        customLeft={25}
        showIcon={true}
        isLogged={false}
        top={40}
      />
      <WelcomeMessage />
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: '15%',
    backgroundColor: '#182850',
  },
});

export default HomeHeader;
