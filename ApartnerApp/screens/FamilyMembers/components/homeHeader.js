import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import BacktBtn from '../../../assets/icons/back-icon.svg';
import NotificatioBtn from '../../../assets/icons/notification-doorbell.svg';
const {width, height} = Dimensions.get('window');

const HomeHeader = ({backBtn, title, navigation, navPage}) => {
  return (
    <View style={styles.container}>
      {backBtn && (
        <TouchableOpacity onPress={() => navigation.navigate(navPage)}>
          <BacktBtn />
        </TouchableOpacity>
      )}
      <Text style={styles.textAppName}>{title}</Text>
      {NotificatioBtn && <NotificatioBtn />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height * 0.08,
    backgroundColor: '#182850',
    paddingHorizontal: '8%',
  },
  textAppName: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  backIcon: {},
});

export default HomeHeader;
