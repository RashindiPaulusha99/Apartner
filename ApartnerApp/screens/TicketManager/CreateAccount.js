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
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Overlay, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {updateMemberDataApi} from './services/Member-service';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {MainContainer} from '../../components/';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import BottomSheet from '../../components/containers/bottomSheetV2';
import {DefaultButtonPlain, DefaultButtonPlainOutlined} from '../../components';
import ErrorIcon from '../../assets/icons/error_black.svg';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
const {width, height} = Dimensions.get('window');
const CreateAccount = ({navigation, setSelectedUnit, apartmentUnitsList}) => {
  const {goBack} = navigation;
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [enabledUserData, setEnabledUserData] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [units, setUnits] = useState([]);
  const [contactNo, setContactNo] = useState('');
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const navigateToHome = () => {
    navigation.goBack();
  };
  useEffect(() => {
    initDataInPage();
  }, []);

  const initDataInPage = async () => {
    const userEnabledData = await AsyncStorage.getItem('userEnabledData');
    setEnabledUserData(JSON.parse(userEnabledData));
    setContactNo(enabledUserData.contact_primary);
  };
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const closeBottomsheet = () => {
    setOpenBottomSheet(false);
  };
  const continueButton = () => {
    setVisibleBottomSheet(false);
    setOpenBottomSheet(true);
  };

  const continueEnableUser = async () => {
    setVisibleBottomSheet(false);
    displayNotification(false, '');
    setLoadingPage(true);
    try {
      let udpatedData = {
        userId: enabledUserData.user_id,
        userRowId: enabledUserData.user_row_id,
        phoneNumber: contactNo,
      };

      const saveUpdateEmergencyData = await updateMemberDataApi(udpatedData);
      if (saveUpdateEmergencyData.data.body.updateUserData != null) {
        displayNotification('success', 'User Data Updated');
        setTimeout(() => {
          setLoadingPage(false);
          navigation.navigate('MemberManager');
        }, 2000);
      } 
      else if (saveUpdateEmergencyData.data.body.isPrimaryPhoneNumberUnique == false) {
        displayNotification('error', 'Already has a user for this phone number');
      }
      else {
        displayNotification('error', 'User Data Update Failed');
        setLoadingPage(false);
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
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
  };

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
    setErrorStatus(false);
    setErrorMessage(null);
  };
  const visibilityHandlerLinkMobile = status => {
    setOpenBottomSheet(status);
    setErrorStatus(false);
    setErrorMessage(null);
  };
  const visiblityPassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const unitHandler = unit => {
    setSelectedUnit(unit);
  };

  const initializePage = async () => {
    setUnits(apartmentUnitsList);
  };
  useEffect(() => {
    initializePage();
  }, []);

  const TopRowContainer = () => {
    return (
      <ScreenHeader
        headerName="Create Account"
        navigateToBack={navigateToHome}
      />
    );
  };
  const renderInner = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.topCardGreen}>
        <View style={styles.errorIconImageView}>
          <ErrorIcon />
        </View>
        <View style={styles.linkMobileTextView}>
          <Text style={styles.linkMobileText}>Link Mobile Number</Text>
        </View>

        <View style={styles.secondMainTitleView}>
          <Text style={styles.discripctionView}>
            This Contact No. has already
          </Text>
          <Text style={styles.discripctionView}>
            Been linked to another account.
          </Text>
          <Text style={styles.discripctionView}>
            Do you wish to link this account to
          </Text>
          <Text style={styles.discripctionView}>this unit ?</Text>
        </View>
        <View style={styles.ButtonView}>
          <DefaultButtonPlainOutlined
            submit={closeBottomsheet}
            customStyle={{width: '28%'}}
            title="Cancel"
          />
          <DefaultButtonPlain
            submit={continueEnableUser}
            customStyle={{width: '32%'}}
            title="Continue"
          />
        </View>
      </View>
    </View>
  );

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Create Account - Resident"
      changeUnitState={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.maincontainer}>
            <View style={styles.formContainer}>
              <View style={styles.textTopContainer}>
              A new user account will be created linked to the following {enabledUserData != undefined
               ? enabledUserData.email
               : ''}
              </View>
              <View style={styles.mainViewContainer}>
                <View style={styles.nameTextView}>
                  <Text style={styles.nameText}>Resident Unit *</Text>
                </View>
                <TouchableOpacity
                  style={styles.gateUpdateXBDropDown}
                  disabled={true}
                  >
                  <Text style={styles.textInputUnit}>
                    {enabledUserData !== undefined
                      ? enabledUserData.unitName
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Input
                  keyboardType="numeric"
                  label="Contact No. *"
                  containerStyle={styles.inputContainerMainStyle}
                  inputContainerStyle={styles.inputContainerField}
                  inputStyle={styles.inputField}
                  labelStyle={styles.inputLabel}
                  onChangeText={text => setContactNo(text)}>
                  {enabledUserData != undefined
                    ? enabledUserData.contact_primary
                    : ''}
                </Input>
              </View>
            </View>
            <View style={styles.bottomContainerMainView}>
              <View style={styles.bottomContainerView}>
                <Text style={styles.bottomTextContainer}>
                  Do you wish to Continue?
                </Text>
              </View>
              <View style={styles.btnStyle}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => goBack()}>
                  <Text style={styles.cancelTextBtn}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => continueEnableUser()}
                  style={styles.continueBtn}>
                  <Text style={styles.continueTextBtn}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
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
          <LoadingDialogue visible={loadingPage} />
          <BottomSheet
            onVisible={openBottomSheet}
            visibilityHandler={visibilityHandlerLinkMobile}
            children={renderInner}
            height={330}
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

  gateUpdateXBDropDown: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
    marginTop: height * 0.02,
  },
  maincontainer: {
    justifyContent: 'space-between',
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.045,
    width: '95%',
    backgroundColor: 'rgba(255,255,255, 0.8)',
    height: Platform.OS === 'ios' ? '95%' : '95%',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: height * 0.045,
  },
  discripctionText: {
    fontSize: 16,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
  },
  bottomTextContainer: {
    fontSize: 14,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
  },
  mainViewContainer: {
    marginTop: height * 0.04,
  },
  textTopContainer: {
    marginHorizontal: width * 0.02,
  },
  bottomContainerView: {
    alignItems: 'center',
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.04,
    paddingHorizontal: width * 0.04,
  },
  continueBtn: {
    width: width * 0.33,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    borderColor: '#0E9CC9',
    borderWidth: 1,
  },
  inputContainer: {
    marginTop: height * 0.025,
  },
  cancelBtn: {
    width: width * 0.3,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAEF',
    borderRadius: 25,
    borderColor: '#0E9CC9',
    borderWidth: 1,
  },
  continueTextBtn: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelTextBtn: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#0E9CC9',
  },

  textInputNameMainNew: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: '#9B9B9B',
    flexDirection: 'row',
  },

  numberCodeContainer: {
    fontSize: 16,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Medium',
  },
  numberMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
  },
  textInputNameNew: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  textInputUnit: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  nameText: {
    fontSize: 14,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Medium',
  },
  rejectPopop: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: width,
  },

  errorIconImageView: {
    alignItems: 'center',
    marginTop: height * 0.05,
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
  linkMobileTextView: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  linkMobileText: {
    fontFamily: 'Roboto-Black',
    fontSize: 28,
    color: '#26272C',
  },
  ButtonView: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    justifyContent: 'center',
    justifyContent: 'space-around',
  },
  inputContainerMainStyle: {
    height: 70,
    width: '100%',
    paddingHorizontal: 0,
  },
  inputContainerField: {
    width: '100%',
    height: 22,
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
    fontSize: 14,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Medium',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData[0],
  apartmentUnitsList: state.apartmentState.apartmentUnits,
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateAccount);
