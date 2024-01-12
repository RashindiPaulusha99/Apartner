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
import RNPickerSelect from 'react-native-picker-select';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from './actions/apartment-action';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import {NativeAppEventEmitter} from 'react-native';

const {width, height} = Dimensions.get('window');
//const [selectedValue, setSelectedValue] = useState('java');

const dataList = [
  {
    title: 'Management Council',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: true,
  },
  {
    title: 'Management Council',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: true,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: true,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: false,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: false,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: false,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: false,
  },
  {
    title: 'Apartner',
    description:
      ' There will be a power cut from 8 am to 5pm on March 6, 2021.Apologies for the inconvenience',
    datetime: '05.35p.m|Today',
    active: false,
  },
];

const renderNotificationItem = () =>
  dataList.map(item => {
    return (
      <View
        style={
          item.active
            ? styles.bottomrowContainer
            : styles.bottomrowfalseContainer
        }>
        <View style={styles.bottommaincontainer}>
          <Text style={styles.bottomrowContentTextone}>{item.title}</Text>
          <Text style={styles.bottomrowContentTexttwo}>{item.datetime}</Text>
        </View>
        <Text style={styles.bottomrowContentTextthree}>{item.description}</Text>
      </View>
    );
  });

const Notifications = ({navigation}) => {
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
          <Text style={styles.title}>Payment Updates</Text>
          <View style={styles.gateUpdateXBDropDown}>
            <RNPickerSelect
              onValueChange={value => console.log(value)}
              items={[{label: 'XB / 10'}]}>
              <Text style={styles.gateUpdateDropText}>XB/01</Text>
            </RNPickerSelect>
          </View>
        </View>
        <View style={styles.subTitleContentContainer}>
          <Text style={styles.subTitleContentText}>
            View all your notifications
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          data={dataList}
          renderItem={renderNotificationItem}
        />
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
  bottomrowContainer: {
    width: 414,
    height: 80,
    backgroundColor: '#EEFAFF',
    marginTop: height * 0.003,
  },
  bottomrowfalseContainer: {
    width: 414,
    height: 80,
    backgroundColor: '#FFF',
    shadowColor: '#00000029',
    marginTop: height * 0.003,
  },
  bottomrowContentTextone: {
    width: 127,
    height: 15,
    color: '#89B2C4',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginTop: height * 0.01,
  },
  bottomrowContentTextthree: {
    width: 382,
    height: 33,
    color: '#4D4D4D',
    marginLeft: height * 0.01,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bottomrowContentTexttwo: {
    width: 95,
    height: 15,
    color: '#89B2C4',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginRight: height * 0.02,
    marginTop: height * 0.01,
  },
  bottommaincontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: height * 0.01,
  },
  gateUpdateXBDropDown: {
    width: 89,
    height: 23,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    marginTop: height * 0.01,
    justifyContent: 'center',
    marginLeft: 10,
  },
  gateUpdateDropText: {
    fontSize: 10,
    color: '#212322',
    fontFamily: 'Poppins-Bold',
    marginLeft: 7,
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
)(Notifications);