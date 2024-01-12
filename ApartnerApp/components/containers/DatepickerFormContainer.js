import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CalenderIcon from '../../assets/icons/new_ui/calendar_today_black_24dp.svg';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

const Datepicker = ({dateValue, onChangeDate, label}) => {
  return (
    <>
      <Text style={styles.labelText}>{label}</Text>
      <View style={styles.datePickerContainer}>
        <DatePicker
          style={{
            width: '97%',
            flexDirection: 'column',
          }}
          date={dateValue}
          mode="date"
          androidMode="spinner"
          format="YYYY-MM-DD"
          maxDate={moment(new Date()).format('YYYY-MM-DD')}
          placeholder="YYYY-MM-DD"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateTouchBody: {
              height: 30,
              width: '100%',
            },
            dateInput: {
              width: '100%',
              height: 30,
              borderWidth: 0,
              justifyContent: 'flex-end',
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
          onDateChange={date => {
            onChangeDate(date);
          }}
          iconComponent={<CalenderIcon size={30} />}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  labelText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#9B9B9B',
    lineHeight: 18,
    marginBottom: 8,
  },
  datePickerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
    paddingBottom: 2,
    marginBottom: 15,
  },
});
export default Datepicker;
