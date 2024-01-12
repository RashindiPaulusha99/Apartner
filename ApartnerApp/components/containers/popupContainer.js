import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from '../../assets/images/check_circle_green_24dp.svg';

const {width, height} = Dimensions.get('window');
const PopupContainer = ({navigateToClose, maintitle, subtitle}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Icon />
        <Text style={styles.titlemainContainer}>{maintitle}</Text>
        <Text style={styles.titlesubContainer}>{subtitle}</Text>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={navigateToClose}>
        <Text style={styles.textButtonContainer}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.05,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: '#DBEAEF',
    borderColor: '#0E9CC9',
    height: 42,
    width: 291,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  textButtonContainer: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#0E9CC9',
  },
  titlemainContainer: {
    fontSize: 26,
    fontFamily: 'Roboto-Black',
    color: '#26272C',
  },
  titlesubContainer: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    marginTop: 5,
  },
});

export default PopupContainer;
