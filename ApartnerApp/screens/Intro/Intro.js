import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';

import Message from './components/message';
import FooterLink from './components/footerLink';
import ImageSection from './components/imageSection';

const Intro = ({navigation}) => {
  const navigateToApartmentSelection = () => {
    navigation.navigate('ApartmentSelection');
  };
  return (
    <SafeAreaView style={styles.container}>
      <SignInSignUpAppName customColor={'black'} isLogged={true} />
      <ImageSection />
      <Message />
      <FooterLink navigateToApartmentSelection={navigateToApartmentSelection} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
});

export default Intro;
