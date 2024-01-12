import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import {checkUserOtpAvailabilityAction} from './actions/signUp-action';
import {connect} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {passPhoneNumber} from './SignUpMobileNew';
import {checkUserPhoneNumberAvailabilityAction} from './actions/signUp-action';
import {
  checkPasswordAvailabilityApi,
  saveUserLoginDataApi,
  getIsNewUser,
} from '../../screens/SignUp/services/signUp-service';
import {getUserApartmentsListAction} from '../Apartment/actions/apartment-action';
import apartnerLogo from '../../assets/icons/new_ui/Logo-with-Tagline-statusbar-fit.png';
import {DefaultButton} from '../../components';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const OTP_TIMEOUT_SECONDS = 60;
const statusBarHeight = StatusBar.currentHeight;

const EnterDigitCode = ({
  navigation,
  userOtpNotNotValid,
  checkOtpAvailability,
  checkUserPhoneNumberAvailability,
  phoneNumber,
  getUserApartmentsList,
  loggedInUserData,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const navigateToBack = () => {
    navigation.navigate('SignUpMobileNew');
  };

  const [displayOtpError, setDisplayOtpError] = useState(false);

  const [typingOtpNumber, setTypingOtpNumber] = useState();
  const [typedPhoneNumber, setTypedPhoneNumber] = useState();
  const [count, setCount] = useState(OTP_TIMEOUT_SECONDS);
  const [passwordExistsValue, setPasswordExists] = useState();
  const [isNewUserLogin, setIsNewUserLogin] = useState('yes');

  useEffect(() => {
    initDataInPage();
    checkPassword();
  }, [count]);

  const initDataInPage = () => {
    if (count >= 1) {
      const timer = setTimeout(() => {
        setCount(count => count - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  };

  const resendCode = async () => {
    setTypingOtpNumber('');
    setDisplayOtpError(false);
    const validate = await checkUserPhoneNumberAvailability(
      {
        phoneNumber: phoneNumber,
      },
      response => {
        if (response.userExists) {
          setCount(OTP_TIMEOUT_SECONDS);
        } else {
          // display error
          // setDisplayPhoneNumberError(true);
        }
      },
    );
  };
  const checkPassword = async () => {
    const checkPasswordExists = await checkPasswordAvailabilityApi({
      phoneNumber: phoneNumber,
    });
    const result = checkPasswordExists.data.body.passwordExists;
    setPasswordExists(result);
  };

  const initPageData = async userId => {
    try {
      const dataParam = {userId: userId};

      const response = await getIsNewUser(dataParam);
      setIsNewUserLogin(response.data[0].is_new_user);

      return response.data.length > 0 ? response.data[0].is_new_user : 'yes';
    } catch (error) {}
  };

  const navigateToSetYourPwScreen = () => {
    Keyboard.dismiss();
    checkOtpAvailability(
      {
        insertOtp: typingOtpNumber,
        phoneNumber: phoneNumber,
      },
      async response => {
        await AsyncStorage.setItem('token', `${response.token}`);
        if (response.otpMatch) {
          const checkIsNewUser = await initPageData(response.userData.user_id);
          setDisplayOtpError(false);
          if (checkIsNewUser === 'yes') {
            await getToken(response.userData.user_id);
            navigation.navigate('ConfirmPassword');
          } else {
            Keyboard.dismiss();
            getUserApartmentsList(
              {
                userId: response.userData.user_id,
              },
              async responseData => {
                await AsyncStorage.setItem(
                  'userId',
                  `${response.userData.user_id}`,
                );
                navigation.navigate('ApartmentSelection');
              },
            );
            await getToken(response.userData.user_id);
            createChannel();
            notificationListener();
          }
        } else {
          // display error
          setDisplayOtpError(true);
        }
      },
    );
  };

  // get token

  const getToken = async userId => {
    const firebaseYesy = await firebase.initializeApp({
      debug: true,
      promptOnMIssingPlayServices: true,
    });
    try {
      if (Platform.OS === 'ios') {
        await firebaseYesy.messaging().requestPermission();
      }
      const token = await firebaseYesy.messaging().getToken();

      let dataParams = {
        userToken: token,
        userId: userId,
      };
      await saveUserLoginDataApi(dataParams);
    } catch (error) {}
  };

  //create channel
  const createChannel = () => {
    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'channelName',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('Description');
    firebase.notifications().android.createChannel(channel);
  };

  //Foregorund notification
  const notificationListener = () => {
    firebase.notifications().onNotification(notification => {
      if (Platform.OS === 'android') {
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .setBadge(notification.ios.badge)
          .android.setChannelId('channelId')
          .android.setBigText(notification.data.message)
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => {
            alert(err);
          });
      }
    });
  };

  const navigateToWelcomeBack = () => {
    Keyboard.dismiss();
    navigation.navigate('WelcomeBack');
  };
  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.topCard}>
            <View style={styles.topCardMaincontainer}>
              <View style={styles.topRowContainer}>
                <TouchableOpacity
                  onPress={navigateToBack}
                  style={styles.backBtnContainer}>
                  <Icon
                    name="arrow-back"
                    // onpress={detialsHandler}
                    size={24}
                    color="#26272C"
                  />
                  <BackImage width={24} height={24} />
                </TouchableOpacity>
                <View style={styles.apartnerTextContainer}>
                  <Image style={styles.logoImg} source={apartnerLogo} />
                  {/* <Text style={styles.mainTitle}>apartner</Text> */}
                </View>
              </View>
              <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
                <View style={styles.mainContentContainer}>
                  <View style={{alignItems: 'center', marginTop: 20}}>
                    <Text style={styles.titleText}>OTP</Text>
                    <Text style={styles.titleBoldText}>Verification</Text>

                    <View style={styles.mainOtpView}>
                      <Text style={styles.mainTitle}>
                        Enter 4-digit code sent to
                      </Text>
                      <Text style={styles.mainTitleNumber}>
                        {phoneNumber ? phoneNumber.slice(0, 3) : null} *** **
                        {phoneNumber ? phoneNumber.slice(-2) : null}
                      </Text>
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
                        }}
                        autoFocusOnLoad
                        codeInputFieldStyle={styles.underlineStyleBase}
                        codeInputHighlightStyle={
                          styles.underlineStyleHighLighted
                        }
                      />
                    </View>
                    <View style={styles.resendView}>
                      <View style={styles.incorrectOtpView}>
                        {displayOtpError && (
                          <Text style={styles.errorMessage}>OTP Incorrect</Text>
                        )}
                      </View>
                      {count <= 0 ? (
                        <View style={styles.mainTimeView}>
                          <Text style={styles.didntReceiveCodeText}>
                            Didn’t receive the code?
                          </Text>
                          <TouchableOpacity onPress={() => resendCode()}>
                            <Text style={styles.resendAgain}>Resend</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.mainTimeView}>
                          <Text style={styles.resendText}>Code expires in</Text>
                          <Text style={styles.resendTime}>
                            00 : {count > 0 ? count : 0}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <KeyboardAvoidingView
              behavior="position"
              enabled={enableShift}
              keyboardVerticalOffset={Platform.select({
                ios: () => -30,
                android: () => -height * 0.5,
              })()}
              style={styles.continueBtnMain}>
              <View style={styles.continueBtnMainView}>
                <View style={styles.signinwithpwView}>
                  <Text
                    style={styles.signinwithpwText}
                    onPress={navigateToWelcomeBack}>
                    Sign in with Password
                  </Text>
                </View>
                <TouchableOpacity />
                <DefaultButton
                  submit={navigateToSetYourPwScreen}
                  title="Continue"
                  customStyle={styles.bottomBtnStyle}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  continueBtnMain: {
    alignItems: 'center',
    flex: 2,
  },
  mainContainer: {
    flex: 1,
    height: height,
    backgroundColor: '#ffffff',
  },

  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
    left: width * 0.05,
  },
  mainTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#26272C',
  },
  topCardMaincontainer: {
    flex: 6,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },
  apartnerTextContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },
  logoImg: {
    width: 67,
    height: 16,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    width: width,
  },
  apartnerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.1,
  },
  mainGrid: {
    width: '90%',
    height: height * 0.07,
  },
  mainView: {
    flexDirection: 'row',
  },
  resendText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#26272C',
  },
  didntReceiveCodeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#26272C',
  },
  resendAgain: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#087395',
    fontWeight: 'normal',
    textDecorationLine: 'underline',
  },

  errorMessage: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#F23B4E',
  },
  resendView: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  mainTitleNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#26272C',
    marginLeft: 5,
  },

  underlineStyleBase: {
    width: width * 0.17,
    height: height * 0.07,
    borderColor: '#84C7DD',
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#087395',
  },

  underlineStyleHighLighted: {
    backgroundColor: '#F5F7FD',
  },
  signinwithpwView: {
    marginBottom: height * 0.03,
    alignItems: 'center',
  },
  signinwithpwText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#087395',
    textDecorationLine: 'underline',
    opacity: 1,
  },
  topRowmainContainerd: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  resendTime: {
    color: '#087395',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginTop: 2,
  },
  mainTimeView: {
    alignItems: 'center',
  },
  mainOtpView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainContentContainer: {
    alignItems: 'center',
  },
  titleText: {fontFamily: 'Roboto-Light', fontSize: 20, color: '#26272C'},
  titleBoldText: {fontFamily: 'Roboto-Black', fontSize: 30, color: '#26272C'},
});

const mapStateToProps = state => ({
  userOtpNotNotValid: state.signUpState.userOtpNotNotValid,
  phoneNumber: state.signUpState.phoneNumber,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  checkUserPhoneNumberAvailability: (payload, callBack) =>
    dispatch(checkUserPhoneNumberAvailabilityAction(payload, callBack)),
  checkOtpAvailability: (payload, callBack) =>
    dispatch(checkUserOtpAvailabilityAction(payload, callBack)),
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnterDigitCode);
