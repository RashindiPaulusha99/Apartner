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
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {setSelectedParcelAction} from '../actions/apartment-action';
import {getParcelsAccourdingToStatusApi} from '../services/apartment-service';
import moment from 'moment';
import LoadingDialogue from '../../../components/containers/LoadingDialogue';

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
    <View activeOpacity={1} key={i}>
      <TouchableOpacity
        onPress={() => selectedToBeCollectedHandler(item)}
        style={styles.mainCardContainer}>
        <View
          style={[
            styles.gateCardsParcel,
            {backgroundColor: item.parcel_details_id != null && '#707070'},
          ]}>
          <Text style={styles.todayCardsTextParcel}>
            {item.parcel_details_id && 'PARCEL'}
          </Text>
        </View>
        <View style={styles.todayCardMainSub}>
          <View style={styles.subMainContainer}>
            <Text style={styles.NameText}>
              {item.courier_name && item.courier_name.length > 10
                ? item.courier_name.substring(0, 10) + '...'
                : item.courier_name}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <View>
              <Text style={styles.bottomTime}>
                {moment(item.datetime_arrival).format('h:mm a')}
              </Text>
              <Text style={styles.bottomDate}>
                {moment(item.datetime_arrival).format('MMM DD')}
              </Text>
            </View>

            <View>
              <Text style={styles.bottomCollect}>
                {item.flag === 'not_collected' && 'Not Collected'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.mainCardView}>
      <View>
        <Text style={styles.TodayText}>Arrived</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={allVisiterParcelList}
          renderItem={renderBookingItem}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>
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
    width: width * 0.65,
    height: Platform.OS === 'ios' ? height * 0.17 : height * 0.19,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: height * 0.01,
    marginLeft: height * 0.02,
    marginBottom: width * 0.02,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
    flex: 4,
    marginVertical: height * 0.01,
    marginHorizontal: height * 0.01,
    paddingLeft: width * 0.01,
  },
  todayCardsTextParcel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
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
  bottomTime: {
    fontSize: 10,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
  },
  bottomCollect: {
    fontSize: 11,
    color: '#707070',
    fontFamily: 'Poppins-Medium',
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
