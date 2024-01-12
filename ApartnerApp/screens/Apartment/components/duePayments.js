import React, {useState,useInterval} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';

const DuePayments = (
    {imageHiddenChange,
    notificationCount,
    viewVisitChange,
    duePayments,
    visitorUpdatedCount}
) => {
  const [count, setCount] = useState(0);
  const onPress = () => {
    imageHiddenChange();
  };
  const onPressVisitor = () => {
    viewVisitChange();
  };
 
  

  return (
    <View style={styles.noticeView}>
      <Text style={styles.dateInNotice}>Total Due Payments</Text>
      {/* <Text>There will be a water cut from 9am to 2pm.</Text> */}

      <View style={styles.noticeViewUnits}>
        {/* <View style={styles.unitUpdate}>
          <Text style={styles.notificationText}>Dues</Text>  
        </View> */}
        <View style={styles.unitUpdate}>
          <TouchableHighlight disabled> 
            <View style={styles.button}>
              <Text style={styles.notificationText}>Total Due Payment {duePayments?":"+duePayments:null}</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* <View style={styles.unitUpdate}>
          <TouchableHighlight onPress={onPress}>
            <View style={styles.button}>
              <Text style={styles.notificationText}>Utility</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.unitUpdate}>
          <TouchableHighlight onPress={onPress}>
            <View style={styles.button}>
              <Text style={styles.notificationText}>Bookings</Text>
            </View>
          </TouchableHighlight>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noticeView: {
    
    height: 200,
    paddingTop: 20,
    paddingLeft: 24,
    // backgroundColor:"red"
  },
  dateInNotice: {
    fontFamily: 'Roboto-Bold',
  },
  noticeViewUnits: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 20,
    borderColor: 'green',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    height: '100%',
    width: '100%',
  },
  notificationText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    paddingTop: 40,
  },
  unitUpdate: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
  },
});

export default DuePayments;
