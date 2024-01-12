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
import EditPencil from '../../assets/icons/new_ui/EditPencil.svg';
import {saveAndSendEmailOtp} from './services/myProfile-service';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import {
  getUserProfileData,
  saveUserEmail,
} from '../MyProfile/services/myProfile-service';
import {Alert} from 'react-native';
import {MainContainer} from '../../components/';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const UpdateEmail = ({
  navigation,
  apartmentFacilityDataItems,
  loggedInUserData,
  setUpdatedUserData,
  selectedApartmentData,
}) => {
  const [enableShift, setEnableShift] = useState(false);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userDataList, setUserDataList] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [oldDbEmail, setOldDbEmail] = useState('');
  const [loadingPage, setLoadingPage] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [enableTextField, setEnableTextField] = useState(true);
  const navigateToHome = () => {
    navigation.navigate('AccInfo');
  };
  const navigateToOtp = () => {
    navigation.navigate('UpdateEmailAddress');
  };

  useEffect(() => {
    initDataInPage();
  }, [loggedInUserData]);

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
        setOldDbEmail(getProfileData.data.body.dataList[0].email);
        setLoadingPage(false);
      }
    } catch (error) {
      setLoadingPage(false);
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

    if (type == 'success') {
      setTimeout(() => {
        setLoadingPage(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setLoadingPage(false);
    } else if (type == 'warning') {
      setLoadingPage(false);
    }
  };

  const emailChange = email => {
    setErrorStatus(false);
    setErrorMessage(null);
    setUserEmail(email);
  };

  const updateUserEmailData = async () => {
    try {
      displayNotification(false, '');
      setLoadingPage(true);
      const dataParams = {
        userId: loggedInUserData.user_id,
        email: userEmail.replace(/\s+/g, ''),
        userRowId: loggedInUserData.user_row_id,
      };

      const saveUpdateEmail = await saveUserEmail(dataParams);
      sendEmailOTP(userEmail);
      setUpdatedUserData(saveUpdateEmail.data.body.newUserData);
    } catch (error) {
      displayNotification('error', 'Error Occurred');
    }
  };

  const sendEmailOTP = async () => {
    let userData = {
      email: userEmail,
    };
    const sendOTPmail = await saveAndSendEmailOtp(userData);
    navigateToOtp(true);
  };
  const visiblityPassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };

  const visibilityHandler = status => {
    setErrorStatus(false);
    setErrorMessage(null);
  };

  const TopRowContainer = () => {
    return <ScreenHeader headerName="Menu" navigateToBack={navigateToBack} />;
  };

  const onEnableTextField = () => {
    setEnableTextField(!enableTextField);
  };

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Personal Information"
      subTitle="View & update personal information"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}>
      <>
        <View style={styles.tabBox}>
          <View>
            <Text style={styles.headerName}>Update your email address</Text>
            <View style={styles.inputsFlex}>
              <Input
                containerStyle={styles.mainInputContainer}
                inputContainerStyle={styles.inputContainerField}
                inputStyle={styles.inputField}
                labelStyle={styles.inputLabel}
                value={userEmail}
                placeholderTextColor={'gray'}
                onChangeText={text => emailChange(text)}
                onFocus={() => setEnableShift(false)}
                label="Email Address"
                autoCapitalize="none"
                autoComplete={false}
                disabled={enableTextField}
                renderErrorMessage={false}
              />
            </View>
            {errorMessage && (
              <Text style={styles.textTitle}>{errorMessage}</Text>
            )}
          </View>

          <View style={styles.btnSty}>
            <TouchableOpacity onPress={navigateToHome} style={styles.cancelBtn}>
              {/* <bgImage width={30} height={30} /> */}
              <Text style={styles.cancelTextBtn}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={updateUserEmailData}
              style={styles.saveBtn}>
              <Text style={styles.updateTextBtn}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      <LoadingDialogue visible={loadingPage} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  bgImage: {
    resizeMode: 'stretch',
  },

  mainContainer: {
    marginTop: StatusBar.currentHeight + height * 0.1,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  backContainer: {
    width: '11%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },

  titleRightContainer: {
    width: '89%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
    color: '#004F71',
    lineHeight: 32,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#89B2C4',
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: 'transparent',
    height: '100%',
  },

  tabBox: {
    backgroundColor: '#FFFFFFDD',
    height: Platform.OS === 'ios' ? '92%' : '86%',
    width: width * 0.9,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  headerName: {
    fontSize: 16,
    color: '#26272C',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    lineHeight: 16,
    marginBottom: height * 0.08,
    marginTop: 10,
  },
  mainInputContainer: {
    width: '90%',
    paddingHorizontal: 0,
  },
  inputContainer: {
    paddingTop: 0,
    position: 'relative',
    zIndex: 10,
  },

  inputRightContent: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  btnSty: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: width * 0.02,
    marginBottom: height * 0.03,
  },

  saveBtn: {
    width: '47%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E9CC9',
    borderColor: '#0E9CC9',
    borderWidth: 1,
    borderRadius: 25,
  },
  cancelBtn: {
    width: '35%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAEF',
    borderColor: '#0E9CC9',
    borderRadius: 25,
    borderWidth: 1,
  },
  updateTextBtn: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    alignItems: 'center',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cancelTextBtn: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    alignItems: 'center',
    color: '#0E9CC9',
    textAlign: 'center',
  },
  inputsFlex: {
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainerField: {
    width: '100%',
    height: 40,
    borderColor: '#9B9B9B',
    borderBottomWidth: 0.5,
  },

  editPencil: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  inputField: {
    flexDirection: 'row',
    fontFamily: 'Poppins-SemiBold',
    color: '#212322',
    fontSize: 16,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },
  inputLabel: {
    fontFamily: 'Roboto-Medium',
    color: '#9B9B9B',
    fontSize: 14,
    lineHeight: 18,
  },
  addressDropDown: {
    position: 'relative',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
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
  textTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: '#F23B4E',
    fontWeight: 'bold',
    marginBottom: 9,
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
)(UpdateEmail);
