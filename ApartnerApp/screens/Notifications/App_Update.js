import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';

const {width, height} = Dimensions.get('window');

const App_Updates = ({navigation}) => {
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.topRowContainer}>
          <TouchableOpacity
            onPress={navigateToHome}
            style={styles.BackContainer}>
            <BackImage />
          </TouchableOpacity>
          <Text style={styles.title}>App Update</Text>
        </View>
        <View style={styles.subTitleContentContainer}>
          <Text style={styles.subTitleContentText}>Apartner</Text>
        </View>
        <View>
          <Text style={styles.bottomrowContentTextone}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s,
          </Text>
        </View>
        <View>
          <Text style={styles.bottomrowContentTextthree}>Date</Text>
          <Text style={styles.bottomrowContentTexttwo}>
            March 1, 2021 ; 05.50 PM
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  BackContainer: {
    marginTop: height * 0.01,
    marginLeft: width * 0.03,
    width: 20,
  },
  mainContainer: {
    marginTop: width * 0.14,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
  },
  subTitleContentContainer: {
    marginLeft: width * 0.09,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },

  bottomrowContentTextone: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: height * 0.01,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
  },
  bottomrowContentTextthree: {
    marginLeft: height * 0.01,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginTop: height * 0.02,
    marginLeft: width * 0.1,
  },
  bottomrowContentTexttwo: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: height * 0.01,
    marginLeft: width * 0.1,
  },
});

export default connect()(App_Updates);
