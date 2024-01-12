import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Message = ({textSecTop, textSecBottom}) => {
  return (
    <View>
      <Text style={styles.textSecTop}>{textSecTop}</Text>
      <Text style={styles.textSecBottom}>{textSecBottom}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  textSecTop: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 30,
    top: 105,
    left: '10%',
  },
  textSecBottom: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
    fontSize: 44,
    top: 105,
    left: '10%',
  },
  textDot: {
    color: '#4C84FF',
    fontSize: 55,
  },
});
export default Message;
