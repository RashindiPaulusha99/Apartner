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

import AddBtn from '../../assets/images/AddButton.svg';
import EditIcon from '../../assets/icons/new_ui/edit_black_24dp.svg';

import {
  getEmergencyContactDetails,
  updateEmergencyContactDetails,
} from '../MyProfile/services/emergencyContact-service';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import {
  MainContainer,
  DefaultButtonPlain,
  DefaultButtonPlainOutlined,
} from '../../components/';

const {width, height} = Dimensions.get('window');
const EmergencyContact = ({
  navigation,
  loggedInUserData,
  apartmentFacilityDataItems,
  setUpdatedUserData,
}) => {
  const inputContactNameRef = useRef(null);
  const inputRelshipRef = useRef(null);
  const inputContactNumRef = useRef(null);

  const [enableShift, setEnableShift] = useState(false);

  const navigateToMyProfile = () => {
    navigation.navigate('MyProfile');
  };

  const [
    emergencyContactDetailsList,
    setEmergencyContactDetailsList,
  ] = useState([]);

  const [emergencyContactPerson, setEmergencyContactPerson] = useState('');
  const [
    emergencyContactRelationship,
    setEmergencyContactRelationship,
  ] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [enableNameFields, setEnableNameField] = useState(false);
  const [enableRelationshipFields, setEnableRelationshipField] = useState(
    false,
  );
  const [enableContactFields, setEnableContactField] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(true);

  useEffect(() => {
    emergencyContactDetailsList;
    initDataInPage();
  }, []);

  useEffect(() => {
    if (enableNameFields) {
      inputContactNameRef.current.focus();
    }
  }, [enableNameFields]);

  useEffect(() => {
    if (enableRelationshipFields) {
      inputRelshipRef.current.focus();
    }
  }, [enableRelationshipFields]);

  useEffect(() => {
    if (enableContactFields) {
      inputContactNumRef.current.focus();
    }
  }, [enableContactFields]);

  const initDataInPage = async () => {
    setIsLoading(true);
    const dataParam = {userId: loggedInUserData.user_id};
    const getData = await getEmergencyContactDetails(dataParam);
    //
    setEmergencyContactDetailsList(getData.data.body);
    setEmergencyContactPerson(getData.data.body[0].emergency_contact_person);
    setEmergencyContactRelationship(
      getData.data.body[0].emergency_contact_relationship,
    );
    setEmergencyContactNumber(getData.data.body[0].emergency_contact);
    setIsLoading(false);
  };

  const updateEmergencyContactData = async () => {
    try {
      displayNotification(false, '');
      setIsLoading(true);
      setIsPressed(true);
      const savedata = {
        userRowId: loggedInUserData.user_row_id,
        userId: loggedInUserData.user_id,
        emergency_contact: emergencyContactNumber,
        emergency_contact_relationship: emergencyContactRelationship,
        emergency_contact_person: emergencyContactPerson,
      };
      const saveUpdateEmergencyData = await updateEmergencyContactDetails(
        savedata,
      );
      if (saveUpdateEmergencyData.data.body.updateUserEmergencyData != null) {
        displayNotification('success', 'Details Saved Successfully');
        setUpdatedUserData(saveUpdateEmergencyData.data.body.newUserData);
        setIsPressed(false);
      } else {
        displayNotification('error', 'Details Saving Failed');
      }
      setEnableNameField(false);
      setEnableRelationshipField(false);
      setEnableContactField(false);
      setIsPressed(false);
    } catch (error) {
      displayNotification('error', 'Error Occurred');
      console.log(error);
      setIsPressed(false);
    }
  };

  const hideHandlerName = () => {
    setEnableNameField(!enableNameFields);
  };
  const hideHandlerRelationship = () => {
    setEnableRelationshipField(!enableRelationshipFields);
  };
  const hideHandlerContact = () => {
    setEnableContactField(!enableContactFields);
  };

  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);

    if (type == 'success') {
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('MyProfile');
      }, 2000);
    } else if (type == 'error') {
      setIsLoading(false);
    }
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };

  return (
    <MainContainer
      navigateToHome={navigateToMyProfile}
      title="Emergency Contact"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}>
      <>
        <View style={styles.tabBox}>
          <View style={styles.tileContainer}>
            <View
              style={{
                marginTop: 20,
              }}
            />
            <View style={styles.inputNameContainer}>
              <Input
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputFieldName}
                value={emergencyContactPerson}
                disabled={!enableNameFields}
                labelStyle={styles.inputLabel}
                placeholderTextColor={'gray'}
                onChangeText={text => {
                  setIsPressed(false);
                  setEmergencyContactPerson(text);
                }}
                label="Contact Name"
                autoCapitalize="none"
                autoComplete={false}
                ref={inputContactNameRef}
                rightIcon={
                  <TouchableOpacity onPress={hideHandlerName}>
                    <EditIcon width={25} height={25} />
                  </TouchableOpacity>
                }
                disabledInputStyle={styles.inputFieldName}
              />
            </View>
            <View style={styles.inputNameContainer}>
              <Input
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                value={emergencyContactRelationship}
                disabled={!enableRelationshipFields}
                labelStyle={styles.inputLabel}
                placeholderTextColor={'gray'}
                onChangeText={text => {
                  setIsPressed(false);
                  setEmergencyContactRelationship(text);
                }}
                label="Relationship to Contact"
                autoCapitalize="none"
                autoComplete={false}
                ref={inputRelshipRef}
                rightIcon={
                  <TouchableOpacity onPress={hideHandlerRelationship}>
                    <EditIcon width={25} height={25} />
                  </TouchableOpacity>
                }
                disabledInputStyle={styles.inputField}
              />
            </View>
            <View style={styles.inputNameContainer}>
              <Input
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                value={emergencyContactNumber}
                disabled={!enableContactFields}
                labelStyle={styles.inputLabel}
                placeholderTextColor={'gray'}
                ref={inputContactNumRef}
                onChangeText={text => {
                  setIsPressed(false);
                  setEmergencyContactNumber(text);
                }}
                label="Contact Number"
                keyboardType="numeric"
                maxLength={14}
                autoCapitalize="none"
                rightIcon={
                  <TouchableOpacity onPress={hideHandlerContact}>
                    <EditIcon width={25} height={25} />
                  </TouchableOpacity>
                }
                disabledInputStyle={styles.inputField}
              />
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
              submit={updateEmergencyContactData}
              disabled={isPressed}
              title="Save Changes"
              customStyle={{width: '62.5%'}}
            />
          </View>
        </View>

        {showNotification && (
          <PopupTopNotification
            visible={showNotification}
            message={notificationDisplayMessage}
            navigation={navigation}
            type={showNotification}
          />
        )}
        <LoadingDialogue visible={isLoading} />
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  tabBox: {
    backgroundColor: 'rgba(255,255,255, 0.7)',
    height: Platform.OS === 'ios' ? '92%' : '90%',
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
    marginHorizontal: width * 0.04,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    width: '95%',
  },
  inputContainer: {
    paddingTop: 0,
    position: 'relative',
    zIndex: 10,
  },
  inputNameContainer: {
    alignItems: 'center',
  },
  inputBtnContainer: {
    alignItems: 'center',
  },
  inputContainerField: {
    width: '100%',
    height: 30,
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
  },
  inputField: {
    flexDirection: 'row',
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    paddingBottom: 4,
    borderWidth: 0,
    opacity: 1,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    color: '#9B9B9B',
    fontSize: 14,
  },
  addressDropDown: {
    position: 'relative',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  dropDownView: {
    borderColor: '#999999',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  buttonContainer: {
    position: 'relative',
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonLogin: {
    height: 50,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
    position: 'relative',
  },

  inputFieldName: {
    flexDirection: 'row',
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    paddingBottom: 4,
    borderWidth: 0,
    opacity: 1,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,

    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '600',
    color: 'grey',
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
)(EmergencyContact);
