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
import RightImage from '../../assets/images/feather-check-circle.svg';
import {
  saveUserPassword,
  getUserProfileData,
} from './services/myProfile-service';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import VisibleEye from '../../assets/icons/new_ui/visibility_black_24dp.svg';
import CloseEye from '../../assets/icons/new_ui/visibility_off_black_24dp.svg';
import {
  MainContainer,
  DefaultButtonPlain,
  DefaultButtonPlainOutlined,
} from '../../components/';
import BottomSheet from '../../components/containers/bottomSheetV2';
import {Overlay} from 'react-native-elements';
import PopupContainer from '../../components/containers/popupContainer';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const ProfileChangePassword = ({
  navigation,
  apartmentFacilityDataItems,
  loggedInUserData,
  setUpdatedUserData,
  selectedApartmentData,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [userPassword, setUserPassword] = useState(null);
  const [confirmPassword, setUserConfirmPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [secureCurrentTextEntry, setSecureCurrentTextEntry] = useState(true);
  const [secureNewTextEntry, setSecureNewTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [userDataList, setUserDataList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );

  useEffect(() => {
    userDataList;
    initDataInPage();
  }, []);

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
        setIsLoading(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setIsLoading(false);
    }
  };

  const initDataInPage = async () => {
    setIsLoading(true);

    const dataParam = {
      userId: loggedInUserData.user_id,
      complexId: selectedApartmentData.key,
    };
    const getProfileData = await getUserProfileData(dataParam);
    if (
      getProfileData.data.body.statusCode != undefined &&
      getProfileData.data.body.statusCode === 401
    ) {
      setIsLoading(false);
      AsyncStorage.clear();
      navigation.navigate('SpalshScreen');
    } else {
      setUserDataList(getProfileData.data.body.dataList[0]);
      setIsLoading(false);
    }
  };
  const navigateToHome = () => {
    navigation.navigate('AccInfo');
  };

  const changePassword = async () => {
    displayNotification(false, '');
    try {
      Keyboard.dismiss();
      setErrorStatus(false);
      if (!userPassword || !confirmPassword || !currentPassword) {
        setErrorStatus(true);
        setErrorMessage('Fill all the fields');
      } else {
        if (userPassword === confirmPassword) {
          if (userPassword.length < 12) {
            setErrorStatus(true);
            setErrorMessage(
              'The password has to be at least 12 characters long.',
            );
          } else {
            setIsLoading(true);
            const data = {
              userPassword: userPassword,
            };
            let dataParams = {
              userId: loggedInUserData.user_id,
              newPassword: confirmPassword,
              userRowId: loggedInUserData.user_row_id,
              currentUserPassword: currentPassword,
            };
            const SaveUserPassword = await saveUserPassword(dataParams);

            if (SaveUserPassword.data.body.isSamePassword == true) {
              displayNotification('error', 'Password Change Failed');
              setErrorStatus(true);
              setErrorMessage('Current password is equal to new password');
            } else if (
              SaveUserPassword.data.body.isSameCurrentPassword == false
            ) {
              displayNotification('error', 'Password Change Failed');
              setErrorStatus(true);
              setErrorMessage(
                'The current password you have entered is incorrect ',
              );
            } else if (SaveUserPassword.data.body.UserData != null) {
              setUpdatedUserData(SaveUserPassword.data.body.newUserData);
              setOpenBottomSheet(true);
            } else {
              displayNotification('error', 'Password Change Failed');
            }
            Keyboard.dismiss();
          }
        } else {
          setErrorStatus(true);
          setErrorMessage(
            'You must enter the same password twice in order to confirm it.',
          );
        }
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
    }
  };
  const navigateToAccInfo = () => {
    Keyboard.dismiss();
    navigation.navigate('AccInfo');
    setOpenBottomSheet(false);
  };
  const TopRowContainer = () => {
    return (
      <ScreenHeader
        headerName="Change Password"
        navigateToBack={navigateToAccInfo}
      />
    );
  };
  const visibilityHandlerSelectApartment = status => {
    setOpenBottomSheet(status);
  };
  const visiblityPassword = () => {};

  const renderInner = () => (
    <PopupContainer
      maintitle="Success!"
      subtitle="Password was changed successfully."
      navigateToClose={navigateToAccInfo}
    />
  );
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Change Password"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}>
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View style={styles.bottomTabContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.subTitleContentText}>
                Update your password
              </Text>

              <Input
                containerStyle={styles.inputContainerMainStyle}
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                placeholderTextColor={'gray'}
                secureTextEntry={secureCurrentTextEntry}
                onFocus={() => setEnableShift(true)}
                onChangeText={text => {
                  setErrorStatus(false);
                  setErrorMessage(null);
                  setCurrentPassword(text);
                }}
                label="Current Password"
                renderErrorMessage={false}
                autoCapitalize="none"
                rightIcon={
                  secureCurrentTextEntry ? (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={() =>
                        setSecureCurrentTextEntry(!secureCurrentTextEntry)
                      }>
                      <VisibleEye />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={() =>
                        setSecureCurrentTextEntry(!secureCurrentTextEntry)
                      }>
                      <CloseEye />
                    </TouchableOpacity>
                  )
                }
              />

              <Input
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                secureTextEntry={secureNewTextEntry}
                onChangeText={text => {
                  setErrorStatus(false);
                  setErrorMessage(null);
                  setUserPassword(text);
                }}
                renderErrorMessage={false}
                rightIcon={
                  secureNewTextEntry ? (
                    <TouchableOpacity
                      style={{height: '100%', zIndex: 10}}
                      onPress={() =>
                        setSecureNewTextEntry(!secureNewTextEntry)
                      }>
                      <VisibleEye />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={() =>
                        setSecureNewTextEntry(!secureNewTextEntry)
                      }>
                      <CloseEye />
                    </TouchableOpacity>
                  )
                }
                label="New Password"
                autoCapitalize="none"
              />
              <Input
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                secureTextEntry={secureConfirmTextEntry}
                onChangeText={text => {
                  setErrorStatus(false);
                  setErrorMessage(null);
                  setUserConfirmPassword(text);
                }}
                rightIcon={
                  secureConfirmTextEntry ? (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={() =>
                        setSecureConfirmTextEntry(!secureConfirmTextEntry)
                      }>
                      <VisibleEye />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={() =>
                        setSecureConfirmTextEntry(!secureConfirmTextEntry)
                      }>
                      <CloseEye />
                    </TouchableOpacity>
                  )
                }
                label="Confirm Password"
                autoCapitalize="none"
                renderErrorMessage={false}
              />

              {errorMessage && (
                <Text style={styles.textTitle}>{errorMessage}</Text>
              )}
            </View>

            <View style={styles.buttonView}>
              <DefaultButtonPlainOutlined
                submit={() => {
                  navigation.goBack();
                }}
                title="Cancel"
                customStyle={{width: '32.5%'}}
              />
              <DefaultButtonPlain
                submit={changePassword}
                title="Save Changes"
                customStyle={{width: '62.5%'}}
              />
            </View>
          </View>

          <LoadingDialogue visible={isLoading} />
          {showNotification && (
            <PopupTopNotification
              visible={showNotification}
              message={notificationDisplayMessage}
              navigation={navigation}
              type={showNotification}
            />
          )}
        </KeyboardAvoidingView>
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
              visibilityHandler={visibilityHandlerSelectApartment}
              children={renderInner}
              height={273}
            />
          </Overlay>
        ) : null}
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  subTitleContentText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    color: '#26272C',
    marginTop: 10,
    marginBottom: 30,
  },
  bottomTabContainer: {
    backgroundColor: '#FFFFFFDD',
    height: Platform.OS === 'ios' ? '98%' : '98%',
    width: '95%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  inputContainerMainStyle: {
    height: 70,
    zIndex: 0,
    // width: '100%',
    // paddingHorizontal: 0,
  },
  inputContainer: {
    paddingTop: 0,
    position: 'relative',
    zIndex: 10,
  },

  inputNameContainer: {
    alignItems: 'center',
  },

  inputContainerField: {
    width: '100%',
    height: 21,
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,

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
    paddingTop: 15,
    fontFamily: 'Roboto-Medium',
    lineHeight: 18,
    color: '#9B9B9B',
    fontSize: 14,
  },

  rejectPopop: {
    backgroundColor: '#239D06',
    height: 287,
    marginTop: height * 0.12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  rightImageview: {
    alignItems: 'center',
    marginTop: height * 0.04,
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
  bottonView: {
    flexDirection: 'row',
    marginTop: height * 0.035,
    justifyContent: 'center',
  },
  textTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#F23B4E',
    fontWeight: 'bold',
    marginBottom: 9,
    left: width * 0.03,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
)(ProfileChangePassword);
