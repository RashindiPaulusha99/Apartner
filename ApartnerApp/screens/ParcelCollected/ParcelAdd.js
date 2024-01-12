import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {Input, Overlay} from 'react-native-elements';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {setParcelFlagUpdatedAction} from '../VisitorManager/actions/parcel-actions';
import {saveParcelData} from './services/ParcelCollectedService';
import {
  MainContainer,
  TopCardContainer,
  DatepickerFormContainerParcel,
} from '../../components/';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;
const ParcelAdd = ({
  navigation,
  selectedParcelData,
  selectedUnit,
  updateParcelDataProps,
  parcelDataList,
  loggedInUserData,
  selectedApartmentData,
}) => {
  const [date, setDate] = useState(new Date());
  const [spinner, setSpinner] = useState(false);
  const [nameOfCompany, SetNameOfCompany] = useState('');
  const [viewCourier, setViewCourier] = useState('');
  const [deliveryId, setDeliveryId] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [enableAddVisitorButton, setEnableAddVisitorButton] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [showNotification, setShowNotification] = useState(false);
  const [complaintSaving, setComplaintSaving] = useState(false);
  useEffect(() => {
    validateForm();
  }, [nameOfCompany, viewCourier, additionalNote, date]);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);

  const onChange = event => {
    setDate(event);
  };
  const saveParcelInfo = async () => {
    setSpinner(true);
    try {
      const dataParams = {
        courier_name: viewCourier,
        company_name: nameOfCompany,
        delivery_id: deliveryId,
        dateTime_arrival: date,
        apartment_complex_id: selectedApartmentData.key,
        additionalNotes: additionalNote,
        createdBy: loggedInUserData.user_id,
        unitId: selectedUnit.apartment_unit_id,
      };
      const saveParcelAddData = await saveParcelData(dataParams);

      if (saveParcelAddData.data.message == 'success') {
        displayNotification('success', 'Add parcel Saved Successfully');
        setSpinner(false);
      } else {
        displayNotification('error', 'Add parcel Saving Failed');
        setSpinner(false);
      }
    } catch (error) {
      displayNotification('error', 'Add parcel Saving Failed');
      setSpinner(false);
    }
  };
  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);

    if (type == 'success') {
      setTimeout(() => {
        setComplaintSaving(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setComplaintSaving(false);
    }
  };
  const validateForm = () => {
    let validation = false;
    if (
      nameOfCompany != '' &&
      viewCourier != '' &&
      deliveryId != '' &&
      additionalNote != '' &&
      date
    ) {
      validation = true;
    }
    setEnableAddVisitorButton(validation);
  };
  const navigateToHome = () => {
    navigation.goBack();
  };
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Add Parcel"
      changeUnitState={false}>
      <TopCardContainer customHeight={height * 0.87 - statusBarHeight}>
        <View style={styles.bottomCard}>
          <View style={styles.cardHeaderView}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardOpeningTime={0}>
              <View>
                <View style={styles.formContainer}>
                  <Input
                    label="Name of the courier company"
                    onChangeText={text => {
                      SetNameOfCompany(text !== '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownText}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    label="Courier Name"
                    onChangeText={text => {
                      setViewCourier(text !== '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownText}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    label="Delivery ID"
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownText}
                    placeholderTextColor="#9B9B9B"
                    onChangeText={text => {
                      setDeliveryId(text !== '' ? text : '');
                    }}
                  />
                </View>

                <View style={styles.formDateContainer}>
                  <DatepickerFormContainerParcel
                    dateValue={date}
                    label="Date of Collection"
                    onChangeDate={onChange}
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    label="Additional Notes"
                    onChangeText={text => {
                      setAdditionalNote(text !== '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownText}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              disabled={!enableAddVisitorButton || complaintSaving}
              style={
                enableAddVisitorButton
                  ? styles.buttonMainView
                  : styles.buttonMainViewDisabled
              }
              onPress={saveParcelInfo}>
              <Text style={styles.parcelText}>Add Parcel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TopCardContainer>
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      <Overlay
        overlayStyle={{
          backgroundColor: 'transparent',
          padding: 0,
          marginTop: 0,
          justifyContent: 'center',
        }}
        fullScreen={true}
        backdropStyle={{backgroundColor: 'transparent'}}
        isVisible={spinner}>
        <ActivityIndicator size="large" color="#0E9CC9" />
      </Overlay>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    lineHeight: 18,
    color: '#9B9B9B',
    fontSize: 14,
    fontWeight: '500',
  },
  formDateContainer: {
    paddingHorizontal: 15,
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
  },
  inputFieldContainer: {
    width: width * 0.79,
    height: 23,
    marginTop: height * 0.03,
    borderColor: '#C8C8C8',
  },
  buttonMainViewDisabled: {
    width: width * 0.87,
    height: height * 0.08,
    backgroundColor: '#96BAC6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parcelText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  buttonMainView: {
    width: width * 0.87,
    height: height * 0.08,
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  bottomCard: {
    height: '90%',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    marginTop: 10,
  },

  buttonView: {
    alignItems: 'center',
  },
  cardHeaderView: {
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  selectedParcelData: state.apartmentState.selectedParcel,
  selectedUnit: state.apartmentState.selectedUnit,
  parcelDataList: state.parcelState,
  loggedInUserData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
});

const mapDispatchToProps = dispatch => ({
  updateParcelDataProps: (payload, callback) =>
    dispatch(setParcelFlagUpdatedAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParcelAdd);
