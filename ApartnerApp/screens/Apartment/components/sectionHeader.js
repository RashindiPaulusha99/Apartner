import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AddIcon from '../../../assets/icons/add.svg';
const SectionHeader = ({
  nameNonBold,
  nameBold,
  containerColor = 'none',
  navigation,
  navPage,
  disabled,
}) => {
  return (
    <View
      style={{...styles.sectionHeaderView, backgroundColor: containerColor}}>
      <Text style={styles.nameNonBold}>
        {nameNonBold} <Text style={styles.nameBold}>{nameBold}</Text>
      </Text>
      <TouchableOpacity
        disabled={disabled ? true : false}
        onPress={() => navigation.navigate(navPage)}>
        <AddIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderView: {
    width: '100%',
    height: 40,
    paddingTop: 10,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameNonBold: {
    fontSize: 18,
    fontFamily: 'Roboto-Light',
  },
  nameBold: {
    fontFamily: 'Roboto-Bold',
  },
});
export default SectionHeader;
