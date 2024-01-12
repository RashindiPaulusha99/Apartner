import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {setSelectedParcelAction} from '../actions/apartment-action';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import moment from 'moment';
import LoadingDialogue from '../../../components/containers/LoadingDialogue';
import ParcelIcon from '../../../assets/icons/inventory_2.svg';
import HorizontalArrow from '../../../assets/icons/horizontal-arrow-right.svg';

const {width, height} = Dimensions.get('window');
const ToBeCollected = ({
  setSelectedParcelData,
  selectedApartmentData,
  navigation,
  selectedTab,
  selectedUnit,
  apartmentUnitsList,
  parcelDataList,
  visibilityHandler,
  parcelListDataLoadPending,
}) => {
  const [allVisiterParcelList, setAllVisiterParcelList] = useState(
    parcelDataList.parcelsToBeCollected,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(parcelListDataLoadPending);
  }, [parcelListDataLoadPending]);

  const selectedToBeCollectedHandler = value => {
    setSelectedParcelData(value);
    visibilityHandler(false);
    navigation.navigate('ToBeCollected');
  };

  const renderBookingItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={i}
      onPress={() => selectedToBeCollectedHandler(item)}
      style={styles.mainCardContainer}>
      <View style={styles.todayCardMainSub}>
        <View style={styles.leftSideContent}>
          <View style={styles.leftSideRowContent}>
            <ParcelIcon style={{marginRight: 5}} />
            <Text style={styles.nameText}>
              {item.courier_name && item.courier_name.length > 10
                ? item.courier_name.substring(0, 10) + '...'
                : item.courier_name}
            </Text>
          </View>
          <View style={styles.leftSideRowContent}>
            <HorizontalArrow style={{marginRight: 5}} />

            <Text style={styles.bottomtime}>
              {moment(item.datetime_arrival).format('MMM DD hh:mm a')}
            </Text>
          </View>
        </View>
        <View style={styles.rightSideContent}>
          <View
            style={[
              styles.guestType,
              {
                backgroundColor: item.parcel_details_id != null && '#0E9CC9',
              },
            ]}>
            <Text style={styles.todayCardsTextParcel}>
              {item.parcel_details_id && 'Parcel'}
            </Text>
          </View>

          <View style={styles.arrivalStatusContainer}>
            <Text style={styles.bottomCollect}>
              {item.flag === 'not_collected' && 'Not Collected'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={allVisiterParcelList}
        renderItem={renderBookingItem}
        keyExtractor={item => item.recreational_location_id}
      />
      <LoadingDialogue visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCardView: {
    height: Platform.OS === 'ios' ? height * 0.2 : height * 0.25,
    marginBottom: 10,
  },
  TodayText: {
    color: '#9B9B9B',
    fontSize: 16,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    marginLeft: height * 0.03,
    fontWeight: 'bold',
  },
  mainCardContainer: {
    width: '92%',
    marginHorizontal: '4%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: width * 0.02,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  guestType: {
    backgroundColor: '#8A2FC7',
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  todayCardsParcel: {
    flex: 2,
    backgroundColor: '#8A2FC7',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  gateCardsParcel: {
    flex: 2,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  todayCardMainSub: {
    alignItems: 'center',
    paddingHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayCardsTextParcel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
  },
  subMainContainer: {
    marginTop: height * 0.004,
  },
  NameText: {
    marginBottom: Platform.OS === 'ios' ? 6 : 2,
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Poppins-Bold',
  },
  inImageIcon: {
    marginLeft: height * 0.035,
  },
  bottomContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomDate: {
    fontSize: 13,
    color: '#212322',
    fontFamily: 'Poppins-Bold',
    marginTop: Platform.OS === 'ios' ? 6 : 0,
  },
  bottomtime: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },

  leftSideContent: {
    flex: 3,
  },
  leftSideRowContent: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Roboto-Bold',
  },
  bottomVisitingFrequency: {
    fontSize: 12,
    color: '#5E5E5E',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    marginTop: height * 0.01,
  },
  bottomCollect: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
  },
  backIcon: {
    marginTop: height * 0.01,
    marginRight: height * 0.02,
  },
  bottomMainContainer: {
    flex: 3,
  },
  arrivalStatusContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  rightSideContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnit: state.apartmentState.selectedUnit,
  parcelDataList: state.parcelState.parcelsDataList,
  parcelListDataLoadPending: state.parcelState.parcelListDataLoadPending,
});

const mapDispatchToProps = dispatch => ({
  setSelectedParcelData: payload => dispatch(setSelectedParcelAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToBeCollected);
