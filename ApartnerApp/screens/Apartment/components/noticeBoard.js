import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SectionHeader from './sectionHeader';
import Notices from './notices';

const NoticeBoard = () => {
  return (
    <View style={styles.noticeBoardView}>
      <SectionHeader
        disabled={true}
        nameNonBold={'Community'}
        nameBold={'Noticeboard'}
        containerColor={'#E2FFD9'}
      />
      <Notices />
    </View>
  );
};

const styles = StyleSheet.create({
  noticeBoardView: {
    width: '100%',
    height: '16%',
    backgroundColor: '#D4FAC8',
  },
});

export default NoticeBoard;
