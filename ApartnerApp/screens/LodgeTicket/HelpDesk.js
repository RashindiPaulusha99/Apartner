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

import LinearGradientContainer from '../../components/containers/LinearGradientContainer';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';

import ForwardArrow from '../../assets/icons/ionic-ios-arrow-forward-grey.svg';

const {width, height} = Dimensions.get('window');
const BookingFacility = ({
  navigation,
  apartmentFacilityDataItems,
  selectedUnit,
}) => {
  const [selectedFacility, setSelectedFacility] = useState('Swimming Pools');
  const [selectedTab, setSelectedTab] = useState(2);
  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const apartmentFacilityData = [
    {
      key: 1,
      name: 'Water Leakage',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 2,
      name: 'Wash Basin Clogged',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 3,
      name: 'Water Leak',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 4,
      name: 'Water Leakage',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 5,
      name: 'Wash Basin Clogged',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 6,
      name: 'Water Leakage',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
    {
      key: 7,
      name: 'Water Leakage',
      id: 'CID-1234',
      date_lodged: '2021-03-07T15:46:10.000Z',
      date_resloved: '2021-03-07T15:46:10.000Z',
    },
  ];

  const openTicketItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => selectedFacilityHandler(item)}
      key={i}
      // onPress={() => setSelectedApartmentComplex(item)}
      style={styles.tileListingContainer}>
      <View style={styles.tileLeftSide}>
        <Text style={styles.tileIdText}>{item.id}</Text>
      </View>
      <View style={styles.tileRightSide}>
        <ForwardArrow height={30} width={16} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundImageContainer}>
        <StatusBar
          translucent
          animated={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={styles.mainContainer}>
          <View style={styles.topRowContainer}>
            <View style={styles.titleContainer}>
              <TouchableOpacity
                onPress={navigateToHome}
                style={styles.BackContainer}>
                <BackImage width={30} height={30} />
              </TouchableOpacity>
              <View style={styles.titleRightContainer}>
                <Text style={styles.title}>Help Desk</Text>
                <Text style={styles.subTitleContentText}>
                  12 Facilities available for booking
                </Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>
                    {selectedUnit.unit_name
                      ? selectedUnit.unit_name
                      : 'All Units'}
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.linkText}>Change Unit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.tabBox}>
              <View style={styles.tabButton}>
                <TouchableOpacity
                  onPress={() => setSelectedTab(1)}
                  style={[
                    styles.leftTab,
                    selectedTab === 1 && styles.selectedTabContainer,
                  ]}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      selectedTab === 1 && styles.selectedTabBtnText,
                    ]}>
                    Open Tickets
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab(2)}
                  style={[
                    styles.rightTab,
                    selectedTab === 2 && styles.selectedTabContainer,
                  ]}>
                  <Text
                    style={[
                      styles.tabBtnText,
                      selectedTab === 2 && styles.selectedTabBtnText,
                    ]}>
                    Resolved
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tileContainer}>
                {selectedTab === 2 && (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={apartmentFacilityData}
                    renderItem={openTicketItem}
                    keyExtractor={item => item.recreational_location_id}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  bgImage: {
    resizeMode: 'stretch',
  },
  BackContainer: {
    // backgroundColor: 'red',
    width: 20,
    // height: 30,
  },
  mainContainer: {
    marginTop: width * 0.14,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  BackContainer: {
    width: '11%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  titleRightContainer: {
    width: '89%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#004F71',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#ffffff',
  },
  subTitleContentContainer: {
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
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#004F71',
  },
  bottomContainer: {},
  tabBox: {
    marginHorizontal: width * 0.07,
    backgroundColor: '#ffffff',
    height: height * 0.75,
    marginVertical: 20,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
  },
  tabButton: {
    flexDirection: 'row',
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  leftTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: 40,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: 40,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 4,
    borderBottomColor: '#197B9A',
  },
  selectedTabBtnText: {
    fontSize: 14,
    color: '#212322',
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#C8C8C8',
  },
  tileContainer: {
    paddingTop: 15,
    height: height * 0.65,
  },
  tileListingContainer: {
    marginHorizontal: width * 0.05,
    padding: width * 0.05,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    marginVertical: 7.5,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLeftSide: {
    flex: 8,
  },
  tileRightSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileIdText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#212322',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
  selectedUnit: state.apartmentState.selectedUnit,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),

  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingFacility);
