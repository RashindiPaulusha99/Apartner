import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  Modal,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

//External modules
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Overlay, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {connect} from 'react-redux';
import RNFormData from 'form-data';
import VectorIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';

//Internal modules
import CalenderIcon from '../../assets/icons/new_ui/calendar_today_black_24dp.svg';
import Aicon from '../../assets/images/Aicon.svg';
import UploadCamera from '../../assets/icons/new_ui/photo_camera_black_24dp.png';
import userMissing from '../../assets/images/person-icon.png';
import Icon from '../../assets/images/check_circle_green_24dp.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import BottomSheet from '../../components/containers/bottomSheetV2';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import {
  MainContainer,
  DefaultButtonPlain,
  DefaultButtonPlainOutlined,
  DatePickerContainer,
} from '../../components/';

import {saveTenantDataApi} from './services/apartment-service';
import {changeTenantAction} from './actions/apartment-action';
import SwitchToggle from 'react-native-switch-toggle';

const {width, height} = Dimensions.get('window');

const AddTenant = ({
  navigation,
  apartmentUnitsList,
  loggedInUserData,
  selectedUnitInMain,
  memberListChange,
  memberStatusChange,
  selectedApartmentComplex,
}) => {
  const [show, setShow] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [creatingTenant, setCreatingTenant] = useState(false);
  const [enableAddTenantButton, setEnableAddTenantButton] = useState(false);
  const [visitingUnitData, setVisitingUnitData] = useState(selectedUnitInMain);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [relationshipData, setRelationshipData] = useState('Relative');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);
  const [imageResponse, setImageResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saveResponse, setSaveResponse] = useState(null);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [showNotification, setShowNotification] = useState(false);
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    if (imageResponse != null && typeof imageResponse.uri !== 'undefined') {
      setProfilePictureToDisplay(imageResponse.uri);
    }
  }, [imageResponse, memberListChange]);

  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const navigateToBack = () => {
    navigation.goBack();
  };
  const saveTenantData = async () => {
    setSpinner(true);
    setEnableAddTenantButton(false);
    displayNotification(false, '');
    try {
      let formData = new RNFormData();

      formData.append('firstName', firstName);
      formData.append('dob', moment(dateOfBirth).format('YYYY-MM-DD'));
      formData.append('nic', nicNumber);
      formData.append('email', emailAddress);
      formData.append(
        'contactPrimary',
        `+94${
          contactNo.substr(0, 1) === '0' ? contactNo.substr(1) : contactNo
        }`,
      );
      formData.append('userId', loggedInUserData.user_id);
      formData.append('userRowId', loggedInUserData.user_row_id);
      formData.append('unitId', visitingUnitData.apartment_unit_id);
      formData.append('unitRowId', visitingUnitData.apartment_unit_row_id);
      formData.append('apartmentComplexId', selectedApartmentComplex.key);
      if (imageResponse != null) {
        formData.append('profilePicTenant', imageResponse);
      }
      if (relationshipData) {
        formData.append('relationShip', relationshipData);
      }
      setCreatingTenant(true);
      const saveUpdateEmergencyData = await saveTenantDataApi(formData);
      if (saveUpdateEmergencyData.data.body.userData != null) {
        setSpinner(false);
        setOpenBottomSheet(true);
        let enabledUserData = {
          ...saveUpdateEmergencyData.data.body.userData,
          unitName: visitingUnitData.unit_name,
        };
        await AsyncStorage.setItem(
          'userEnabledData',
          `${JSON.stringify(enabledUserData)}`,
        );
        setEnableAddTenantButton(true);
        await memberStatusChange(true);

        setSpinner(false);
        if (isEnabled === true) {
          navigation.navigate('CreateAccount');
          setOpenBottomSheet(false);
          setVisibleBottomSheet(false);
        } else {
          setSpinner(false);
          setOpenBottomSheet(true);
          setVisibleBottomSheet(false);
          displayNotification('success', 'Tenant Added Successfully');
        }
        if (saveUpdateEmergencyData.data != undefined) {
          setSaveResponse(saveUpdateEmergencyData);
        }
      } else if (saveUpdateEmergencyData.data.body.isEmailUnique == false) {
        setSpinner(false);
        displayNotification('error', 'Email address already in use');
      } else if (
        saveUpdateEmergencyData.data.body.isContactPrimaryUnique == false
      ) {
        setSpinner(false);
        displayNotification(
          'error',
          'Already has a user for this phone number',
        );
      } else {
        setSpinner(false);
        displayNotification('error', 'Tenant Add Failed');
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

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const unitHandler = unit => {
    setVisitingUnitData(unit);
  };
  const validateForm = () => {
    let validation = false;
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (
      firstName != '' &&
      dateOfBirth != '' &&
      nicNumber != '' &&
      emailAddress != '' &&
      regEmail.test(emailAddress) &&
      relationshipData != '' &&
      contactNo
    ) {
      validation = true;
    }
    setEnableAddTenantButton(validation);
  };

  useEffect(() => {
    validateForm();
  }, [firstName, dateOfBirth, nicNumber, emailAddress]);

  const cameraPicChange = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      responses => {
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

  const onChangeDate = event => {
    setDateOfBirth(event);
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
      responses => {
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
    Keyboard.dismiss();
  };
  const closeBottomsheet = () => {
    setOpenBottomSheet(false);
    navigateToBack();
  };
  const renderInner = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.topCardGreen}>
        <View style={styles.rightImageview}>
          <Icon />
        </View>
        <View style={styles.emailText}>
          <Text style={styles.emailTextSent}>Tenant Added</Text>
          <Text style={styles.emailTextSent}>Successfully!</Text>
        </View>

        <View style={styles.secondMainTitleView}>
          <Text style={styles.discripctionView}>Tenant {firstName}</Text>
          <Text style={styles.discripctionView}>
            was added to Unit {visitingUnitData.unit_name}
          </Text>
        </View>
        <View style={styles.ButtonViewBottomSheet}>
          <DefaultButtonPlainOutlined
            submit={closeBottomsheet}
            customStyle={{width: '78%'}}
            title="Close"
          />
        </View>
      </View>
    </View>
  );
  const TopRowContainer = () => {
    return (
      <ScreenHeader headerName="Add Tenant" navigateToBack={navigateToBack} />
    );
  };

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Add Tenant"
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
              extraScrollHeight={45}
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
                      onChangeText={text => {
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
                      onChangeText={text => {
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
                      onChangeText={text => setContactNo(text)}
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
                      onChangeText={text => {
                        setEmailAddress(text != '' ? text : '');
                      }}
                    />
                  </View>
                </ScrollView>
              </View>
            </KeyboardAwareScrollView>
            <View style={styles.buttonView}>
              <DefaultButtonPlainOutlined
                submit={() => navigation.goBack()}
                title="Cancel"
                customStyle={{width: '32.5%'}}
              />
              <DefaultButtonPlain
                disabled={!enableAddTenantButton}
                submit={saveTenantData}
                title="Add Tenant"
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
        {openBottomSheet ? (
          <Overlay
            overlayStyle={{
              backgroundColor: 'rgba(226, 226, 226, 0.8)',
              padding: 0,
              marginTop: 0,
            }}
            fullScreen={true}
            isVisible={openBottomSheet}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              }}>
              <TopRowContainer />
            </View>
            <BottomSheet
              onVisible={openBottomSheet}
              visibilityHandler={visibilityHandler}
              children={renderInner}
              height={350}
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
    fontFamily: 'Poppins-Medium',
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
  dobContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
    paddingBottom: 2,
    marginBottom: 15,
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
  dobIconContainer: {
    width: '10%',
    height: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  scroll: {
    height: '100%',
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
  secondMainTitleView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.03,
  },
  discripctionView: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnitInMain: state.apartmentState.selectedUnit,
  memberListChange: state.memberDetailsState.getTenantChangeDetails,
  selectedApartmentComplex: state.apartmentState.seleletedApatment,
});
const mapDispatchToProps = dispatch => ({
  memberStatusChange: payload => dispatch(changeTenantAction(payload)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTenant);
