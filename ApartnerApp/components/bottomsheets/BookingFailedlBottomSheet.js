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
import Icon from '../../assets/icons/error_black.svg';
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
  failMessage,
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
            <Icon height={40} width={40} />
          </View>
          <View style={styles.headerNameView}>
            <Text style={styles.headerName}>Booking Failure!</Text>
          </View>
          <View style={styles.headerNameView}>
            <Text style={styles.content}>{failMessage}</Text>
          </View>
        </View>
        <View style={styles.ButtonViewBottomSheet}>
          <DefaultButtonPlainOutlined
            submit={closeBottomSheetHandler}
            customStyle={{width: '100%'}}
            title="Try Again"
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
    marginTop: 5,
  },
  headerName: {
    fontFamily: 'Roboto-Black',
    fontSize: 26,
    color: '#26272C',
  },
  content: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: '#26272C',
    marginBottom: 10,
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
