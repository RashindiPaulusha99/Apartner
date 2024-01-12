import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import {Input, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedUnitAction,
  selectedBookingFacilityAction,
  getBookingHistoryAction,
  geUpdateBookingHistory,
  getBookingHistoryChangeDetails,
} from './actions/booking-facility-action';
import {getApartmentFacilityAction} from '../Apartment/actions/apartment-action';
import {bookingCancelFacility} from './services/booking-service';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';

import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import facilityImage from '../../assets/images/facility-single-image.png';
import {
  MainContainer,
  TopCardContainer,
  DefaultButtonPlainOutlined,
  DefaultButtonPlain,
} from '../../components/';
import BottomSheet from '../../components/containers/bottomSheetV2';
import MovingBottomSheet from '../../components/containers/movingBottomSheetV2';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import ErrorIcon from '../../assets/icons/error_black.svg';
import configConstants from '../../config/constants';
import BookingHistoryView from './BookingHistory';

const {StatusBarManager} = NativeModules;

const {width, height} = Dimensions.get('window');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const BookingFacility = ({
  navigation,
  apartmentFacilityData,
  selectedUnit,
  setSelectedUnit,
  apartmentUnitsList,
  selectedBookingFacilityProps,
  bookingHistoryDataProps,
  loggedInUserData,
  selectedApartmentData,
  bookingHistory,
  bookingUpdateHistory,
  bookingListChange,
  bookingStatusChange,
  route,
  getApartmentFacilities,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [cancelBookingData, setCancelBookingData] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [
    visibleBottomSheetCancelBooking,
    setVisibleBottomSheetCancelBooking,
  ] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const [reasonData, setReasonData] = useState('');
  const [enableShift, setEnableShift] = useState(false);

  useEffect(() => {
    initDataHandler();
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
    bookingStatusChange(false);
  }, [bookingListChange]);

  useEffect(() => {
    if (
      typeof route.params !== 'undefined' &&
      typeof route.params.open !== 'undefined' &&
      route.params.open == 'myBooking'
    ) {
      setSelectedTab(2);
    }
    getApartmentFacilities({
      selectedComplexId: selectedApartmentData.key,
    });
  }, [route, bookingListChange]);

  const initDataHandler = () => {
    const dataParams = {
      userId: loggedInUserData.user_id,
      selectedComplexId: selectedApartmentData.key,
      unitID: selectedUnit.apartment_unit_id,
    };
    bookingHistoryDataProps(dataParams);
  };

  let apartmentFacilities = apartmentFacilityData;

  const visibleBottomSheetCancelBookingHistory = status => {
    setVisibleBottomSheetCancelBooking(status);
  };

  const facilityProfileHandler = item => {
    selectedBookingFacilityProps(item);
    navigation.navigate('FacilityProfile');
  };
  const navigateToBack = () => {
    navigation.navigate('Home');
  };
  const TopRowContainer = () => (
    <ScreenHeader headerName="Facilities" navigateToBack={navigateToBack} />
  );
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const visibilityHandlerCancelBooking = status => {
    setVisibleBottomSheetCancelBooking(status);
  };
  const unitHandler = unit => {
    setSelectedUnit(unit);
  };
  const closeBottomSheet = () => {
    setVisibleBottomSheetCancelBooking(false);
  };
  const bookingFacilityHandler = item => {
    selectedBookingFacilityProps(item);
    navigation.navigate('FacilityBookingCalendar');
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
            <Text style={styles.costPerHourText}>Cost per hour</Text>
            {item.cost_type === 'pay' ? (
              <Text style={styles.costPerHourValueText}>
                {item.cost_per_hour && item.cost_per_hour} LKR
              </Text>
            ) : (
              <Text style={[styles.costPerHourValueText, {color: '#3ADB14'}]}>
                FREE
              </Text>
            )}
          </View>
          {item.next_booking_available_date ? (
            <TouchableOpacity
              onPress={() => {
                bookingFacilityHandler(item);
              }}
              style={styles.buttonStyle}>
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          ) : (
            <View
              onPress={() => {
                bookingFacilityHandler(item);
              }}
              style={[styles.buttonStyle, {backgroundColor: '#9B9B9B'}]}>
              <Text style={[styles.buttonText, {color: '#E2E2E2'}]}>
                Booked
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const cancelBooking = async () => {
    setSpinner(true);
    setReasonData('');
    try {
      const dataParams = {
        userId: loggedInUserData.user_id,
        selectedComplexId: selectedApartmentData.key,
        unitID: selectedUnit.apartment_unit_id,
        bookingId: cancelBookingData.recreational_location_booking_id,
        bookingRowId: cancelBookingData.recreational_location_booking_row_id,
      };
      setVisibleBottomSheetCancelBooking(false);
      const response = await bookingCancelFacility(dataParams);

      if (response.status === 200) {
        bookingStatusChange(true);
        bookingUpdateHistory(response.data.query.dataList);
        setSpinner(false);
      }
    } catch (e) {
      setSpinner(false);
      throw e;
    }
  };

  const renderCancelBooking = () => (
      <View style={styles.rejectPopup}>
        <View style={styles.topCard}>
          <View style={styles.imageView}>
            <ErrorIcon />
          </View>
          <View style={styles.headerNameView}>
            <Text style={styles.headerName}>Cancel Booking</Text>
          </View>
          <View style={styles.reasonView}>
            <Input
              inputStyle={styles.inputField}
              labelStyle={styles.reasonLabel}
              label="Reason *"
              onChangeText={text => {
                setReasonData(text);
              }}
              onFocus={() => setEnableShift(true)}
            />
          </View>
        </View>
        <View style={styles.ButtonViewBottomSheet}>
          <DefaultButtonPlainOutlined
            submit={closeBottomSheet}
            customStyle={{width: '30%'}}
            title="Back"
          />
          <DefaultButtonPlain
            submit={cancelBooking}
            title="Cancel Now"
            customStyle={{width: '50%'}}
            disabled={reasonData.length > 0 ? false : true}
          />
        </View>
      </View>
  );

  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title="Facilities"
        changeUnitState={false}>
        <TopCardContainer customHeight={height * 0.897 - statusBarHeight}>
          <View style={styles.topCardContainer}>
            <TouchableOpacity
              onPress={() => setVisibleBottomSheet(true)}
              style={styles.gateUpdateXBDropDown}>
              <Text style={styles.gateUpdateDropText}>
                {selectedUnit.unit_name ? selectedUnit.unit_name : 'All Units'}
              </Text>
              {visibleBottomSheet ? (
                <UpIcon height={10} width={10} />
              ) : (
                <DownIcon height={10} width={10} />
              )}
            </TouchableOpacity>
          </View>

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
                Facilities
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
                My Bookings
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.facilityItemsContainer}>
            {selectedTab === 1 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={apartmentFacilities}
                renderItem={renderBookingSingleItem}
                style={styles.flatList}
                keyExtractor={item => item.recreational_location_id.toString()}
              />
            )}
            {selectedTab === 2 && (
              <BookingHistoryView
                bookingHistory={bookingHistory}
                handleBottomSheet={visibleBottomSheetCancelBookingHistory}
                navigation={navigation}
                setCancelBookingData={setCancelBookingData}
              />
            )}
          </View>
        </TopCardContainer>
      </MainContainer>
      {visibleBottomSheetCancelBooking ? (
        <Overlay
          overlayStyle={{
            backgroundColor: 'rgba(226, 226, 226, 0.8)',
            padding: 0,
            marginTop: 0,
          }}
          fullScreen={true}
          onBackdropPress={navigateToBack}
          isVisible={visibleBottomSheetCancelBooking}>
          <>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              }}>
              <TopRowContainer />
            </View>
            <MovingBottomSheet
              onVisible={visibleBottomSheetCancelBooking}
              visibilityHandler={visibilityHandlerCancelBooking}
              children={renderCancelBooking}
              height={350}
            />
          </>
        </Overlay>
      ) : null}
      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
          height={[250, 300, 0]}
        />
      )}
      <Overlay
        overlayStyle={{
          backgroundColor: 'rgba(153,153,153,0.3)',
          padding: 0,
          marginTop: 0,
          justifyContent: 'center',
        }}
        fullScreen={true}
        backdropStyle={{backgroundColor: 'transparent'}}
        isVisible={spinner}>
        <ActivityIndicator size="large" color="#0E9CC9" />
      </Overlay>
    </>
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
    width: 20,
    height: 30,
  },
  mainContainer: {
    marginTop: height * 0.04,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
  },
  subTitleContentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
    marginLeft: width * 0.12,
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
    marginLeft: width * 0.14,
  },
  bottomContainer: {
    height: '100%',
    paddingBottom: height * 0.21,
  },
  facilityList: {
    width: '100%',
    backgroundColor: '#EEFAFF',
    paddingVertical: height * 0.02,
    paddingLeft: width * 0.07,
  },

  tabButton: {
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'Roboto-Bold',
    color: '#212322',
  },
  tabBtnText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#969696',
  },
  selectFacilityContainerField: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderRadius: 20,
    width: width * 0.24,
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    margin: 7.5,
  },

  facilityImgContainer: {
    width: '100%',
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  selectionFacilityTopicContainer: {
    height: height * 0.06,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  selectionFacilityTopic: {
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
    fontSize: 11,
    paddingHorizontal: 10,
    textAlign: 'center',
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
  gateUpdateXBDropDown: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  gateUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.02,
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
  costPerHourText: {
    color: '#197B9A',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  costPerHourValueText: {
    color: '#197B9A',
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
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
    paddingHorizontal: 25,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  bookingHistory: state.bookingFacilityState.bookingHistoryData,
  bookingListChange: state.bookingFacilityState.getBookingHistoryChangeDetails,
});

const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  selectedBookingFacilityProps: payload =>
    dispatch(selectedBookingFacilityAction(payload)),
  bookingHistoryDataProps: payload =>
    dispatch(getBookingHistoryAction(payload)),
  bookingUpdateHistory: payload => dispatch(geUpdateBookingHistory(payload)),
  bookingStatusChange: payload =>
    dispatch(getBookingHistoryChangeDetails(payload)),
  getApartmentFacilities: payload =>
    dispatch(getApartmentFacilityAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BookingFacility);
