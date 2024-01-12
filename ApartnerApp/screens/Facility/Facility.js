import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import HomeHeader from './components/homeHeader';
const ApartmentHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default ApartmentHome;
