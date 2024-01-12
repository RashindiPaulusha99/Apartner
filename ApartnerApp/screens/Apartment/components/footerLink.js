import React, {useState} from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const FooterLink = () => {
  const [checkedState, setCheckedState] = useState(true);
  return (
    <View style={styles.bottomView}>
      <Text style={styles.link} onPress={() => Linking.openURL('')}>
        {/* <CheckBox disabled={false} value={checkedState} /> */}
        Remember my selection
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
  },
  link: {
    fontFamily: 'Roboto-Regular',
    color: '#6B7BA2',
    fontSize: 12,
  },
});

export default FooterLink;
