import React, {useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  Modal,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TouchableHighlight} from 'react-native-gesture-handler';

const Datepicker = ({show, setShow, date, onChangeDate}) => {
  // const [date, setDate] = useState(new Date(1598051730000));
  return (
    <View>
      <Modal
        // transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShow(false);
        }}
        visible={show}>
        <View style={{flex: 1}}>
          <TouchableHighlight
            style={{
              flex: 1,
              alignItems: 'flex-end',
              flexDirection: 'row',
              backgroundColor: 'red',
            }}
            activeOpacity={1}
            visible={show}
            onPress={() => {
              setShow(false);
            }}>
            <TouchableHighlight
              underlayColor="#ffffff"
              style={{flex: 1, borderTopColor: '#E9E9E9', borderTopWidth: 1}}
              onPress={() => {
                console.log('datepicker clicked');
              }}>
              <View
                style={{
                  backgroundColor: '#999999',
                  height: 256,
                  overflow: 'hidden',
                }}>
                <View style={{marginTop: 20}}>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={date => {
                      onChangeDate(date);
                    }}
                  />
                </View>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    console.log('cancelled');
                  }}
                  style={[styles.btnText, styles.btnCancel]}>
                  <Text>Cancel</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={() => {
                    console.log('done');
                  }}
                  style={[styles.btnText, styles.btnDone]}>
                  <Text>Done</Text>
                </TouchableHighlight>
              </View>
            </TouchableHighlight>
          </TouchableHighlight>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btnText: {
    position: 'absolute',
    top: 0,
    height: 42,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    left: 0,
  },
  btnDone: {
    right: 0,
  },
});
export default Datepicker;
