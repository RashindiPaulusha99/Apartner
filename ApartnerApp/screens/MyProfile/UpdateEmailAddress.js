import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {} from 'react-native-elements';
import {connect} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {getUserProfileData} from '../MyProfile/services/myProfile-service';
import {checkEmailOtpAvailabilityApi} from '../MyProfile/services/myProfile-service';
import {saveAndSendEmailOtp} from './services/myProfile-service';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {MainContainer} from '../../components/';
import DefaultButtonPlain from '../../components/buttons/defaultButtonPlain';
import DefaultButtonPlainOutlined from '../../components/buttons/defaultButtonPlainOutlined';
import BackgroundImage from '../../assets/images/my-profile-background.png';
import BottomSheet from '../../components/containers/bottomSheetV2';
import {Overlay} from 'react-native-elements';
import PopupContainer from '../../components/containers/popupContainer';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const UpdateEmailAddress = ({
  navigation,
  apartmentFacilityDataItems,
  loggedInUserData,
  setUpdatedUserData,
  selectedApartmentData,
}) => {
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userDataList, setUserDataList] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [typingOtpNumber, setTypingOtpNumber] = useState();
  const [displayOtpError, setDisplayOtpError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [loadingPage, setLoadingPage] = useState(false);
  const navigateToHome = () => {
    navigation.navigate('UpdateEmail');
  };

  const navigateToAccInfo = () => {
    Keyboard.dismiss();
    navigation.navigate('AccInfo');
    setOpenBottomSheet(false);
  };

  useEffect(() => {
    initDataInPage();
  }, []);

  const initDataInPage = async () => {
    try {
      setLoadingPage(true);

      const dataParam = {
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
      };
      const getProfileData = await getUserProfileData(dataParam);
      if (
        getProfileData.data.body.statusCode != undefined &&
        getProfileData.data.body.statusCode === 401
      ) {
        setLoadingPage(false);
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        setUserDataList(getProfileData.data.body.dataList[0]);
        setUserEmail(getProfileData.data.body.dataList[0].email);
        setLoadingPage(false);
      }
    } catch (error) {
      setLoadingPage(false);
    }
  };

  const visibilityHandler = status => {
    setErrorStatus(false);
    setErrorMessage(null);
  };

  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);
  };

  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };

  const navigateToSetYourPwScreen = async () => {
    displayNotification(false, '');
    setLoadingPage(true);
    Keyboard.dismiss();
    if (typingOtpNumber == null || typingOtpNumber == 'undefined ') {
      displayNotification('error', 'Incorrect OTP');
      setDisplayOtpError(true);
      setLoadingPage(false);
    }
    try {
      const dataParams = await checkEmailOtpAvailabilityApi({
        insertOtp: typingOtpNumber,
        email: userEmail,
      });
      if (dataParams.data.body.otpMatch) {
        setUpdatedUserData(dataParams.data.body.userData);
        setDisplayOtpError(false);
        setOpenBottomSheet(true);
        setTimeout(() => {
          setLoadingPage(false);
        }, 3000);
      } else {
        displayNotification('error', 'Incorrect OTP');
        setDisplayOtpError(true);
        setLoadingPage(false);
      }
    } catch (error) {
      setLoadingPage(false);
    }
  };

  const sendOTPEmail = async () => {
    displayNotification(false, '');
    setLoadingPage(true);
    try {
      let userData = {
        email: userEmail,
      };
      const sendOTPmail = await saveAndSendEmailOtp(userData);
      displayNotification('success', 'OTP Resent Successfully');
    } catch (error) {
      displayNotification('error', 'Error Occurred');
    } finally {
      setLoadingPage(false);
    }
  };
  const visibilityHandlerSelectApartment = status => {
    setOpenBottomSheet(status);
  };
  const TopRowContainer = () => {
    return (
      <ScreenHeader
        headerName="Email Address"
        navigateToBack={navigateToAccInfo}
      />
    );
  };
  const renderInner = () => (
    <PopupContainer
      maintitle="Success!"
      subtitle="Email address was verified successfully."
      navigateToClose={navigateToAccInfo}
    />
  );
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Email Address"
      subTitle=""
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}
      newHeader={true}
      backgroundImage={BackgroundImage}>
      <>
        <View style={styles.tabBox}>
          <View style={styles.mainContentContainer}>
            <View
              style={{
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={styles.mainOtpView}>
                <Text style={styles.mainTitle}>
                  Enter the 4-digit code sent to
                </Text>
                <Text style={styles.mainTitleNumber}>{userEmail}</Text>
              </View>
            </View>
            <View style={styles.topRowmainContainerd}>
              <View style={styles.mainView}>
                <OTPInputView
                  code={typingOtpNumber}
                  style={styles.mainGrid}
                  pinCount={4}
                  onCodeChanged={code => {
                    setTypingOtpNumber(code);
                    setDisplayOtpError(false);
                  }}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                />
              </View>
              <View style={styles.resendView}>
                <View style={styles.incorrectOtpView}>
                  {displayOtpError && (
                    <Text style={styles.errorMessage}>OTP Incorrect</Text>
                  )}
                </View>
              </View>
              <View style={styles.mainTimeView}>
                <TouchableOpacity onPress={() => sendOTPEmail()}>
                  <Text style={styles.resendAgain}>Resend Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.BottonView}>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
              }}>
              <DefaultButtonPlainOutlined
                submit={navigateToHome}
                title="Cancel"
              />
            </View>
            <View
              style={{
                flex: 2,
                alignItems: 'center',
              }}>
              <DefaultButtonPlain
                submit={navigateToSetYourPwScreen}
                title="Continue"
              />
            </View>
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
        <LoadingDialogue visible={loadingPage} />
      </>
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
  mainContainer: {
    marginTop: StatusBar.currentHeight + height * 0.02,
    alignItems: 'center',
    flex: 1,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: width * 0.9,
  },

  title: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  mainGrid: {
    width: width * 0.7,
    height: 90,
  },
  underlineStyleBase: {
    width: width * 0.17,
    height: height * 0.07,
    borderColor: '#84C7DD',
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#212322',
  },
  underlineStyleHighLighted: {
    backgroundColor: '#F5F7FD',
  },

  BottonView: {
    flexDirection: 'row',
    marginTop: height * 0.035,
    alignContent: 'center',
    justifyContent: 'center',
  },
  resendView: {
    flexDirection: 'row',
    marginTop: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorMessage: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#F23B4E',
  },
  tabBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: Platform.OS === 'ios' ? '92%' : '89%',
    width: width * 0.97,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  mainOtpView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#26272C',
  },
  mainTitleNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#26272C',
    marginLeft: 5,
  },
  topRowmainContainerd: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  mainView: {
    flexDirection: 'row',
  },
  mainGrid: {
    width: '90%',
    height: height * 0.07,
  },
  mainTimeView: {
    alignItems: 'center',
    marginTop: '30%',
  },
  resendAgain: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#087395',
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },
  mainContentContainer: {
    alignItems: 'center',
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
)(UpdateEmailAddress);
