import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import ApartmentSelectionForm from '../../../components/header/apartnerHomeAppName';
const HomeHeader = () => {
  return (
    <View style={styles.headerView}>
      <ApartmentSelectionForm
        customColor={'white'}
        customTop={20}
        customLeft={'37%'}
        showIcon={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    width: '100%',
    height: '8%',
    backgroundColor: '#182850',
  },
});

export default HomeHeader;
