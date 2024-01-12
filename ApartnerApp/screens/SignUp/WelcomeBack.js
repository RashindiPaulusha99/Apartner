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
  InputText,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import apartnerLogo from '../../assets/icons/new_ui/Logo-with-Tagline-statusbar-fit.png';
import {DefaultButton} from '../../components';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.svg';
import {color} from 'react-native-reanimated';
import IconEye from '../../assets/images/feather-eye-off.svg';
import {connect} from 'react-redux';
import {
  getUserApartmentsListAction,
  setSelectedApartmentAction,
} from '../Apartment/actions/apartment-action';
import {
  getUserPolicyAcceptedData,
  saveUserLoginDataApi,
} from './services/signUp-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {userLoginWithPasswordAction} from './actions/signUp-action';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import firebase from 'react-native-firebase';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

const WelcomeBack = ({
  navigation,
  phoneNumberFromRedux,
  userLoginWithPassword,
  getUserApartmentsList,
  loginError,
  isLoginPending,
  loggedInUserData,
}) => {
  const [userPassword, setUserPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [spinner, showSpinner] = useState(false);
  const [loginErrorLocalState, setLoginErrorLocalState] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState('no');
  const [enablerButton, setEnableButton] = useState(false);

  useEffect(() => {
    setLoginErrorLocalState(loginError);
    if (loginError) {
      showSpinner(false);
    }
  }, [loginError]);
  useEffect(() => {
    validateForm();
  }, [userPassword]);
  const visiblityPassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const navigateToBack = () => {
    navigation.navigate('EnterDigitCode');
  };
  const navigateToResetPassword = () => {
    Keyboard.dismiss();
    navigation.navigate('EnterNewPasswordToReset');
  };
  const navigateToApartmentSelection = () => {
    checkPasswordCorrect();
    Keyboard.dismiss();
  };
  const validateForm = () => {
    let validation = false;
    if (userPassword != '') {
      validation = true;
    }
    setEnableButton(validation);
  };
  const initPageData = async userId => {
    try {
      const dataParam = {userId: userId};

      const response = await getUserPolicyAcceptedData(dataParam);
      setAcceptedPolicy(response.data[0].accepted_policy);

      return response.data.length > 0 ? response.data[0].accepted_policy : 'no';
    } catch (error) {}
  };

  const checkPasswordCorrect = async () => {
    showSpinner(true);
    setLoginErrorLocalState(false);
    try {
      let dataParams = {
        password: userPassword,
        type: 'mobile',
        phoneNumber: phoneNumberFromRedux,
      };

      userLoginWithPassword(dataParams, userData => {
        getUserApartmentsList(
          {
            userId: userData.user_id,
          },
          async responseData => {
            const checkedUser = await initPageData(userData.user_id);

            showSpinner(false);
            await getToken(userData.user_id);
            createChannel();
            notificationListener();
            navigation.navigate('ApartmentSelection');
          },
        );
      });
    } catch (error) {
      showSpinner(false);
    }
  };

  // get token

  const getToken = async userId => {
    let firebaseYesy = null;
    try {
      firebaseYesy = await firebase.initializeApp({
        debug: true,
        promptOnMIssingPlayServices: true,
      });
    } catch (error) {
      console.log(error);
    }

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
                  <Icon name="arrow-back" size={24} color="#26272C" />
                  <BackImage width={24} height={24} />
                </TouchableOpacity>
                <View style={styles.apartnerTextContainer}>
                  <Image style={styles.logoImg} source={apartnerLogo} />
                </View>
              </View>
              <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
                <View style={styles.mainContainerView}>
                  <View style={styles.mainTextHeaderContainer}>
                    <View style={{alignItems: 'center', marginTop: 20}}>
                      <Text style={styles.titleText}>Welcome back</Text>
                      <Text style={styles.titleBoldText}>
                        Sign in to continue
                      </Text>
                    </View>
                  </View>

                  <View style={styles.inputAreaContainer}>
                    <Input
                      // inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      inputContainerStyle={[
                        styles.inputContainerField,
                        loginErrorLocalState
                          ? styles.inputContainerFieldError
                          : null,
                      ]}
                      value={userPassword}
                      onChangeText={text => {
                        setLoginErrorLocalState(false);
                        setUserPassword(text != '' ? text : '');
                      }}
                      secureTextEntry={secureTextEntry}
                      rightIcon={
                        secureTextEntry
                          ? {
                              type: 'font-awesome',
                              name: 'eye-slash',
                              color: '#212F3C99',
                              onPress: () => {
                                visiblityPassword();
                              },
                            }
                          : {
                              type: 'font-awesome',
                              name: 'eye',
                              color: '#212F3C99',
                              onPress: () => {
                                visiblityPassword();
                              },
                            }
                      }
                      label="Enter Password"
                      autoCapitalize="none"
                      placeholder="Enter the Password"
                    />
                  </View>
                  <View style={styles.PasswordWarning}>
                    <Text style={styles.PasswordDoesntMatchText}>
                      {loginErrorLocalState ? loginError.message : ' '}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
            <View style={styles.btnMainContainer}>
              <TouchableOpacity
                style={styles.PasswordFrogetTextView}
                onPress={navigateToResetPassword}>
                <Text style={styles.PasswordFrogetText}>
                  I forgot my Password
                </Text>
              </TouchableOpacity>

              <View style={styles.continueBtn}>
                <TouchableOpacity
                  onPress={() =>
                    enablerButton ? navigateToApartmentSelection() : ''
                  }
                  style={styles.buttonContinue}>
                  <View
                    style={
                      enablerButton
                        ? styles.btnTextContainer
                        : styles.buttonMainViewDisabled
                    }>
                    <Text style={styles.textContinue}>Continue</Text>
                    <CountinueBtn style={styles.continueArrow} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <LoadingDialogue visible={spinner} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: height,
    backgroundColor: '#ffffff',
  },

  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  topCardMaincontainer: {
    flex: 6,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },

  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    paddingHorizontal: 10,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    marginHorizontal: width * 0.05,
  },

  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
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
  mainContentContainer: {
    height: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {fontFamily: 'Roboto-Light', fontSize: 20, color: '#26272C'},
  titleBoldText: {fontFamily: 'Roboto-Black', fontSize: 30, color: '#26272C'},

  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  mainTextHeaderContainer: {
    height: '17%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputAreaContainer: {
    alignItems: 'center',
    height: height * 0.23,
    marginBottom: 5,
  },
  PasswordWarning: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },

  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: 'black',
  },
  btnMainContainer: {
    alignItems: 'center',

    flex: 2,
  },
  continueBtn: {
    flex: 1,
    alignItems: 'center',
  },

  inputContainerFieldError: {
    borderWidth: 1,
    borderColor: '#DD1C3A',
  },

  apartnerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.1,
  },

  buttonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextContainer: {
    backgroundColor: '#0E9CC9',
    borderColor: '#004F71',
    width: width * 0.85,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonMainViewDisabled: {
    backgroundColor: '#96BAC6',
    borderColor: '#004F71',
    width: width * 0.85,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueArrow: {
    marginHorizontal: 10,
    position: 'absolute',
    right: '10%',
    height: 24,
    width: 24,
  },

  mainGrid: {
    width: 55,
    height: 83,
    borderColor: '#707070',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 15,
  },

  PasswordDoesntMatchText: {
    color: '#F23B4E',
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    fontWeight: 'bold',
  },
  PasswordFrogetText: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#087395',
    textDecorationLine: 'underline',
  },
  PasswordFrogetTextView: {
    marginBottom: height * 0.02,
  },
  inputPhoneNumberIcon: {
    position: 'absolute',
    marginLeft: height * 0.33,
  },
  textInputview: {
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#182850',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  inputContainerField: {
    opacity: 1,
    borderRadius: 6,
    borderColor: '#84C7DD',
    borderStyle: 'solid',
    borderWidth: 1,
    width: width * 0.85,
    height: height * 0.07,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.5,
    backgroundColor: '#F5F7FD',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'Poppins',
    color: 'black',
    fontSize: 15,
  },
  inputLabel: {
    marginTop: height * 0.1,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4D4D4D',
    color: '#235464',
    marginBottom: height * 0.02,
  },
  topRowmainContainer: {
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  phoneNumberFromRedux: state.signUpState.phoneNumber,
  loginError: state.signInState.loginError,
  isLoginPending: state.signInState.isLoginPending,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
  userLoginWithPassword: (payload, callback) =>
    dispatch(userLoginWithPasswordAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WelcomeBack);
