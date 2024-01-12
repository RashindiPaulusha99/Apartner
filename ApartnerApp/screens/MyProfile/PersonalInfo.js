import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {} from 'react-native-elements';
import {connect} from 'react-redux';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import bgImage from '../../assets/images/bg-img.png';
import EditIcon from '../../assets/icons/new_ui/edit_black_24dp.svg';
import ChangeBloodBottomSheet from '../../components/containers/ChangeBloodBottomSheet';
import DateIcon from '../../assets/icons/new_ui/calendar_today_black_24dp.svg';
import {Alert} from 'react-native';
import {
  getPersonalInformation,
  updatePersonalInformation,
} from '../MyProfile/services/personalInformation-service';
import moment from 'moment';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import BottomSheet from '../../components/containers/bottomSheetCalendar';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import DateTimePicker from '@react-native-community/datetimepicker';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {MainContainer, DatePickerContainer} from '../../components/';
import DefaultButtonPlain from '../../components/buttons/defaultButtonPlain';
import DefaultButtonPlainOutlined from '../../components/buttons/defaultButtonPlainOutlined';
import BackgroundImage from '../../assets/images/my-profile-background.png';

const {width, height} = Dimensions.get('window');
const PersonalInfo = ({
  navigation,
  loggedInUserData,
  apartmentFacilityDataItems,
  setUpdatedUserData,
}) => {
  const inputNICRef = useRef(null);
  const inputProfessionRef = useRef(null);
  const inputBloodRef = useRef(null);

  const [enableShift, setEnableShift] = useState(false);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [bloodGroupDetails, setBloodGroupDetails] = useState('');
  const [disable, setDisable] = useState(true);

  const [
    personalInformationNicNumber,
    setPersonalInformationNicNumber,
  ] = useState('');
  const [
    personalInformationProfession,
    setPersonalInformationProfession,
  ] = useState('');
  const [enableNicFields, setEnableNicFields] = useState(false);
  const [enableProfessionFields, setEnableProfessionFields] = useState(false);
  const [openBottomSheetTwo, setOpenBottomSheetTwo] = useState(false);
  const [showDOB, setShowDOB] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    initDataInPage();
  }, []);

  useEffect(() => {
    if (enableNicFields) {
      inputNICRef.current.focus();
    }
  }, [enableNicFields]);

  useEffect(() => {
    if (enableProfessionFields) {
      inputProfessionRef.current.focus();
    }
  }, [enableProfessionFields]);

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
    setDisable(false);
  };
  const onClose = () => {
    visibilityHandler(false);
  };
  const navigateToMyProfile = () => {
    navigation.navigate('MyProfile');
  };
  const unitHandler = blood => {
    setBloodGroupDetails(blood.group);
  };

  const onChangeDate = event => {
    setDateOfBirth(event);
  };

  const initDataInPage = async () => {
    setIsDataLoading(true);
    try {
      const dataParam = {userId: loggedInUserData.user_id};
      const getData = await getPersonalInformation(dataParam);
      if (getData.data.message === 'success') {
        setPersonalInformationNicNumber(getData.data.body[0].nic_passport);
        setDateOfBirth(new Date(getData.data.body[0].dob));
        setPersonalInformationProfession(getData.data.body[0].profession);
        setBloodGroupDetails(getData.data.body[0].blood_group);
      }
    } catch (error) {
    } finally {
      setIsDataLoading(false);
    }
  };

  const updatePersonalInformationData = async () => {
    try {
      displayNotification(false, '');
      setDisable(true);
      setIsDataLoading(true);
      const savedata = {
        userRowId: loggedInUserData.user_row_id,
        userId: loggedInUserData.user_id,
        nic_passport: personalInformationNicNumber,
        dob: dateOfBirth,
        profession: personalInformationProfession,
        blood_group: bloodGroupDetails,
      };

      const saveUpdatePersonalInformationData = await updatePersonalInformation(
        savedata,
      );
      setDisable(false);
      if (saveUpdatePersonalInformationData.data.body.updateUserData != null) {
        setUpdatedUserData(
          saveUpdatePersonalInformationData.data.body.newUserData,
        );
        displayNotification('success', 'Information Saved Successfully');
      } else {
        displayNotification('error', 'Information Saving Failed');
      }
      setEnableNicFields(false);
      setEnableProfessionFields(false);
    } catch (error) {
      console.log(error);
      setDisable(false);
      displayNotification('error', 'Error Occurred');
    }
  };

  const hideHandlerNic = () => {
    setEnableNicFields(!enableNicFields);
  };
  const hideHandlerProfession = () => {
    setEnableProfessionFields(!enableProfessionFields);
  };

  const bloodgroup = [
    {
      key: 1,
      group: 'A+',
    },
    {
      key: 2,
      group: 'B+',
    },
    {
      key: 3,
      group: 'AB+',
    },
    {
      key: 4,
      group: 'AB-',
    },
    {
      key: 5,
      group: 'A-',
    },
    {
      key: 6,
      group: 'B-',
    },
    {
      key: 7,
      group: 'O-',
    },
    {
      key: 8,
      group: 'O+',
    },
  ];
  const popupCalender = async () => {
    await setOpenBottomSheetTwo(false);
    setDisable(false);
    setShowDOB(true);
  };

  const onChangeDOB = (event, selectedDate) => {
    setShowDOB(false);
    const currentDate = selectedDate !== undefined ? selectedDate : dateOfBirth;
    setDateOfBirth(currentDate);
  };

  /**
   * <b>handler to display the popup notification according to the type</b>
   * @author Sandun M
   * @since 2021-06-21
   */
  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);

    if (type == 'success') {
      setTimeout(() => {
        setIsDataLoading(false);
        navigation.navigate('MyProfile');
      }, 2000);
    } else if (type == 'error') {
      setIsDataLoading(false);
    }
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
    onClose();
  };
  return (
    <MainContainer
      navigateToHome={navigateToMyProfile}
      title="Personal Information"
      subTitle="View & update personal information"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}
      newHeader={true}
      backgroundImage={BackgroundImage}>
      <>
        <View style={styles.tabBox}>
          <View style={styles.tileContainer}>
            <View
              style={{
                width: '100%',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#26272C',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                View and update personal information
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
              }}>
              <View
                style={styles.scroll}
                onStartShouldSetResponder={() => true}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputNameContainer}>
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      value={personalInformationNicNumber}
                      disabled={!enableNicFields}
                      disabledInputStyle={{color: '#212322', opacity: 1}}
                      placeholderTextColor={'gray'}
                      onChangeText={text => {
                        setDisable(false);
                        setPersonalInformationNicNumber(text);
                      }}
                      onFocus={onClose}
                      ref={inputNICRef}
                      label="NIC / Passport"
                      autoCapitalize="none"
                      autoComplete={false}
                      rightIcon={
                        <TouchableOpacity onPress={hideHandlerNic}>
                          <EditIcon width={25} height={25} />
                        </TouchableOpacity>
                      }
                    />
                  </View>

                  <View style={styles.dateContainer}>
                    <DatePickerContainer
                      dateValue={dateOfBirth}
                      label="Date of Birth"
                      onChangeDate={onChangeDate}
                    />
                  </View>
                  <View style={styles.inputNameContainer}>
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      disabled={!enableProfessionFields}
                      disabledInputStyle={{color: '#212322', opacity: 1}}
                      value={personalInformationProfession}
                      labelStyle={styles.inputLabel}
                      placeholderTextColor={'gray'}
                      onChangeText={text => {
                        setDisable(false);
                        setPersonalInformationProfession(text);
                      }}
                      onFocus={onClose}
                      label="Profession"
                      autoCapitalize="none"
                      autoComplete={false}
                      ref={inputProfessionRef}
                      rightIcon={
                        <TouchableOpacity onPress={hideHandlerProfession}>
                          <EditIcon width={25} height={25} />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <View style={styles.inputNameContainer}>
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      disabled={!enableProfessionFields}
                      disabledInputStyle={{color: '#212322', opacity: 1}}
                      value={bloodGroupDetails}
                      labelStyle={styles.inputLabel}
                      placeholderTextColor={'gray'}
                      onChangeText={text => {
                        setDisable(false);
                      }}
                      onFocus={onClose}
                      label="Blood Group"
                      autoCapitalize="none"
                      autoComplete={false}
                      ref={inputBloodRef}
                      rightIcon={
                        <TouchableOpacity
                          onPress={() => setVisibleBottomSheet(true)}>
                          <EditIcon width={25} height={25} />
                        </TouchableOpacity>
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonView}>
            <DefaultButtonPlainOutlined
              submit={() => {
                navigateToMyProfile();
              }}
              title="Cancel"
              customStyle={{width: '32.5%'}}
            />
            <DefaultButtonPlain
              submit={updatePersonalInformationData}
              disabled={disable}
              title="Save Changes"
              customStyle={{width: '62.5%'}}
            />
          </View>
        </View>

        {visibleBottomSheet && (
          <ChangeBloodBottomSheet
            onVisible={visibleBottomSheet}
            visibilityHandler={visibilityHandler}
            unitHandler={unitHandler}
            bloodgroup={bloodgroup}
            bottomSheetHeight={[360, 300, 0]}
          />
        )}

        {showDOB && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            is24Hour={false}
            display="default"
            maximumDate={new Date()}
            onChange={onChangeDOB}
          />
        )}
        {showNotification && (
          <PopupTopNotification
            visible={showNotification}
            message={notificationDisplayMessage}
            navigation={navigation}
            type={showNotification}
          />
        )}
        <LoadingDialogue visible={isDataLoading} />
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  tabBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: Platform.OS === 'ios' ? '92%' : '90%',
    width: width * 0.97,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  inputContainer: {
    paddingTop: 0,
    position: 'relative',
    zIndex: 10,
  },
  inputNameContainer: {
    alignItems: 'center',
  },

  dateContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },

  inputContainerField: {
    width: '100%',
    height: 30,
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    opacity: 1,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    color: '#9B9B9B',
    fontSize: 14,
  },
  intputDateView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,

  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  setUpdatedUserData: payload => dispatch(setUpdatedUserDataAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersonalInfo);
