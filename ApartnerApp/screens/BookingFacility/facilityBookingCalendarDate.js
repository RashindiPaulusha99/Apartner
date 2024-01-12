import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
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
import {connect} from 'react-redux';
import {
  setSelectedUnitAction,
  selectedBookingFacilityAction,
  getBookingHistoryAction,
  getBookingHistoryChangeDetails,
} from './actions/booking-facility-action';
import {
  getFacilityList,
  getBookingDataList,
  bookingFacility,
} from './services/booking-service';
import moment from 'moment';
import ChangeFacilityBottomSheet from '../../components/bottomsheets/ChangeFacilityBottomSheet';
import ChangeTimeSlotBottomSheet from '../../components/bottomsheets/ChangeTimeSlotBottomSheet';
import BookingSuccessfulBottomSheet from '../../components/bottomsheets/BookingSuccessfulBottomSheet';
import BookingFailedBottomSheet from '../../components/bottomsheets/BookingFailedlBottomSheet';
import ProceedToPayNowBottomSheet from '../../components/bottomsheets/ProceedToPayNowBottomSheet';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import {Overlay} from 'react-native-elements';

import {
  MainContainer,
  TopCardContainer,
  DefaultButtonPlainOutlined,
  DefaultButtonPlain,
} from '../../components';

const {StatusBarManager} = NativeModules;

