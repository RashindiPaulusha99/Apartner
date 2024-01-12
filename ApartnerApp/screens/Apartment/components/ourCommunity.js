import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SectionHeader from './sectionHeader';

const OurCommunity = () => {
  return (
    <View style={styles.curCommunityView}>
      <SectionHeader disabled={true} nameNonBold={'Our'} nameBold={'Community'} />
    </View>
  );
};

const styles = StyleSheet.create({
  curCommunityView: {
    width: '100%',
    marginTop: 10,
    height: 50,
    backgroundColor: '#F0F0F0',
  },
});

export default OurCommunity;
