import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Input} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

const MyDatePicker = ({}) => {
  return (
    <View style={styles.inputDateContainer}>
      <DatePicker
        style={styles.inputDateContainerField}
        date={""}
        mode="date"
        androidMode="spinner"
        showIcon={false}
        format="DD-MM-YYYY"
        minDate="01-01-1900"
        maxDate={moment(new Date()).format('DD-MM-YYYY')}
        placeholder="DD-MM-YYYY"
        // disabled={editor ? false : true}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: {
            // width: width * 0.9,
            height: 50,
            backgroundColor: 'white',
            borderWidth: 0,
            borderStyle: 'solid',
            borderColor: '#999999',
            borderRadius: 6,
            alignItems: 'baseline',
            paddingLeft: 20,
            fontSize: 18,
          },
          datePicker: {
            backgroundColor: '#d1d3d8',
            justifyContent: 'center',
          },
        }}
        onDateChange={date => {
          onChange(date);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputDateContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  inputDateContainerField: {
    // width: width * 0.9,
  },
});

export default MyDatePicker;
