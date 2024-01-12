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
  Platform,
  NativeModules,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedUnitAction,
  selectedBookingFacilityAction,
} from './actions/booking-facility-action';
import moment from 'moment';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
import facilityImage from '../../assets/images/facility-single-image.png';
import configConstants from '../../config/constants';

const {StatusBarManager} = NativeModules;

const {width, height} = Dimensions.get('window');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const BookingHistory = ({
  navigation,
  apartmentFacilityData,
  apartmentFacilityDataItems,
  selectedUnit,
  setSelectedUnit,
  apartmentUnitsList,
  selectedBookingFacilityProps,
  handleBottomSheet,
  bookingHistory,
  setCancelBookingData,
}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);

  const onCancelClick = item => {
    setCancelBookingData(item);
    handleBottomSheet(true);
  };

  const renderBookingSingleItem = ({item, i}) => {
    let image = facilityImage;
    if (item.images.length > 0) {
      const imageName = item.images[0].image_path;
      image = {
        uri: `${
          configConstants.apiUrlWithPort
        }/api/v1/assets/getAsset?filePath=files/recreational-location-images/${imageName}`,
      };
    }
    const facilityProfileHandler = item => {
      selectedBookingFacilityProps(item);
      navigation.navigate('FacilityProfile');
    };
    return (
      <View activeOpacity={1} key={i} style={styles.facilityContainerListItem}>
        <ImageBackground
          source={image}
          style={styles.facilitySingleItemImgContainer}
          imageStyle={styles.facilityImg}>
          <LinearGradientContainer
            colors={['transparent', '#1B2F4361', '#004386']}
            styles={styles.facilityImgGradientContainer}>
            <Text
              onPress={() => facilityProfileHandler(item)}
              style={styles.selectionSingleFacilityContent}>
              View Details
            </Text>
          </LinearGradientContainer>
        </ImageBackground>
        <View style={styles.facilitySingleItemTopicContainer}>
          <View style={styles.selectionSingleFacilityTextContainer}>
            <Text style={styles.selectionSingleFacilityTopic}>
              {item.location_name}
            </Text>
            <Text style={styles.selectionSingleFacilitySubTopic}>
              {item.facility_location_name &&
                capitalizeFirstLetter(item.facility_location_name)}
            </Text>
          </View>
          <View style={styles.selectionSingleFacilityTextContainer}>
            <Text style={styles.dateTimeText}>Date & Time</Text>
            <Text style={styles.dateTimeValueText}>
              {item.booked_datetime_from &&
                moment(item.booked_datetime_from).format('Do MMMM YYYY')}
            </Text>
            <Text style={styles.dateTimeValueText}>
              {item.booked_datetime_from &&
                moment(item.booked_datetime_from).format('hh:mmA')}
              {' - '}
              {item.booked_datetime_to &&
                moment(item.booked_datetime_to).format('hh:mmA')}
            </Text>
          </View>
          {item.booking_status == 'booked' ? (
            <TouchableOpacity
              onPress={() => {
                onCancelClick(item);
              }}
              style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.buttonStyle, {backgroundColor: '#9B9B9B'}]}>
              <Text style={[styles.buttonText, {color: '#E2E2E2'}]}>
                Cancelled
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.facilityItemsContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={bookingHistory.sort(
          (a, b) =>
            b.recreational_location_booking_id -
            a.recreational_location_booking_id,
        )}
        renderItem={renderBookingSingleItem}
        style={styles.flatList}
        keyExtractor={item => item.recreational_location_booking_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
  },
  facilityItemsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  flatList: {
    textAlign: 'center',
  },
  facilityContainerListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    marginHorizontal: width * 0.05,
    marginVertical: 12,
    height: 180,
  },
  facilitySingleItemImgContainer: {
    width: '43%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },

  facilitySingleItemTopicContainer: {
    width: '57%',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  facilityImgGradientContainer: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  renderBookingItemClickImg: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  facilityImgText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    marginBottom: height * 0.01,
  },
  selectionSingleFacilityTextContainer: {
    width: '100%',
  },
  selectionSingleFacilityTopic: {
    color: '#004F71',
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    lineHeight: 21,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  dateTimeText: {
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
  },
  dateTimeValueText: {
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
  },
  selectionSingleFacilitySubTopic: {
    color: '#000000',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  selectionSingleFacilityContent: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
    lineHeight: 13,
    // marginTop: height * 0.25,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: '#0E9CC9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 45,
  },
  buttonClickContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  cancelledButtonStyle: {
    width: '100%',
    backgroundColor: '#E2E2E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: height * 0.075,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
  rejectPopup: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: width,
  },
  imageView: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  headerName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 26,
    color: '#26272C',
  },
  headerNameView: {
    alignItems: 'center',
    marginTop: height * 0.001,
  },
  reasonView: {
    marginTop: height * 0.05,
    paddingLeft: 20,
    paddingRight: 20,
  },
  reasonLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#9B9B9B',
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 12,
  },
  ButtonViewBottomSheet: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 50,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
  selectedUnit: state.apartmentState.selectedUnit,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
});

const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  selectedBookingFacilityProps: payload =>
    dispatch(selectedBookingFacilityAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingHistory);
