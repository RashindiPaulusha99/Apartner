import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {DefaultButtonPlain} from '../../components/';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const ProceedToPayNowBottomSheet = ({
  onVisible,
  visibilityHandler,
  facilityHandler,
  facilityList,
  onCloseClick,
  bottomSheetHeight,
  closeBottomSheetHandler,
  selectedFacility,
  bookingDate,
  startTime,
  endTime,
  selectedHours,
  totalCost,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
    if (onCloseClick) {
      onClose();
    }
  }, [onVisible, onCloseClick]);

  const renderInner = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        onClose();
      }}>
      <View style={styles.mainPopupView}>
        <View style={styles.topCard}>
          <View style={styles.headerNameView}>
            <Text style={styles.headerName}>Proceed to pay now</Text>
          </View>
          <View style={styles.reasonView}>
            <Text style={styles.facilityNameHeader}>Facility</Text>
            <Text style={styles.facilityName}>
              {selectedFacility.location_name}
            </Text>

            <View style={styles.timeRangeView}>
              <View style={styles.timeMainView}>
                <Text style={styles.checkIn}>Check-In</Text>
                <Text style={styles.dateAndTime}>
                  {moment(bookingDate, 'DD/MM/YYYY').format('Do MMMM YY')}
                </Text>
                <Text style={styles.dateAndTime}>
                  {moment(startTime).format('h:mmA')}
                </Text>
              </View>
              <View style={styles.timeMainView}>
                <Text style={styles.checkOut}>Check-Out</Text>
                <Text style={styles.dateAndTime}>
                  {moment(bookingDate, 'DD/MM/YYYY').format('Do MMMM YY')}
                </Text>
                <Text style={styles.dateAndTime}>
                  {moment(endTime).format('h:mmA')}
                </Text>
              </View>
            </View>
            <View style={styles.hoursView}>
              <View style={styles.hoursMainView}>
                <Text style={styles.hours}>Hours</Text>
                <Text style={styles.hourText}>
                  {selectedHours && selectedHours.toString()} Hour
                </Text>
              </View>
              <View style={styles.hoursMainView}>
                <Text style={styles.cost}>Total Cost</Text>
                <Text style={styles.totalCost}>LKR {totalCost}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.ButtonViewBottomSheet}>
          <DefaultButtonPlain
            submit={closeBottomSheetHandler}
            title="Pay Now"
            customStyle={{width: '100%'}}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const sheetRef = React.createRef(null);

  const onClose = () => {
    sheetRef.current.snapTo(1);
    visibilityHandler(false);
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onOpen = () => {
    visibilityHandler(true);
    sheetRef.current.snapTo(0);
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={bottomSheetHeight ? bottomSheetHeight : [250, 0]}
      initialSnap={1}
      renderContent={renderInner}
      onCloseEnd={onClose}
      borderRadius={20}
    />
  );
};

const styles = StyleSheet.create({
  mainPopupView: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: width,
  },
  headerNameView: {
    alignItems: 'center',
    marginTop: height * 0.03,
  },
  headerName: {
    fontFamily: 'Roboto-Black',
    fontSize: 26,
    color: '#26272C',
  },
  reasonView: {
    marginTop: height * 0.05,
    paddingLeft: 20,
    paddingRight: 20,
  },
  facilityNameHeader: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 12,
  },
  facilityName: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  timeRangeView: {
    marginTop: height * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkIn: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 12,
  },
  dateAndTime: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 16,
  },
  checkOut: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 12,
    paddingRight: 80,
  },
  hoursView: {
    marginTop: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hours: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 12,
  },
  hourText: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 16,
  },
  cost: {
    fontFamily: 'Roboto-Medium',
    color: '#197B9A',
    fontSize: 12,
    paddingRight: 80,
  },
  totalCost: {
    fontFamily: 'Roboto-Bold',
    color: '#197B9A',
    fontSize: 18,
  },
  ButtonViewBottomSheet: {
    marginTop: height * 0.03,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 50,
  },
  timeMainView: {
    width: '45%',
  },
  hoursMainView: {
    width: '45%',
  },
});

export default ProceedToPayNowBottomSheet;