const {width, height} = Dimensions.get('window');
const FacilityBookingCalendarDate = ({
  navigation,
  setSelectedUnit,
  apartmentUnitsList,
  selectedApartmentData,
  selectedBookingFacility,
  apartmentFacilityData,
  selectedUnit,
  loggedInUserData,
  bookingHistoryDataProps,
  bookingListChange,
  bookingStatusChange,
}) => {
  let datepickerRef = useRef(null);
  const [bookingDate, setBookingDate] = useState(
    selectedBookingFacility.next_booking_available_date
      ? moment(selectedBookingFacility.next_booking_available_date).format(
          'DD/MM/YYYY',
        )
      : moment('2021-10-25').format('DD/MM/YYYY'),
  );
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleTimeSlotBottomSheet, setVisibleTimeSlotBottomSheet] = useState(
    false,
  );
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(
    selectedBookingFacility,
  );

  const [selectedFromHour, setSelectedFromHour] = useState(null);
  const [apartmentFacilityList, setApartmentFacilityList] = useState([]);
  const [existingBookingData, setExistingBookingData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(false);
  const [startAvailableTime, setStartAvailableTime] = useState(null);
  const [endAvailableTime, setEndAvailableTime] = useState(null);
  const [isPickTimeSlot, setIsPickTimeSlot] = useState(false);
  const [selectedHours, setSelectedHours] = useState(null);
  const [totalCost, setTotalCost] = useState(null);
  const [
    visibleSuccessMessageBottomSheet,
    setVisibleSuccessMessageBottomSheet,
  ] = useState(false);
  const [
    visibleBookingFailureBottomSheet,
    setVisibleBookingFailureBottomSheet,
  ] = useState(false);
  const [
    visibleProceedToPayBottomSheet,
    setVisibleProceedToPayBottomSheet,
  ] = useState(false);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTimeRangeSlots, setSelectedTimeRangeSlots] = useState([]);
  const [bookingFailErrorMessage, setBookingFailErrorMessage] = useState('');

  useEffect(() => {
    initPageHandler();
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
    getExistingBookingData();
    checkAvailabilityDateHandler();
  }, [bookingDate, selectedFacility]);

  const initPageHandler = async () => {
    try {
      const dataParams = {
        selectedComplexId: selectedApartmentData.key,
        userId: loggedInUserData.user_id,
      };
      const getFacilityListData = await getFacilityList(dataParams);
      setApartmentFacilityList(getFacilityListData.data);
    } catch (e) {
      throw e;
    }
  };

  const getExistingBookingData = async () => {
    try {
      setSpinner(true);
      const dataParams = {
        locationId: selectedFacility.recreational_location_id,
        startDate: moment(bookingDate, '"DD/MM/YYYY"').format('YYYY-MM-DD'),
        unitId: selectedUnit.apartment_unit_id,
        userId: loggedInUserData.user_id,
      };
      const getBookingData = await getBookingDataList(dataParams);
      if (getBookingData.data.message === 'success') {
        setExistingBookingData(getBookingData.data.body.bookingData);
      }
      setSpinner(false);
    } catch (e) {
      setSpinner(false);
    }
  };

  const checkAvailabilityDateHandler = () => {
    setAvailabilityStatus(false);
    if (
      selectedFacility.availability &&
      selectedFacility.availability.length > 0
    ) {
      for (let x = 0; x < selectedFacility.availability.length; x++) {
        const fromAvailabilityDate = moment(
          selectedFacility.availability[x].from_date_time,
        ).format('YYYY-MM-DD');

        const toAvailabilityDate = moment(
          selectedFacility.availability[x].to_date_time,
        ).format('YYYY-MM-DD');
        const bookingNewDate = moment(bookingDate, '"DD/MM/YYYY"').format(
          'YYYY-MM-DD',
        );

        const availabilityStatue =
          moment(bookingNewDate).isBetween(
            fromAvailabilityDate,
            toAvailabilityDate,
          ) ||
          moment(bookingNewDate).isSame(fromAvailabilityDate, 'day') ||
          moment(bookingNewDate).isSame(toAvailabilityDate, 'day')
            ? true
            : false;

        if (availabilityStatue) {
          setStartAvailableTime(selectedFacility.availability[x].from_time);
          setEndAvailableTime(selectedFacility.availability[x].to_time);
          setAvailabilityStatus(true);
        }
      }
    }
  };

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const visibilityTimeSlotBSHandler = status => {
    setVisibleTimeSlotBottomSheet(status);
  };

  const visibilityBookingSuccessHandler = status => {
    setVisibleSuccessMessageBottomSheet(status);
  };
  const visibilityBookingFailureHandler = status => {
    setVisibleBookingFailureBottomSheet(status);
  };
  const proceedToPayNowHandler = status => {
    setVisibleProceedToPayBottomSheet(status);
  };

  const facilityHandler = facility => {
    setSelectedFacility(facility);
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const bookedFacilityHandler = async () => {
    try {
      const dataParams = {
        startTime: startTime,
        endTime: endTime,
        location: selectedFacility.recreational_location_id,
        user_id: loggedInUserData.user_id,
        unitId: selectedUnit.apartment_unit_id,
        selectedComplexId: selectedApartmentData.key,
        bookingSlots: 5
      };
      if (selectedFacility.cost_type === 'free') {
        setSpinner(true);
        const response = await bookingFacility(dataParams);
        if (response.status === 200) {
          const dataParams = {
            userId: loggedInUserData.user_id,
            selectedComplexId: selectedApartmentData.key,
            unitID: selectedUnit.apartment_unit_id,
          };
          bookingStatusChange(true);
          bookingHistoryDataProps(dataParams);
          setSelectedTimeRangeSlots([]);
          getExistingBookingData();
          setVisibleSuccessMessageBottomSheet(true);
        }
        setSpinner(false);
      } else if (selectedFacility.cost_type === 'pay') {
        setVisibleProceedToPayBottomSheet(true);
        bookingStatusChange(true);
      }
    } catch (e) {
      setBookingFailErrorMessage(e.response.data.body.message);
      setSpinner(false);
      setVisibleBookingFailureBottomSheet(true);
      setSelectedTimeRangeSlots([]);
      throw e;
    }
  };

  const bookingDateHandler = date => {
    setBookingDate(date);
  };

  const timeSlotHandler = item => {
    setSelectedTimeSlot(item);
    setSelectedFromHour(item.hour);
    setVisibleTimeSlotBottomSheet(true);
  };

  const navigationHandler = navPage => {
    navigation.navigate(navPage);
  };

  const timeConfirmHandler = (start, endVal) => {
    let end = endVal;

    setIsPickTimeSlot(true);
    if (end === '12:00 AM') {
      end = '11:59 PM';
    }
    const startSelectedTime = moment(
      `${bookingDate} ${start}`,
      '"DD/MM/YYYY hh:mm A"',
    );

    const endSelectedTime = moment(
      `${bookingDate} ${end}`,
      '"DD/MM/YYYY hh:mm A"',
    );

    const duration = moment.duration(endSelectedTime.diff(startSelectedTime));
    let hours = duration.asHours();

    hours = hours < 1 ? 1 : hours;
    setStartTime(startSelectedTime.format('YYYY-MM-DD HH:mm:ss'));
    setEndTime(endSelectedTime.format('YYYY-MM-DD HH:mm:ss'));
    setSelectedHours(hours);
    setTotalCost(hours * selectedFacility.cost_per_hour);

    let startTime24h = parseInt(moment(start, '"hh:mm A"').format('H'));
    let endTime24h = '';

    if (parseInt(moment(end, '"hh:mm A"').format('H')) === '11:59 PM') {
      endTime24h = 24;
    } else {
      endTime24h = parseInt(moment(end, '"hh:mm A"').format('H'));
    }

    let timeRangeArr = [];
    for (startTime24h; startTime24h < endTime24h; startTime24h++) {
      timeRangeArr.push(startTime24h);
    }

    setSelectedTimeRangeSlots(timeRangeArr);

    setVisibleTimeSlotBottomSheet(false);
  };

  const timeRangeRenderData = ({item, index}) => {
    item.selected =
      selectedTimeRangeSlots.indexOf(parseInt(item.hour)) !== -1 ? true : false;
    return (
      <View
        style={[
          styles.timeRangeRenderItem,
          index === 0
            ? {marginTop: 10}
            : existingBookingData.length - 1 === index && {marginBottom: 10},
        ]}>
        <View style={styles.timeRangeRenderItemTime}>
          <Text style={styles.timeRangeRenderItemTimeText}>{item.label}</Text>
        </View>
        {item.isBookedByCurrentUnit && item.bookings_of_current_user && item.bookings_of_current_user > 0 ? (
          <View
            style={[
              styles.timeRangeRenderItemTile,
              {backgroundColor: '#004F71'},
            ]}>
            <Text style={[styles.slotTitle, {color: '#FFFFFF'}]}>
              You've already booked this slot
            </Text>
          </View>
        ) : item.available_slots > 0 && item.selected ? (
          <View
            style={[
              styles.timeRangeRenderItemTile,
              {backgroundColor: '#004F71'},
            ]}>
            <Text style={[styles.slotTitle, {color: '#FFFFFF'}]}>Selected</Text>
          </View>
        ) : item.available_slots === 0 ? (
          <View
            style={[
              styles.timeRangeRenderItemTile,
              {backgroundColor: '#F2725A'},
            ]}>
            {item.bookings_count > 0 && (
              <Text style={styles.slotTitle}>Reserved</Text>
            )}
            <Text style={styles.slotText}>No available slots</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => timeSlotHandler(item)}
            style={[
              styles.timeRangeRenderItemTile,
              item.bookings_count > 0 && {backgroundColor: '#89B2C4'},
            ]}>
            {item.bookings_count > 0 && (
              <Text style={styles.slotTitle}>Reserved</Text>
            )}
            {item.available_slots &&
              (item.bookings_count > 0 && item.available_slots > 0 ? (
                <Text style={styles.slotText}>
                  Available slots - {item.available_slots}
                </Text>
              ) : (
                selectedFacility.capacity > 0 && (
                  <Text style={styles.slotText}>
                    Available slots - {selectedFacility.capacity}
                  </Text>
                )
              ))}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const proceedPaymentIntegrationHandler = async () => {
    // navigation.navigate('PaymentGateway', {cost: totalCost})
    try {
      setSpinner(true);
      setVisibleProceedToPayBottomSheet(false);
      const dataParams = {
        startTime: startTime,
        endTime: endTime,
        location: selectedFacility.recreational_location_id,
        user_id: loggedInUserData.user_id,
        unitId: selectedUnit.apartment_unit_id,
        selectedComplexId: selectedApartmentData.key,
        bookingSlots: 5
      };

      const response = await bookingFacility(dataParams);
      if (response.status === 200) {
        const dataParams = {
          userId: loggedInUserData.user_id,
          selectedComplexId: selectedApartmentData.key,
          unitID: selectedUnit.apartment_unit_id,
        };
        bookingStatusChange(true);
        bookingHistoryDataProps(dataParams);
        getExistingBookingData();
        setVisibleSuccessMessageBottomSheet(true);
      }
      setSpinner(false);
    } catch (e) {
      setBookingFailErrorMessage(e.response.data.body.message);
      setSpinner(false);
      setVisibleBookingFailureBottomSheet(true);
      setSelectedTimeRangeSlots([]);
    }
  };
  return (
    <>
      <MainContainer
        navigateToHome={navigateToBack}
        title="Facility Booking"
        changeUnitState={false}>
        <TopCardContainer
          customStyle={{justifyContent: 'space-between'}}
          customHeight={height * 0.897 - statusBarHeight}>
          <View style={styles.topRowContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Select Facility *</Text>
              <TouchableOpacity
                onPress={() => setVisibleBottomSheet(true)}
                style={styles.gateUpdateXBDropDown}>
                <Text style={styles.dropDownText}>
                  {selectedFacility.location_name}
                </Text>
                {visibleBottomSheet ? (
                  <UpIcon height={10} width={10} />
                ) : (
                  <DownIcon height={10} width={10} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Booking Date *</Text>
              <View style={styles.gateUpdateXBDropDown}>
                <DatePicker
                  style={{
                    flexDirection: 'column',
                    width: '100%',
                  }}
                  date={bookingDate}
                  ref={datepickerRef}
                  mode="date"
                  androidMode="spinner"
                  showIcon={true}
                  iconComponent={
                    <Icon name="calendar-today" size={24} color="#84C7DD" />
                  }
                  format="DD/MM/YYYY"
                  minDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateTouchBody: {height: 30},
                    dateInput: {
                      width: '100%',
                      height: 30,
                      borderWidth: 0,
                      justifyContent: 'center',
                      alignItems: 'baseline',
                    },
                    datePicker: {
                      backgroundColor: '#d1d3d8',
                      justifyContent: 'center',
                      height: 30,
                    },
                    datePickerCon: {
                      paddingTop: 80,
                    },
                    dateText: {
                      fontFamily: 'Roboto-Medium',
                      color: '#212322',
                      fontSize: 16,
                      lineHeight: 18,
                    },
                    btnTextConfirm: {
                      color: '#26272C',
                      fontFamily: 'Roboto-Medium',
                      fontSize: 18,
                    },
                    btnTextCancel: {
                      color: '#26272C',
                      fontFamily: 'Roboto-Regular',
                      fontSize: 18,
                    },
                  }}
                  onDateChange={date => bookingDateHandler(date)}
                />
              </View>
            </View>
            {selectedFacility.availability &&
            selectedFacility.availability.length > 0 ? (
              availabilityStatus ? (
                <View style={styles.rowContainer}>
                  <Text style={styles.boldText}>
                    Click on time slot to reserve
                  </Text>
                  <View style={styles.timeRangeContainer}>
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={existingBookingData ? existingBookingData : []}
                      renderItem={timeRangeRenderData}
                      keyExtractor={item => item.hour}
                    />
                  </View>
                </View>
              ) : (
                <Text style={styles.errorText}>
                  There is no time slot available for this date.
                </Text>
              )
            ) : (
              <Text style={styles.errorText}>
                There is no time slot available for this facility yet.
              </Text>
            )}
          </View>
          <View style={styles.buttonView}>
            <DefaultButtonPlainOutlined
              submit={() => navigation.goBack()}
              title="Cancel"
              customStyle={{width: '32.5%'}}
            />
            <DefaultButtonPlain
              disabled={
                availabilityStatus ? (isPickTimeSlot ? false : true) : true
              }
              submit={bookedFacilityHandler}
              title="Book Now"
              customStyle={{width: '50%'}}
            />
          </View>
        </TopCardContainer>
      </MainContainer>
      {apartmentFacilityList &&
        apartmentFacilityList.length > 0 &&
        visibleBottomSheet && (
          <ChangeFacilityBottomSheet
            onVisible={visibleBottomSheet}
            visibilityHandler={visibilityHandler}
            facilityHandler={facilityHandler}
            facilityList={apartmentFacilityData}
            height={[250, 300, 0]}
          />
        )}
      {visibleTimeSlotBottomSheet && (
        <ChangeTimeSlotBottomSheet
          onVisible={visibleTimeSlotBottomSheet}
          visibilityHandler={visibilityTimeSlotBSHandler}
          facilityList={apartmentUnitsList}
          selectedInitialFromHour={selectedFromHour}
          height={[250, 300, 0]}
          bookingDate={bookingDate}
          timeSlotHandler={timeConfirmHandler}
          availableToTime={endAvailableTime}
          selectedFacility={selectedFacility}
          selectedTimeSlot={selectedTimeSlot}
          existingBookingData={existingBookingData}
        />
      )}
      {visibleSuccessMessageBottomSheet && (
        <BookingSuccessfulBottomSheet
          onVisible={visibleSuccessMessageBottomSheet}
          visibilityHandler={visibilityBookingSuccessHandler}
          bottomSheetHeight={[400, 0]}
          closeBottomSheetHandler={() => navigationHandler('BookingFacility')}
          selectedFacility={selectedFacility.location_name}
          bookingDate={bookingDate}
          startTime={startTime}
          endTime={endTime}
        />
      )}
      {visibleBookingFailureBottomSheet && (
        <BookingFailedBottomSheet
          onVisible={visibleBookingFailureBottomSheet}
          visibilityHandler={visibilityBookingFailureHandler}
          bottomSheetHeight={[250, 0]}
          closeBottomSheetHandler={() =>
            setVisibleBookingFailureBottomSheet(false)
          }
          selectedFacility={selectedFacility.location_name}
          bookingDate={bookingDate}
          startTime={startTime}
          endTime={endTime}
          failMessage={bookingFailErrorMessage}
        />
      )}
      {visibleProceedToPayBottomSheet && (
        <ProceedToPayNowBottomSheet
          onVisible={visibleProceedToPayBottomSheet}
          visibilityHandler={proceedToPayNowHandler}
          bottomSheetHeight={[400, 0]}
          closeBottomSheetHandler={proceedPaymentIntegrationHandler}
          selectedFacility={selectedFacility}
          bookingDate={bookingDate}
          startTime={startTime}
          endTime={endTime}
          selectedHours={selectedHours}
          totalCost={totalCost}
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
  dateRangePickerContainer: {
    width: '100%',
    paddingHorizontal: '8%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRange: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRangeItems: {
    width: '45%',
    height: 40,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  dropDownText: {
    color: '#26272C',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    lineHeight: 21,
    textTransform: 'capitalize',
  },
  dateRangeText: {
    color: '#6f7a86',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    lineHeight: 21,
  },
  topRowContainer: {
    width: '100%',
    paddingHorizontal: width * 0.05,
  },
  rowContainer: {
    marginBottom: 20,
  },

  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    lineHeight: 18,
    color: '#9B9B9B',
    marginBottom: 10,
  },
  boldText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    lineHeight: 18,
    color: '#000000',
  },
  errorText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 18,
    color: 'red',
  },

  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  timeRangeContainer: {
    height: height * 0.44,
    marginTop: 10,
  },
  timeRangeRenderItem: {
    flex: 1,
    height: 60,
    flexDirection: 'row',
  },
  timeRangeRenderItemTime: {
    flex: 1,
    marginTop: -5,
    alignItems: 'center',
  },
  timeRangeRenderItemTimeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    lineHeight: 13,
    color: '#26272C',
  },

  timeRangeRenderItemTile: {
    flex: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#9b9b9b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    lineHeight: 18,
    color: '#004F71',
  },
  slotText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#004F71',
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
  selectedBookingFacility: state.bookingFacilityState.selectedBookingFacility,
  bookingListChange: state.bookingFacilityState.getBookingHistoryChangeDetails,
});

const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  selectedBookingFacilityProps: payload =>
    dispatch(selectedBookingFacilityAction(payload)),
  bookingHistoryDataProps: payload =>
    dispatch(getBookingHistoryAction(payload)),
  bookingStatusChange: payload =>
    dispatch(getBookingHistoryChangeDetails(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityBookingCalendarDate);
