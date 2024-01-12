import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SectionHeader from './sectionHeader';

const ShortCuts = () => {
  return (
    <View style={styles.shortCutsView}>
      <SectionHeader disabled={true} nameNonBold={'Short'} nameBold={'Cuts'} />
    </View>
  );
};

const styles = StyleSheet.create({
  shortCutsView: {
    width: '100%',
    height: '5%',
    backgroundColor: '#F0F0F0',
  },
});

export default ShortCuts;
