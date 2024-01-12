import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Notices = () => {
  return (
    <View style={styles.noticeView}>
      <Text style={styles.dateInNotice}>Date 05-June-2020</Text>
      <Text>There will be a water cut from 9am to 2pm.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeView: {
    height: 40,
    paddingTop: 20,
    paddingLeft: 24,
  },
  dateInNotice: {
    fontFamily: 'Roboto-Bold',
  },
});

export default Notices;
