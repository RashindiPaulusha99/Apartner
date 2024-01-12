import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Message = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.textSecTop}>Carry out your due payments online!</Text>
      <Text style={styles.textSecBottom}>
        You and your loved ones can perform due online payments any time
        anywhere on the go.
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '72%',
    flex: 1,
    top: 20,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  textSecTop: {
    fontFamily: 'Roboto-Bold',
    color: '#182850',
    fontSize: 18,
  },
  textSecBottom: {
    fontFamily: 'Roboto-Regular',
    color: '#6B7BA2',
    fontSize: 14,
    textAlign: 'center',
    top: 20,
  },
});
export default Message;
