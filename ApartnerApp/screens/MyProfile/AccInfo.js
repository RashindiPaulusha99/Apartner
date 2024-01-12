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
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {} from 'react-native-elements';
import {connect} from 'react-redux';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import userMissing from '../../assets/images/person-icon.png';
import arrowRightPng from '../../assets/icons/new_ui/arrow-ios-back-fill2x.png';
import UploadCamera from '../../assets/icons/upload-feather-camera.svg';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {
  getUserProfileData,
  updateUserProfileData,
} from '../MyProfile/services/myProfile-service';
import RNFormData from 'form-data';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {
  MainContainer,
  DefaultButtonPlain,
  DefaultButtonPlainOutlined,
} from '../../components/';
import {Touchable} from 'react-native';
const {width, height} = Dimensions.get('window');
const MyProfile = ({
  navigation,
  apartmentFacilityDataItems,
  loggedInUserData,
  setUpdatedUserData,
  selectedApartmentData,
}) => {
  const inputFNameRef = useRef(null);
  const inputLNameRef = useRef(null);

  const [enableShift, setEnableShift] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [imageResponse, setImageResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);

  const navigateToHome = () => {
    navigation.navigate('MyProfile');
  };
  const navigateToChangePassword = () => {
    navigation.navigate('ProfileChangePassword');
  };
  const navigateToupdateEmail = () => {
    navigation.navigate('UpdateEmail');
  };

  const [userDataList, setUserDataList] = useState({});
  const [firstNameEditable, setFirstNameEditable] = useState(false);
  const [lastNameEditable, setLastNameEditable] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [userContactNumber, setUserContactNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userEmailVerified, setUserEmailVerified] = useState('no');
  const [updatingUserData, setUpdatingUserData] = useState(false);
  const [isPressed, setIsPressed] = useState(true);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );

  const [isDataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (firstNameEditable) {
      inputFNameRef.current.focus();
    }
  }, [firstNameEditable]);

  useEffect(() => {
    if (lastNameEditable) {
      inputLNameRef.current.focus();
    }
  }, [lastNameEditable]);

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
        setDataLoading(false);
        navigation.navigate('MyProfile');
      }, 2000);
    } else if (type == 'error') {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    initDataInPage();
  }, [loggedInUserData]);

  useEffect(() => {
    if (imageResponse != null && typeof imageResponse.uri !== 'undefined') {
      setProfilePictureToDisplay(imageResponse.uri);
    }
  }, [imageResponse]);

  const initDataInPage = async () => {
    setDataLoading(true);
    const dataParam = {
      userId: loggedInUserData.user_id,
      complexId: selectedApartmentData.key,
    };
    const getProfileData = await getUserProfileData(dataParam);
    if (
      getProfileData.data.body.statusCode != undefined &&
      getProfileData.data.body.statusCode === 401
    ) {
      setDataLoading(false);
      AsyncStorage.clear();
      navigation.navigate('SpalshScreen');
    } else {
      setUserDataList(getProfileData.data.body.dataList[0]);
      setUserFirstName(getProfileData.data.body.dataList[0].first_name);
      setUserLastName(getProfileData.data.body.dataList[0].last_name);
      setUserContactNumber(
        getProfileData.data.body.dataList[0].contact_primary,
      );
      setUserEmail(getProfileData.data.body.dataList[0].email);
      setUserEmailVerified(
        getProfileData.data.body.dataList[0].is_email_verified,
      );
      if (getProfileData.data.body.dataList[0].profile_pic) {
        setProfilePictureToDisplay(
          getProfileData.data.body.dataList[0].imageUrl,
        );
      }
      setDataLoading(false);
    }
  };

  const navigateToMyProfile = () => {
    Keyboard.dismiss();
    navigation.navigate('MyProfile');
  };

  const updateUserProfileDetails = async () => {
    displayNotification(false, '');
    setIsPressed(true);
    setDataLoading(true);
    try {
      let formData = new RNFormData();
      formData.append('firstName', userFirstName);
      formData.append('lastName', userLastName);
      formData.append('contactPrimary', userContactNumber);
      formData.append('userId', loggedInUserData.user_id);
      formData.append('userRowId', loggedInUserData.user_row_id);
      if (imageResponse != null) {
        formData.append('profile_picture', imageResponse);
      }
      setUpdatingUserData(true);
      const saveUpdateProfileData = await updateUserProfileData(formData);
      setIsPressed(false);
      if (saveUpdateProfileData.data.body.user != null) {
        displayNotification('success', 'Information Saved Successfully');
        setIsPressed(false);
        setUpdatedUserData(saveUpdateProfileData.data.body.newUserData);
      } else {
        displayNotification('error', 'Information Saving Failed');
      }
      setUpdatingUserData(false);
    } catch (error) {
      displayNotification('error', 'Error Occurred');
      setIsPressed(false);
    }
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
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Account Information"
      subTitle="View & update helper details"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}>
      <>
        <View style={styles.bottomTabContainer}>
          <View style={styles.scroll} onStartShouldSetResponder={() => true}>
            <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
              <KeyboardAvoidingView
                behavior="position"
                enabled={enableShift}
                keyboardVerticalOffset={Platform.select({
                  ios: () => height * 0.2,
                  android: () => height * 0.2,
                })()}
                style={styles.formContainer}>
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
                      <UploadCamera />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputNameContainer}>
                  <Input
                    containerStyle={styles.inputContainerMainStyle}
                    inputContainerStyle={styles.inputContainerField}
                    inputStyle={styles.inputField}
                    value={userFirstName}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      setIsPressed(false);
                      setUserFirstName(text);
                    }}
                    label="First Name *"
                    autoCapitalize="none"
                    autoComplete={false}
                    renderErrorMessage={false}
                    ref={inputFNameRef}
                  />
                </View>
                <View style={styles.inputNameContainer}>
                  <Input
                    containerStyle={styles.inputContainerMainStyle}
                    inputContainerStyle={styles.inputContainerField}
                    value={userLastName}
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor={'gray'}
                    ref={inputLNameRef}
                    onChangeText={text => {
                      setIsPressed(false);
                      setUserLastName(text);
                    }}
                    label="Last Name *"
                    autoCapitalize="none"
                    renderErrorMessage={false}
                    autoComplete={false}
                  />
                </View>
                <View style={styles.inputNameContainer}>
                  <Input
                    containerStyle={styles.inputContainerMainStyle}
                    inputContainerStyle={styles.inputContainerField}
                    value={userContactNumber}
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      setIsPressed(false);
                      setUserContactNumber(text);
                    }}
                    onFocus={() => setEnableShift(true)}
                    label="Contact Number"
                    keyboardType="numeric"
                    maxLength={14}
                    autoCapitalize="none"
                    renderErrorMessage={false}
                  />
                </View>
                <View style={styles.inputNameContainer}>
                  <Input
                    containerStyle={styles.inputContainerMainStyle}
                    inputContainerStyle={styles.inputContainerField}
                    value={userEmail}
                    editable={false}
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    placeholderTextColor={'gray'}
                    onChangeText={text => {
                      setIsPressed(false);
                      setUserEmail(text);
                    }}
                    onFocus={() => setEnableShift(false)}
                    label="Email Address"
                    autoCapitalize="none"
                    autoComplete={false}
                    renderErrorMessage={false}
                  />
                  <View style={styles.inputRightContent}>
                    <View
                      style={[
                        styles.inputRightContentContainer,
                        {paddingRight: 21},
                      ]}>
                      <Text style={styles.verfied}>
                        {userEmailVerified === 'no'
                          ? 'Not Verified'
                          : 'Verified'}
                      </Text>
                    </View>
                    {userEmailVerified === 'no' ? (
                      <TouchableOpacity
                        style={{width: '100%', alignItems: 'flex-end'}}
                        onPress={navigateToupdateEmail}>
                        <Image
                          source={arrowRightPng}
                          style={{width: 10.5, height: 21}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text />
                    )}
                  </View>
                </View>
                <View style={styles.inputNameContainer}>
                  <Input
                    containerStyle={styles.inputContainerMainStyle}
                    inputContainerStyle={styles.inputContainerField}
                    inputStyle={styles.inputField}
                    editable={false}
                    labelStyle={styles.inputLabel}
                    value={'************'}
                    placeholderTextColor={'gray'}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setEnableShift(true)}
                    label="Password"
                    autoCapitalize="none"
                    renderErrorMessage={false}
                  />
                  <View style={[styles.inputRightContent, {top: 13}]}>
                    <View style={styles.inputRightContentContainer}>
                      <TouchableOpacity
                        style={{width: '100%', alignItems: 'flex-end'}}
                        onPress={navigateToChangePassword}>
                        <Image
                          source={arrowRightPng}
                          style={{width: 10.5, height: 21}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
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
              submit={updateUserProfileDetails}
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please Select an Option</Text>
              <TouchableOpacity
                style={styles.bottonCardBottom}
                onPress={() => {
                  setIsPressed(false);
                  cameraPicChange();
                }}>
                <View style={styles.bottonCardContainer}>
                  <Text style={styles.bottonCardContainerText}>Camera</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottonCardBottom}
                onPress={() => {
                  setIsPressed(false);
                  galleryPicChange();
                }}>
                <View style={styles.bottonCardContainer}>
                  <Text style={styles.bottonCardContainerText}>Gallery</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <LoadingDialogue visible={isDataLoading} />
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  bgImage: {
    resizeMode: 'stretch',
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    paddingBottom: 20,
    width: '100%',
    height: '10%',
  },

  BackContainer: {
    width: '11%',
  },

  titleRightContainer: {
    width: '89%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePictureEmpty: {
    width: 100,
    height: 100,
  },

  bottomTabContainer: {
    backgroundColor: '#FFFFFFDD',
    height: Platform.OS === 'ios' ? '93%' : '90%',
    width: '95%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  imageUploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginBottom: 30,
  },
  uploadCorner: {
    alignItems: 'center',
    justifyContent: 'center',
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
  scroll: {
    height: height * 0.66,
  },
  inputRightContent: {
    position: 'absolute',
    right: 16,
    width: '22%',
    top: 5,
  },
  inputRightContentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  verfied: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    lineHeight: 13,
    color: '#F68D2E',
  },
  saveBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#197B9A',
    borderRadius: 16,
    marginHorizontal: width * 0.02,
  },
  inputContainerMainStyle: {
    height: 70,
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
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    lineHeight: 18,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    lineHeight: 18,
    color: '#9B9B9B',
    fontSize: 14,
    fontWeight: '500',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
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
  },
  bottonCardContainerText: {
    textAlign: 'center',
    color: '#0E9CC9',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  rejectPopop: {
    backgroundColor: '#239D06',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
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
)(MyProfile);
