import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {DefaultButtonPlainOutlined} from '..';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from '../../assets/images/check_circle_green_24dp.svg';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const BookingSuccessfulBottomSheet = ({
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
          <View style={styles.imageView}>
            <Icon />
          </View>
          <View style={styles.headerNameView}>
            <Text style={styles.headerName}>Booking Successful!</Text>
          </View>
          <View style={styles.facilityNameMainView}>
            <Text style={styles.facilityHeaderName}>Facility</Text>
            <Text style={styles.facilityName}>{selectedFacility}</Text>
          </View>
          <View style={styles.headerNameView}>
            <Text style={styles.dateAndTimeText}>Date & Time</Text>
            <Text style={styles.dateView}>
              {moment(bookingDate, 'DD/MM/YYYY').format('Do MMMM YY')}
            </Text>
            <Text style={styles.timeView}>
              {moment(startTime).format('h:mmA')} -{' '}
              {moment(endTime).format('h:mmA')}
            </Text>
          </View>
        </View>
        <View style={styles.ButtonViewBottomSheet}>
          <DefaultButtonPlainOutlined
            submit={closeBottomSheetHandler}
            customStyle={{width: '100%'}}
            title="Close"
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
  imageView: {
    alignItems: 'center',
    marginTop: height * 0.04,
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
  facilityNameMainView: {
    marginTop: height * 0.03,
    alignItems: 'center',
  },
  facilityHeaderName: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 16,
  },
  facilityName: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  dateAndTimeText: {
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
    fontSize: 16,
  },
  dateView: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 16,
  },
  timeView: {
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    fontSize: 16,
  },
  ButtonViewBottomSheet: {
    marginTop: height * 0.03,
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
});

export default BookingSuccessfulBottomSheet;
