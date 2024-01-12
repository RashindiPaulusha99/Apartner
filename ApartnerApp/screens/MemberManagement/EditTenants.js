import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Keyboard,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
// External modules
import {Overlay, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import RNFormData from 'form-data';
import {connect} from 'react-redux';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import VectorIcons from 'react-native-vector-icons/MaterialIcons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Internal modules
import CalenderIcon from '../../assets/images/calendarIcon.svg';
import UploadCamera from '../../assets/icons/new_ui/photo_camera_black_24dp.png';
import RightIcone from '../../assets/images/check.png';
import Aicon from '../../assets/images/Aicon.svg';
import userMissing from '../../assets/images/person-icon.png';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {
  MainContainer,
  DefaultButtonPlain,
  DatePickerContainer,
} from '../../components/';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {changeTenantAction} from './actions/apartment-action';
import {
  updateMemberDataApi,
  updateIsEnabledUser,
  deleteTenantData,
} from './services/apartment-service';
import ContainerBottomSheet from '../../components/containers/bottomSheetV2';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import ErrorIcon from '../../assets/icons/error_black.svg';
import PopupContainer from '../../components/containers/popupContainer';
import SwitchToggle from 'react-native-switch-toggle';

const {width, height} = Dimensions.get('window');

const EditTenants = ({
  navigation,
  apartmentUnitsList,
  loggedInUserData,
  currentMemberProfileDetails,
  tenantStatusChange,
  tenantListChange,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [creatingTenant, setCreatingTenant] = useState(false);
  const [enableAddTenantButton, setEnableAddTenantButton] = useState(false);
  const [visitingUnitData, setVisitingUnitData] = useState('');
  const [changedResidentUnit, setChangedResidentUnit] = useState(false);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [openBottomSheetLinkUser, setOpenBottomSheetLinkUser] = useState(false);
  const [enableRemoveButton, setEnableRemoveButton] = useState(false);
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);
  const [imageResponse, setImageResponse] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [relationshipData, setRelationshipData] = useState('Relative');
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedRemove, setCheckedRemove] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] =
    useState('');
  const [successfulStatus, setSuccessfulStatus] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    if (typeof imageResponse.uri !== 'undefined') {
      setProfilePictureToDisplay(imageResponse.uri);
    }
    tenantStatusChange(false);
  }, [imageResponse, tenantListChange]);

  useEffect(() => {
    intiialUnitChange();
  }, []);

  const intiialUnitChange = () => {
    const initialUnit = apartmentUnitsList.filter((item) => {
      if (
        item.apartment_unit_id === currentMemberProfileDetails.apartment_unit_id
      ) {
        return item;
      }
    });
    setVisitingUnitData(initialUnit[0]);
    setFirstName(currentMemberProfileDetails.first_name);
    setNicNumber(currentMemberProfileDetails.nic_passport);
    setContactNo(currentMemberProfileDetails.contact_primary);
    setEmailAddress(currentMemberProfileDetails.email);
    setDateOfBirth(
      currentMemberProfileDetails.dob &&
        moment(currentMemberProfileDetails.dob).toDate(),
    );
    setProfilePictureToDisplay(currentMemberProfileDetails.imageUrl);
    setRelationshipData(currentMemberProfileDetails.relationship_name);
    setIsEnabled(
      currentMemberProfileDetails.enabledUser === 'active' ? true : false,
    );
  };
  const navigateToBack = () => {
    navigation.navigate('MemberManager');
  };

  const saveTenantData = async (approvalToLinkUser = false) => {
    try {
      setSpinner(true);
      displayNotification(false, '');
      let formData = new RNFormData();
      formData.append('firstName', firstName);
      formData.append('dob', moment(dateOfBirth).format('YYYY-MM-DD'));
      formData.append('nic', nicNumber);
      formData.append('email', emailAddress);
      formData.append('userId', currentMemberProfileDetails.user_id);
      formData.append('userRowId', currentMemberProfileDetails.user_row_id);
      formData.append('unitId', visitingUnitData.apartment_unit_id);
      formData.append('unitRowId', visitingUnitData.apartment_unit_row_id);
      formData.append('createdBy', loggedInUserData.user_id);

      if (isEnabled === false) {
        formData.append('enabledUser', 'deactive');
      }

      if (typeof imageResponse.type !== 'undefined') {
        formData.append('profilePic', imageResponse);
      }
      if (approvalToLinkUser) {
        formData.append('approvalToLinkUser', true);
        formData.append(
          'newUserUnitRowId',
          visitingUnitData.apartment_unit_row_id,
        );
        formData.append('newUserUnitId', visitingUnitData.apartment_unit_id);
      }
      if (contactNo != currentMemberProfileDetails.contact_primary) {
        formData.append('contactPrimary', contactNo);
      }
      if (relationshipData) {
        formData.append('relationship', relationshipData);
      }

      if (currentMemberProfileDetails.apartment_unit_user_relationship_id) {
        formData.append(
          'existingRelationshipId',
          currentMemberProfileDetails.apartment_unit_user_relationship_id,
        );
        formData.append(
          'existingRelationshipRowId',
          currentMemberProfileDetails.apartment_unit_user_relationship_row_id,
        );
      }
      setCreatingTenant(true);
      const responseData = await updateMemberDataApi(formData);

      if (responseData.data.body.status != 'error') {
        setSpinner(false);
        if (responseData.data.body.alreadyHasAUserForContactNumber) {
          displayNotification(
            'error',
            'Already has a user for this phone number',
          );
        } else {
          setSuccessfulStatus(true);
          setOpenBottomSheetLinkUser(true);

          displayNotification('success', 'Tenant Saved Successfully');
          let enabledUserData = {
            ...responseData.data.body,
            unitName: visitingUnitData.unit_name,
          };

          await AsyncStorage.setItem(
            'userEnabledData',
            `${JSON.stringify(enabledUserData)}`,
          );
          tenantStatusChange(true);
        }
      } else if (responseData.data.body.isEmailUnique == false) {
        setSpinner(false);
        displayNotification('error', 'Email address already in use');
      } else {
        setSpinner(false);
        displayNotification('error', 'Tenant Save Failed');
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
      setSpinner(false);
    } finally {
      setCreatingTenant(false);
    }
  };
  /**
   * <b>handler to display the popup notification according to the type</b>
   * @author Sandun M
   * @since 2021-06-21
   */
  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);
  };

  const deleteTenant = async () => {
    try {
      setSpinner(true);
      const dataParams = {
        apartmentUnitUserRelationshipId:
          currentMemberProfileDetails.apartment_unit_user_relationship_id,
        apartmentUnitUserRelationshipRowId:
          currentMemberProfileDetails.apartment_unit_user_relationship_row_id,
      };

      const deleteTenant = await deleteTenantData(dataParams);
      tenantStatusChange(true);
      if (deleteTenant.data.message == 'success') {
        displayNotification('success', 'Tenant Deleted Successfully');
        setTimeout(() => {
          setSpinner(false);
          navigateToBack();
        }, 2000);
      } else {
        displayNotification('error', 'Tenant Delete Failed');
        setSpinner(false);
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
      setSpinner(false);
    } finally {
      tenantStatusChange(true);
    }
  };
  const updateIsEnabledUserApi = async () => {
    setSpinner(true);
    try {
      const dataParams = {
        userId: currentMemberProfileDetails.user_id,
        isEnableUser: 'deactive',
        userRowId: currentMemberProfileDetails.user_row_id,
      };
      const updateIsEnabledUserData = await updateIsEnabledUser(dataParams);
      if (loggedInUserData.user_id === currentMemberProfileDetails.user_id) {
        setTimeout(() => {
          setSpinner(false);
          setOpenBottomSheetLinkUser(false);
          navigateToWelcomeBack();
        }, 2000);
      } else {
        setTimeout(() => {
          setSpinner(false);
          setOpenBottomSheetLinkUser(false);
          navigateToMemberManager();
        }, 2000);
      }
    } catch (error) {}
  };

  const navigateToMemberManager = () => {
    navigation.navigate('MemberManager');
  };

  const changeCalendar = (event, selectedDate) => {
    const currentDate = selectedDate !== undefined ? selectedDate : new Date();
    setShowCalendar(false);
    setDateOfBirth(currentDate);
  };

  const showDatepicker = () => {
    setShowCalendar(true);
  };

  const onChangeDate = (event) => {
    setDateOfBirth(event);
  };

  const visibilityHandler = (status) => {
    setVisibleBottomSheet(status);
  };
  const unitHandler = (unit) => {
    setVisitingUnitData(unit);
    setChangedResidentUnit(true);
  };

  const validateForm = () => {
    let validation = false;
    if (
      firstName &&
      firstName != '' &&
      dateOfBirth &&
      dateOfBirth != '' &&
      nicNumber &&
      nicNumber != '' &&
      emailAddress &&
      emailAddress != '' &&
      contactNo &&
      contactNo
    ) {
      validation = true;
    }
    setEnableAddTenantButton(validation);
  };
  const validateRemoveForm = () => {
    let validation = false;
    if (checked != false || checkedRemove != false) {
      validation = true;
    }
    setEnableRemoveButton(validation);
  };

  useEffect(() => {
    validateForm();
    validateRemoveForm();
  }, [firstName, dateOfBirth, nicNumber, emailAddress, checked, checkedRemove]);

  const cameraPicChange = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (responses) => {
        if (responses.assets) {
          let response = responses.assets[0];
          if (response.uri) {
            let path = response.uri;
            if (!response.fileName) {
              response.fileName = path.split('/').pop();
            }
            setImageResponse({
              name: response.fileName,
              type: response.type,
              uri: path,
            });
          }
        }
        setModalVisible(false);
      },
    );
  };

  const galleryPicChange = () => {
    setModalVisible(!modalVisible);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      (responses) => {
        if (responses.assets) {
          let response = responses.assets[0];
          if (response.uri) {
            let path = response.uri;
            if (!response.fileName) {
              response.fileName = path.split('/').pop();
            }
            setImageResponse({
              name: response.fileName,
              type: response.type,
              uri: path,
            });
          }
        }
      },
    );
  };

  const onClose = () => {
    visibilityHandler(false);
  };

  const keyboardDissmissHandler = () => {
    setShow(false);
    setShowCalendar(false);
    Keyboard.dismiss();
  };
  const removeMember = async () => {
    if (checked === true && checkedRemove === true) {
      await deleteTenant();
      await updateIsEnabledUserApi();
    } else if (checked === true && checkedRemove === false) {
      deleteTenant();
    } else if (checked === false && checkedRemove === true) {
      updateIsEnabledUserApi();
    } else {
    }
  };
  const continueButton = async () => {
    setOpenBottomSheetLinkUser(true);
  };
  const TopRowContainer = () => {
    return (
      <ScreenHeader headerName="Edit Tenant" navigateToBack={navigateToBack} />
    );
  };
  const navigateToWelcomeBack = async () => {
    setTimeout(() => {
      setSpinner(false);
    }, 2000);
    await AsyncStorage.clear();
    navigation.navigate('SpalshScreen');
  };
  const renderInner = () => (
    <View style={styles.rejectPopopRemove}>
      <View style={styles.errorIconImageView}>
        <ErrorIcon />
      </View>
      <View style={styles.linkMobileTextView}>
        <Text style={styles.linkMobileText}>Remove Member</Text>
      </View>

      <View style={styles.secondMainTitleViewRemove}>
        <View style={styles.checkboxContainer}>
          <View>
            <Text style={styles.discripctionViewRemove}>
              Delete Member from Unit
            </Text>
            <Text style={styles.discripctionViewSecondRemove}>
              app related updates & promotions
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.iconCheckBoxContainer}
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}>
              {checked === true ? <Image source={RightIcone} /> : <Text />}
            </TouchableOpacity>
          </View>
        </View>
        {isEnabled === true ? (
          <View style={styles.checkboxContainer}>
            <View>
              <Text style={styles.discripctionViewRemove}>
                Remove Apartner Login
              </Text>
              <Text style={styles.discripctionViewSecondRemove}>
                Reminders, Receipts & Invoices
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconCheckBoxContainer}
              status={checkedRemove ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheckedRemove(!checkedRemove);
              }}>
              {checkedRemove === true ? (
                <Image source={RightIcone} />
              ) : (
                <Text />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.checkboxContainer}>
            <View>
              <Text style={styles.discripctionViewRemoveDisable}>
                Remove Apartner Login
              </Text>
              <Text style={styles.discripctionViewSecondRemove}>
                Reminders, Receipts & Invoices
              </Text>
            </View>
            <TouchableOpacity
              style={styles.iconCheckBoxContainerDisable}
              disabled={true}
              status={checkedRemove ? 'checked' : 'unchecked'}
              onPress={() => {
                setCheckedRemove(!checkedRemove);
              }}>
              {checkedRemove === true ? (
                <Image source={RightIcone} />
              ) : (
                <Text />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.ButtonView}>
        <DefaultButtonPlain
          disabled={!enableRemoveButton}
          submit={removeMember}
          title="Continue"
          customStyle={
            enableRemoveButton != true
              ? {width: '80%', backgroundColor: '#96BAC6'}
              : {width: '80%'}
          }
        />
      </View>
    </View>
  );
  const successfullBottomSheetInner = () => (
    <PopupContainer
      maintitle="Success!"
      subtitle="Tenant has been changed."
      navigateToClose={() => {
        isEnabled === true
          ? navigation.navigate('CreateAccount')
          : navigation.goBack();
        setSuccessfulStatus(false);
        setOpenBottomSheetLinkUser(false);
      }}
    />
  );
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Edit Tenant"
      subTitle=" Add frequent or one-time visitors"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}>
      <>
        <View style={styles.bottomRowContainer}>
          <View style={styles.userCard}>
            <View style={styles.topContainerLeftSide}>
              <Aicon width={17} height={17} />
              <Text style={styles.userText}>Create a user account</Text>
            </View>
            <View style={styles.containerToggle}>
              <SwitchToggle
                onPress={() => toggleSwitch()}
                switchOn={isEnabled}
                backgroundColorOn="#DBEAEF"
                circleColorOn="#84C7DD"
                containerStyle={{
                  width: 70,
                  height: 30,
                  borderRadius: 25,
                  padding: 2,
                }}
                circleStyle={{
                  width: 27,
                  height: 27,
                  borderRadius: 20,
                }}
              />
            </View>
          </View>
          <View style={styles.bottomRowTopContainer}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              extraHeight={135}
              extraScrollHeight={50}
              keyboardOpeningTime={0}>
              <View
                style={styles.scroll}
                onStartShouldSetResponder={() => true}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  style={{flex: 1}}>
                  <View style={{paddingBottom: 30}}>
                    <View style={styles.imageUploadContainer}>
                      <View style={styles.uploadCorner}>
                        {profilePictureToDisplay ? (
                          <Image
                            style={styles.profilePicture}
                            source={{uri: profilePictureToDisplay}}
                          />
                        ) : (
                          <Image
                            style={styles.profilePictureEmpty}
                            source={userMissing}
                          />
                        )}
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => setModalVisible(true)}
                          style={styles.uploadCameraContainer}>
                          <Image
                            source={UploadCamera}
                            style={{width: 24, height: 24}}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.residentUnitContainer}>
                      <Text style={styles.placeHolderText}>
                        Residence Unit *
                      </Text>
                      <TouchableOpacity
                        style={styles.residentUnitContainerBox}
                        onPress={() =>
                          setVisibleBottomSheet(!visibleBottomSheet)
                        }>
                        <Text style={styles.residentUnitText}>
                          {visitingUnitData &&
                          visitingUnitData.unit_name !== null
                            ? visitingUnitData.unit_name
                            : ''}
                        </Text>
                        {visibleBottomSheet ? (
                          <VectorIcons
                            name="keyboard-arrow-up"
                            size={20}
                            color="#000000"
                          />
                        ) : (
                          <VectorIcons
                            name="keyboard-arrow-down"
                            size={20}
                            color="#000000"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                    <Input
                      containerStyle={styles.inputContainerMainStyle}
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      renderErrorMessage={false}
                      onFocus={() => {
                        setEnableShift(false);
                        onClose();
                      }}
                      label="Name *"
                      placeholderTextColor="#C8C8C8"
                      value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text != '' ? text : '');
                      }}
                    />

                    <Input
                      containerStyle={styles.inputContainerMainStyle}
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      renderErrorMessage={false}
                      onFocus={() => {
                        setEnableShift(false);
                        onClose();
                      }}
                      label="NIC / Passport *"
                      placeholderTextColor="#C8C8C8"
                      value={nicNumber}
                      onChangeText={(text) => {
                        setNicNumber(text != '' ? text : '');
                      }}
                    />
                    <DatePickerContainer
                      dateValue={dateOfBirth}
                      label="Date of Birth *"
                      onChangeDate={onChangeDate}
                    />

                    <Input
                      containerStyle={styles.inputContainerMainStyle}
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      renderErrorMessage={false}
                      onFocus={() => {
                        setEnableShift(true);
                        onClose();
                      }}
                      label="Contact No. * "
                      placeholderTextColor="#C8C8C8"
                      keyboardType="numeric"
                      value={contactNo}
                      onChangeText={(text) => setContactNo(text)}
                    />

                    <Input
                      containerStyle={styles.inputContainerMainStyle}
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      renderErrorMessage={false}
                      label="Email Address *"
                      placeholderTextColor="#C8C8C8"
                      onFocus={() => {
                        setEnableShift(true);
                        onClose();
                      }}
                      autoCapitalize="none"
                      autoComplete={false}
                      value={emailAddress}
                      onChangeText={(text) => {
                        setEmailAddress(text != '' ? text : '');
                      }}
                    />
                  </View>
                </ScrollView>
              </View>
            </KeyboardAwareScrollView>
            <View style={styles.buttonView}>
              <DefaultButtonPlain
                submit={continueButton}
                title="Remove"
                customStyle={{width: '32.5%', backgroundColor: '#DD1C3A'}}
              />
              <DefaultButtonPlain
                disabled={!enableAddTenantButton}
                submit={saveTenantData}
                title="Save changes"
                customStyle={{width: '62.5%'}}
              />
            </View>
          </View>
        </View>
        <Overlay
          ModalComponent={Modal}
          isVisible={modalVisible}
          animationType="slide"
          backdropStyle={{backgroundColor: 'transparent'}}
          overlayStyle={styles.modalView}
          onBackdropPress={() => setModalVisible(false)}>
          <Text style={styles.modalText}>Please Select an Option</Text>
          <TouchableOpacity
            style={styles.bottonCardBottom}
            onPress={() => cameraPicChange()}>
            <View style={styles.bottonCardContainer}>
              <Text style={styles.bottonCardContainerText}>Camera</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottonCardBottom}
            onPress={() => galleryPicChange()}>
            <View style={styles.bottonCardContainer}>
              <Text style={styles.bottonCardContainerText}>Gallery</Text>
            </View>
          </TouchableOpacity>
        </Overlay>
        {showCalendar && (
          <DateTimePicker
            testID="dateTimePicker"
            value={
              dateOfBirth.toDateString() != 'Invalid Date'
                ? moment(dateOfBirth).toDate()
                : new Date()
            }
            mode="date"
            is24Hour={false}
            display="default"
            maximumDate={new Date()}
            onChange={changeCalendar}
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
        {visibleBottomSheet === true ? (
          <ChangeUnitBottomSheet
            onVisible={visibleBottomSheet}
            visibilityHandler={visibilityHandler}
            unitHandler={unitHandler}
            unitList={apartmentUnitsList}
            bottomSheetHeight={Platform.OS === 'ios' && [250, 300, 0]}
          />
        ) : null}

        <Overlay
          overlayStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            marginTop: 0,
            justifyContent: 'center',
          }}
          backdropStyle={{backgroundColor: 'transparent'}}
          fullScreen={true}
          isVisible={spinner}>
          <ActivityIndicator size="large" color="#0E9CC9" />
        </Overlay>
        {openBottomSheetLinkUser ? (
          <Overlay
            overlayStyle={{
              backgroundColor: 'rgba(226, 226, 226, 0.8)',
              padding: 0,
              marginTop: 0,
              justifyContent: 'space-between',
            }}
            fullScreen={true}
            isVisible={openBottomSheetLinkUser}
            onBackdropPress={navigateToBack}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              }}>
              <TopRowContainer />
            </View>

            <ContainerBottomSheet
              onVisible={openBottomSheetLinkUser}
              visibilityHandler={visibilityHandler}
              children={
                successfulStatus ? successfullBottomSheetInner : renderInner
              }
              height={successfulStatus ? 250 : 335}
            />
          </Overlay>
        ) : null}
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  bottomRowContainer: {
    backgroundColor: '#FFFFFFDD',
    height: height * 0.874,
    width: '95%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    paddingVertical: height * 0.02,
  },
  userCard: {
    width: '100%',
    height: 39,
    backgroundColor: '#EEFAFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bottomRowTopContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9,
    height: '100%',
    paddingBottom: height * 0.025,
  },
  topContainerLeftSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    marginLeft: 5,
  },
  residentUnitContainer: {
    width: '100%',
    marginBottom: 15,
  },
  residentUnitContainerBox: {
    backgroundColor: '#F5F7FD',
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#84C7DD',
    height: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeHolderText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#9B9B9B',
    lineHeight: 18,
    marginBottom: 8,
  },
  residentUnitText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 21,
    color: '#212322',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    lineHeight: 18,
  },
  inputContainerMainStyle: {
    height: 70,
    width: '100%',
    paddingHorizontal: 0,
  },
  inputContainerField: {
    width: '100%',
    height: 21,
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
    alignItems: 'flex-start',
    marginTop: 14,
    marginBottom: 4,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    lineHeight: 18,
    color: '#9B9B9B',
    fontSize: 14,
    fontWeight: '500',
  },
  bottonCardBottom: {
    marginVertical: 10,
    backgroundColor: '#DBEAEF',
    width: width * 0.35,
    height: height * 0.07,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0E9CC9',
    borderWidth: 1.3,
  },
  bottonCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bottonCardContainerText: {
    textAlign: 'center',
    color: '#0E9CC9',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },

  dobContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  dobIconContainer: {
    width: '10%',
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  scroll: {
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  profilePictureEmpty: {
    width: 100,
    height: 100,
  },
  imageUploadContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  uploadCameraContainer: {
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 25,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  rejectPopop: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: width,
  },
  rightImageview: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  emailText: {
    alignItems: 'center',
    marginTop: height * 0.001,
  },
  emailTextSent: {
    fontFamily: 'Roboto-Black',
    fontSize: 28,
    color: '#26272C',
  },
  ButtonViewBottomSheet: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'center',
  },
  rejectPopopRemove: {
    backgroundColor: '#FFFFFF',
    height: 350,
    width: width,
  },
  errorIconImageView: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  linkMobileTextView: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },

  linkMobileText: {
    fontFamily: 'Roboto-Black',
    fontSize: 28,
    color: '#26272C',
  },
  secondMainTitleViewRemove: {
    marginHorizontal: width * 0.1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.015,
    alignItems: 'center',
  },
  discripctionViewRemove: {
    color: '#004F71',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    lineHeight: 22,
  },
  discripctionViewSecondRemove: {
    color: '#4D4D4D',
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    lineHeight: 22,
  },
  ButtonView: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    justifyContent: 'center',
  },
  iconCheckBoxContainer: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discripctionViewRemoveDisable: {
    color: '#4D4D4D',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    lineHeight: 22,
  },
  iconCheckBoxContainerDisable: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#4D4D4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnitInMain: state.apartmentState.selectedUnit,
  currentMemberProfileDetails:
    state.memberDetailsState.currentMemberProfileDetails,
  tenantListChange: state.memberDetailsState.getTenantChangeDetails,
});
const mapDispatchToProps = (dispatch) => ({
  tenantStatusChange: (payload) => dispatch(changeTenantAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTenants);
