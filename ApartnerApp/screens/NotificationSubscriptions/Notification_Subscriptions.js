import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {CheckBox} from 'react-native-elements';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from '../Notifications/actions/apartment-action';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import {
  saveUserNotificationSubscription,
  getNotificationSubscriptionData,
  getUserNotificationSubscriptionData,
} from '../NotificationSubscriptions/services/Notification_SubscriptionsService.js';
import {Alert} from 'react-native';

const {width, height} = Dimensions.get('window');

const Notification_Settings = ({navigation, loggedInUserData}) => {
  const [checked1, setSelection1] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [checked, setSelection] = useState([]);
  const [notificationCheckedList, setNotificationCheckedList] = useState([]);

  useEffect(() => {
    initDataInPage();
  }, []);

  const initDataInPage = async () => {
    const getData = await getNotificationSubscriptionData();

    const notifications = getData.data[0].map(item => {
      return {
        ...item,
        checked: false,
      };
    });

    setNotificationList(notifications);

    const dataParams = {userId: loggedInUserData.user_id};
    const checkedData = await getUserNotificationSubscriptionData(dataParams);

    setNotificationCheckedList(checkedData.data[0]);
    if (checkedData.data.length > 0) {
      const initialnotificationList = notifications.map(item => {
        let status = item.notification_subscription_id.toString();
        return {
          ...item,
          checked: checkedData.data[0].notification_subscription_id.includes(
            status,
          ),
        };
      });

      setNotificationList(initialnotificationList);
    }
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const addNotificationSubscription = async () => {
    let notificationListString = [];
    const savedata = notificationList.map(item => {
      if (item.checked === true) {
        notificationListString.push(item.notification_subscription_id);
      }
    });

    if (notificationCheckedList != null) {
      // update existing record
      let usernotificationdata = {
        recordedBy: 1,
        userNotificationId:
          notificationCheckedList.user_notification_subscription_id,
        notificationSubscriptionId: notificationListString.toString(),
        userNotificationSubscriptionRowId:
          notificationCheckedList.user_notification_subscription_row_id,
        userId: loggedInUserData.user_id,
      };
      const updateNotificationSubscription = await saveUserNotificationSubscription(
        usernotificationdata,
      );

      if (updateNotificationSubscription.data.body.msg_status != 'fail') {
        Alert.alert('', 'Notification Settings Updated Successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('', 'Notifaction Settings Not Updated');
      }
    } else {
      //create new record
      let usernotificationdata = {
        recordedBy: 1,
        notificationSubscriptionId: notificationListString.toString(),
        userId: loggedInUserData.user_id,
      };

      const addUserNotificationSubscription = await saveUserNotificationSubscription(
        usernotificationdata,
      );

      if (addUserNotificationSubscription.data.message == 'success') {
        Alert.alert('', 'Notification Settings Saved Successfully');
        navigation.navigate('Home');
      } else {
        Alert.alert('', 'Notifaction Settings Not Saved');
      }
    }
  };

  const onClickNotification = notificationClicked => {
    const selectionList = notificationList.map(item => {
      if (
        item.notification_subscription_id ===
        notificationClicked.notification_subscription_id
      ) {
        return {
          ...item,
          checked: !item.checked,
        };
      } else return item;
    });
    setNotificationList(selectionList);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.topRowContainer}>
          <TouchableOpacity
            onPress={navigateToHome}
            style={styles.BackContainer}>
            <BackImage />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications Settings</Text>
        </View>
        <View style={styles.subTitleContentContainer}>
          <Text style={styles.subTitleContentText}>Change your settings</Text>
        </View>
        <View>
          <Text style={styles.textTitle}>
            {'\n'}
            You can control push notifications as per your preference by
            checking individual notification categories below.
            {'\n'}
          </Text>
        </View>
        {notificationList &&
          notificationList.length > 0 &&
          notificationList.map(item => {
            return (
              <View style={styles.checkboxContainer}>
                <View>
                  <Text style={styles.label}> {item.notification}</Text>
                  <Text style={styles.textCheckbox}>{item.description}</Text>
                </View>
                <CheckBox
                  style={styles.checkbox}
                  checked={item.checked}
                  onPress={() => onClickNotification(item)}
                />
              </View>
            );
          })}
        <View style={styles.buttonMainContainer}>
          <View style={styles.continueBtn}>
            <TouchableOpacity
              onPress={addNotificationSubscription}
              style={styles.buttonContinue}>
              <View style={styles.btnTextContainer}>
                <Text style={styles.textContinue}>Save Changes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  BackContainer: {
    marginTop: height * 0.01,
    marginLeft: width * 0.03,
    width: 20,
  },
  mainContainer: {
    marginTop: width * 0.14,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
  },
  subTitleContentContainer: {
    marginLeft: width * 0.09,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  textTitle: {
    width: '80%',
    fontFamily: 'Poppins',
    fontSize: 12,
    marginBottom: 9,
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
  },
  buttonMainContainer: {
    paddingTop: 40,
  },
  buttonContinue: {
    backgroundColor: '#197B9A',
    borderColor: '#004F71',
    width: width * 0.9,
    height: height * 0.08,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextContainer: {
    flexDirection: 'row',
  },
  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueArrow: {
    marginHorizontal: 10,
  },
  continueBtn: {
    alignItems: 'center',
  },
  titleTextCheckbox: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  checkbox: {
    justifyContent: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 1,
    alignContent: 'flex-start',

    marginLeft: height * 0.02,
  },
  textCheckbox: {
    fontFamily: 'Poppins',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: width * 0.04,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),

  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notification_Settings);
