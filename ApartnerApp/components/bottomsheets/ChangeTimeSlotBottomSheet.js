import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
import {DefaultButtonPlainOutlined, DefaultButtonPlain} from '../index';

var PickerItem = Picker.Item;

const {width, height} = Dimensions.get('window');

const ChangeFacilityBottomSheet = ({
  onVisible,
  visibilityHandler,
  onCloseClick,
  bottomSheetHeight,
  timeSlotHandler,
  selectedFacility,
  selectedTimeSlot,
  existingBookingData,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [selectedFromHour, setSelectedFromHour] = useState(
    selectedTimeSlot.startTime,
  );
  const [selectedToHourIndex, setSelectedToHourIndex] = useState(0);
  const [selectedToHour, setSelectedToHour] = useState(
    moment(selectedTimeSlot.startTime, '"hh:mm A"')
      .add(1, 'hours')
      .format('hh:mm A'),
  );
  const [hourToList, setHourToList] = useState([]);

  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
    if (onCloseClick) {
      onClose();
    }
  }, [onVisible, onCloseClick]);

  useEffect(() => {
    timeRangeToScheduleHandler();
  }, [onVisible]);

  const timeRangeToScheduleHandler = () => {
    try {
      let hourArr = [];
      const fromTime = selectedTimeSlot.startTime;
      const lastSlot = existingBookingData[existingBookingData.length - 1];
      const maximumHours = parseInt(selectedFacility.maximum_hours_per_booking);

      const startTimeMoment = moment(
        '2021-01-01 ' + fromTime,
        '"YYYY-MM-DD hh:mm A"',
      );

      const endTimeMoment = moment(
        '2021-01-01 ' + lastSlot.endTime,
        '"YYYY-MM-DD hh:mm A"',
      );

      const duration = moment.duration(endTimeMoment.diff(startTimeMoment));

      const hoursToMidnight = duration.asHours();

      let remainingHours =
        hoursToMidnight >= maximumHours ? maximumHours : hoursToMidnight;
      let currentToTime = startTimeMoment;

      for (remainingHours; remainingHours >= 1; remainingHours--) {
        const initHour = moment(currentToTime).add(1, 'hours');

        hourArr.push(initHour.format('hh:mm A'));
        currentToTime = moment(initHour);
      }

      setHourToList(hourArr);
    } catch (error) {}
  };

  const selectedToValueHandler = index => {
    setSelectedToHourIndex(index);
    setSelectedToHour(hourToList[index]);
  };
  const renderInner = () => (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Select Time slot</Text>
      <View style={styles.timeSlotContainer}>
        <View style={styles.timeSlotItemContainer}>
          <Text style={styles.subText}>From</Text>

          <Picker
            style={{width: 150, height: 150}}
            lineColor="#000000" //to set top and bottom line color (Without gradients)
            lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
            lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
            itemStyle={{color: 'black', fontSize: 26}}>
            <PickerItem label={selectedTimeSlot.startTime} value={0} />
          </Picker>
        </View>
        <View style={styles.timeSlotItemContainer}>
          <Text style={styles.subText}>To</Text>
          {hourToList && hourToList.length > 0 && (
            <Picker
              style={{width: 150, height: 150}}
              lineColor="#000000" //to set top and bottom line color (Without gradients)
              lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
              lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
              selectedValue={selectedToHourIndex}
              itemStyle={{color: 'black', fontSize: 26}}
              onValueChange={value => selectedToValueHandler(value)}>
              {hourToList.map((value, i) => (
                <PickerItem label={value} value={i} key={i} />
              ))}
            </Picker>
          )}
        </View>
      </View>

      <View style={styles.buttonView}>
        <DefaultButtonPlainOutlined
          submit={() => onClose()}
          title="Cancel"
          customStyle={{width: '32.5%'}}
        />
        <DefaultButtonPlain
          submit={() => timeSlotHandler(selectedFromHour, selectedToHour)}
          title="Confirm Time"
          customStyle={{width: '50%'}}
        />
      </View>
    </View>
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
      snapPoints={bottomSheetHeight ? bottomSheetHeight : [360, 0]}
      initialSnap={1}
      renderContent={renderInner}
      onCloseEnd={onClose}
      borderRadius={20}
    />
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    color: '#26272C',
    fontSize: 26,
    fontFamily: 'Roboto-Black',
    lineHeight: 28,
  },
  timeSlotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlotItemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subText: {
    color: '#26272C',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
});

export default ChangeFacilityBottomSheet;
