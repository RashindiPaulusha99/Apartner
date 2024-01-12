import React, {useState, Component, useEffect, useRef} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Keyboard,
  Modal,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Input, Overlay} from 'react-native-elements';
import CalenderIcon from '../../assets/icons/new_ui/calendar_today_black_24dp.svg';
import Aicon from '../../assets/images/Aicon.svg';
import formDatas from 'form-data';
import {connect} from 'react-redux';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import UploadCamera from '../../assets/icons/new_ui/photo_camera_black_24dp.png';
import {saveUserAddVisitor} from './services/Member-service';
import {changeMemberAction} from './actions/apartment-action';
import {
  MainContainer,
  DefaultButtonPlain,
  DefaultButtonPlainOutlined,
  DatePickerContainer,
} from '../../components/';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import ChangeRelationshipBottomSheet from '../../components/containers/ChangeRelationshipBottomSheet';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import userMissing from '../../assets/images/person-icon.png';
import BottomSheet from '../../components/containers/bottomSheetV2';
import Icon from '../../assets/images/check_circle_green_24dp.svg';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import VectorIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-datepicker';
import SwitchToggle from 'react-native-switch-toggle';

const {width, height} = Dimensions.get('window');

const AddMember = ({
  navigation,
  unitsOfUser,
  memberStatusChange,
  memberListChange,
  selectedApartmentComplex,
}) => {
  let scrollRef = useRef();
  const [enableShift, setEnableShift] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [name, setName] = useState('');

  const [nicPassport, setNicPassport] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [imageResponse, setImageResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);
  const [enableAddMemberButton, setEnableAddMemberButton] = useState(false);
  const [relationshipData, setRelationshipData] = useState('Relative');
  const [spinner, setSpinner] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [saveResponse, setSaveResponse] = useState(null);

  const [show, setShow] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [showNotification, setShowNotification] = useState(false);
  const [relationshipMarginBottom, setRelationshipMarginBottom] = useState(0);

  const [
    visibleReleationshipBottomSheet,
    setVisibleRelationshipBottomSheet,
  ] = useState(false);

  useEffect(() => {
    if (!visibleReleationshipBottomSheet) {
      setRelationshipMarginBottom(0);
      scrollRef.current.scrollTo({y: 0, animated: true});
    }
  }, [visibleReleationshipBottomSheet]);
  const navigateToBack = () => {
    navigation.goBack();
  };

  const visibilityRelationshipHandler = status => {
    setVisibleRelationshipBottomSheet(status);
  };
  const relationshipHandler = relationship => {
    setRelationshipData(relationship);
  };
  const closeBottomsheet = () => {
    setOpenBottomSheet(false);
    navigateToBack();
  };

  useEffect(() => {
    initHandler();
  }, []);

  const initHandler = () => {};

  useEffect(() => {
    validateForm();
    if (imageResponse != null && typeof imageResponse.uri !== 'undefined') {
      setProfilePictureToDisplay(imageResponse.uri);
    }
    memberStatusChange(false);
  }, [
    imageResponse,
    memberListChange,
    name,
    dob,
    nicPassport,
    email,
    contactNo,
    selectedUnit,
  ]);

  const createAccount = async () => {
    setEnableAddMemberButton(false);
    displayNotification(false, '');
    setSpinner(true);
    try {
      let relationshipObj = {
        relationships: [
          {
            unitRowId: 1,
            unitId: 1,
            relationshipId: 2,
            createdBy: 1,
            desc: 'User Added From Mobile',
          },
        ],
      };
      const updatedData = {
        firstName: name,
        nic: nicPassport,
        contactPrimary: `+94${
          contactNo.substr(0, 1) === '0' ? contactNo.substr(1) : contactNo
        }`,

        email: email,
        dob: moment(dob).format('YYYY-MM-DD'),
        usersType: 'mobile-residents',
        unitRowId: selectedUnit.apartment_unit_row_id,
        unitId: selectedUnit.apartment_unit_id,
        userRole: 11,
        createdBy: 1,
        roleId: 1,
        userName: name,
        apartmentComplexId: selectedApartmentComplex.key,
      };
      const formData = new formDatas();
      const keys = Object.keys(updatedData);
      keys.forEach(elementName => {
        formData.append(elementName, updatedData[elementName]);
      });
      if (relationshipObj !== null) {
        formData.append(
          'userAprtmentRelationships',
          JSON.stringify(relationshipObj),
        );
      }
      if (relationshipData) {
        formData.append('relationShip', relationshipData);
      }
      if (imageResponse != null) {
        formData.append('profilePic', imageResponse);
      }
      const saveUpdateEmergencyData = await saveUserAddVisitor(formData);

      if (saveUpdateEmergencyData.data.body.userData != null) {
        let enabledUserData = {
          ...saveUpdateEmergencyData.data.body.userData,
          unitName: selectedUnit.unit_name,
        };
        await AsyncStorage.setItem(
          'userEnabledData',
          `${JSON.stringify(enabledUserData)}`,
        );
        setEnableAddMemberButton(true);
        memberStatusChange(true);
        if (saveUpdateEmergencyData.data != undefined) {
          setSaveResponse(saveUpdateEmergencyData);
        }
        setSpinner(false);
        setOpenBottomSheet(true);
        displayNotification('success', 'Member Added Successfully');
      } else if (saveUpdateEmergencyData.data.body.isEmailUnique == false) {
        setSpinner(false);
        displayNotification('error', 'Email address already in use');
      } else if (
        saveUpdateEmergencyData.data.body.isContactPrimaryUnique == false
      ) {
        setSpinner(false);
        displayNotification(
          'error',
          'You cannot add this member since he already has an Apartner account.',
        );
      } else {
        setSpinner(false);
        displayNotification('error', 'Member Add Failed');
      }
    } catch (e) {
      setSpinner(false);
      console.log(e);
      displayNotification('error', 'Error occured');
      setSpinner(false);
    }
  };

  const validateForm = () => {
    let validation = false;
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (
      name != '' &&
      dob != '' &&
      nicPassport != '' &&
      email != '' &&
      regEmail.test(email) &&
      contactNo != '' &&
      selectedUnit != null &&
      relationshipData != ''
    ) {
      validation = true;
    }
    setEnableAddMemberButton(validation);
  };

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

  const unitHandler = unit => {
    setSelectedUnit(unit);
  };

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };

  const onChange = event => {
    setDob(event);
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
      setSpinner(false);
      setVisibleBottomSheet(false);
      if (isEnabled === true) {
        navigation.navigate('CreateAccount');
        setOpenBottomSheet(false);
      }
    } else if (type == 'error') {
      setSpinner(false);
      setVisibleBottomSheet(false);
    }
  };

  const keyboardDissmissHandler = () => {
    setShow(false);
    Keyboard.dismiss();
    setModalVisible(false);
  };

  const unitViewChange = () => {
    Keyboard.dismiss();
    setVisibleBottomSheet(!visibleBottomSheet);
  };
  const onClose = () => {
    visibilityHandler(false);
    visibilityRelationshipHandler(false);
  };

  const TopRowContainer = () => {
    return (
      <ScreenHeader
        headerName="Add Member - Family"
        navigateToBack={navigateToBack}
      />
    );
  };

  const renderInner = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.topCardGreen}>
        <View style={styles.rightImageview}>
          <Icon />
        </View>
        <View style={styles.emailText}>
          <Text style={styles.emailTextSent}>Member added</Text>
          <Text style={styles.emailTextSent}>Successfully!</Text>
        </View>

        <View style={styles.secondMainTitleView}>
          <Text style={styles.discripctionView}>Member {name}</Text>
          <Text style={styles.discripctionView}>
            was added to Unit {selectedUnit.unit_name}
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
  const relationshipClickHandler = () => {
    setRelationshipMarginBottom(180);
    setTimeout(() => {
      scrollRef.current.scrollToEnd({
        animated: true,
      });
    }, 300);

    Keyboard.dismiss();

    setVisibleRelationshipBottomSheet(!visibleReleationshipBottomSheet);
  };

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Add Member - Family"
      subTitle=" Create Family Member Profile"
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
              extraHeight={140}
              extraScrollHeight={43}
              keyboardOpeningTime={0}>
              <View
                style={styles.scroll}
                onStartShouldSetResponder={() => true}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  ref={scrollRef}
                  snapToEn={false}
                  style={{
                    flex: 1,
                    height:
                      Platform.OS === 'ios' ? height * 0.7 : height * 0.64,
                  }}>
                  <View>
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
                        onPress={unitViewChange}>
                        <Text style={styles.residentUnitText}>
                          {selectedUnit && selectedUnit.unit_name !== null
                            ? selectedUnit.unit_name
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
                      value={name}
                      onChangeText={text => {
                        setName(text !== '' ? text : '');
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
                      value={nicPassport}
                      onChangeText={text => {
                        setNicPassport(text !== '' ? text : '');
                      }}
                    />
                    <DatePickerContainer
                      dateValue={dob}
                      label="Date of Birth *"
                      onChangeDate={onChange}
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
                      value={email}
                      onChangeText={text => {
                        setEmail(text !== '' ? text : '');
                      }}
                    />
                  </View>

                  <View
                    style={[
                      styles.relationshipViewContainer,
                      {marginBottom: relationshipMarginBottom},
                    ]}>
                    <Text style={styles.textFieldName}>Relationship *</Text>
                    <TouchableOpacity
                      onPress={relationshipClickHandler}
                      style={styles.bottomSheetRelationshipBtn}>
                      <Text style={styles.residentUnitText}>
                        {relationshipData}
                      </Text>
                      {visibleReleationshipBottomSheet ? (
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
                disabled={!enableAddMemberButton}
                submit={createAccount}
                title="Add Member"
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
            unitList={unitsOfUser}
            bottomSheetHeight={[250, 300, 0]}
          />
        ) : null}
        {visibleReleationshipBottomSheet ? (
          <ChangeRelationshipBottomSheet
            onVisible={visibleReleationshipBottomSheet}
            visibilityHandler={visibilityRelationshipHandler}
            relationshipHandler={relationshipHandler}
          />
        ) : null}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    height: 30,
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

  textFieldName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#9B9B9B',
    lineHeight: 18,
    marginBottom: 8,
  },
  bottomSheetRelationshipBtn: {
    height: 30,
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#F5F7FD',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#84C7DD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relationshipViewContainer: {
    paddingLeft: Platform.OS === 'ios' ? 0 : 2,
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
    marginBottom: height * 0.02,
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
  inputRightContentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
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
  checkTextview: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  checkTextYour: {
    fontFamily: 'Poppins',
    fontSize: 26,
    alignItems: 'center',
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  okBotton: {
    width: 264,
    height: 52,
    backgroundColor: '#C8C8C8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okBottonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#4D4D4D',
    fontWeight: 'bold',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginVertical: 20,
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
  ButtonViewBottomSheet: {
    flexDirection: 'row',
    marginTop: height * 0.03,
    justifyContent: 'center',
  },
  inputDateContainerField: {
    width: width * 0.78,
  },
});

const mapStateToProps = state => ({
  unitsOfUser: state.apartmentState.apartmentUnits,
  memberListChange: state.memberDetailsState.getMemberDetailsChange,
  selectedApartmentComplex: state.apartmentState.seleletedApatment,
});

const mapDispatchToProps = dispatch => ({
  memberStatusChange: payload => dispatch(changeMemberAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMember);
