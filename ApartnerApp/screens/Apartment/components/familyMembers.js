import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SectionHeader from './sectionHeader';

const FamilyMembers = ({navigation, navPage}) => {
  return (
    <View style={styles.curCommunityView}>
      <SectionHeader
        navPage={navPage}
        navigation={navigation}
        nameNonBold={'Family'}
        nameBold={'Members'}
      />
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

export default FamilyMembers;
