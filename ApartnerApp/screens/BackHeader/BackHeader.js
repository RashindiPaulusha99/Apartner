import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from './actions/apartment-action';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import { Title } from 'react-native-paper';

const {width, height} = Dimensions.get('window');
const BackHeader = ({
  navigation,
  Title,
  Description
}) => {
   const navigateToHome = () => {
    navigation.navigate('Home');
  };


      
  return (
    <View style={styles.mainContainer}>
    <View style={styles.topRowContainer}>
      <TouchableOpacity
        onPress={navigateToHome}
        style={styles.BackContainer}>
        <BackImage />
      </TouchableOpacity>
      <Text style={styles.title}>{Title}</Text>
     
     
    </View>
    <View style={styles.subTitleContentContainer}>
        <Text style={styles.subTitleContentText}>
        {Description}
        </Text>
     </View>
   </View>
  );
};

const styles = StyleSheet.create({

  backgroundImageContainer: {
    // flex: 1,
    // justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },

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
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),

  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BackHeader);
