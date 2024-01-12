import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  StatusBar,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import {ScrollView as Scroller} from 'react-native-gesture-handler';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import {DefaultButton} from '../../components';
import BottomSheet from '../../components/containers/bottomSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {checkUserPhoneNumberAvailabilityAction} from './actions/signUp-action';
import {phoneNumberStateAction} from '../SignUp/actions/signUp-action';
import {getCountryCodes} from './services/signUp-service';
import configConstants from '../../config/constants';
import MainLoginContainer from '../../components/containers/MainLoginContainer';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;
const SignUpMobileNew = ({
  navigation,
  userPhoneNumberAlreadyRegistered,
  checkUserPhoneNumberAvailability,
  phoneNumberState,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [visibleCountrySheet, setVisibleCountrySheet] = useState(false);

  const [typingPhoneNumber, setTypingPhoneNumber] = useState('');
  const [displayPhoneNumberError, setDisplayPhoneNumberError] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Sri Lanka',
    alpha2Code: 'LK',
    callingCodes: ['94'],
  });
  const [intialImagePath, setIntialImagePath] = useState(
    `${
      configConstants.apiUrlWithPort
    }/api/v1/assets/getAsset?filePath=files/country_flags`,
  );

  useEffect(() => {
    getCountryDataHandler();
  }, []);
  const getCountryDataHandler = async () => {
    const countryData = await getCountryCodes();
    setCountryList(countryData.data);
  };

  const navigateToEnterdigitCode = async () => {
    Keyboard.dismiss();
    setSpinner(true);
    setVisibleCountrySheet(false);
    try {
      if (typingPhoneNumber != '') {
        await checkUserPhoneNumberAvailability(
          {
            phoneNumber: `+${
              typingPhoneNumber.substr(0, 1) === '0'
                ? selectedCountry.callingCodes[0] + typingPhoneNumber.substr(1)
                : selectedCountry.callingCodes[0] + typingPhoneNumber
            }`,
          },
          response => {
            setSpinner(false);
            if (response.userExists) {
              setDisplayPhoneNumberError(false);
              phoneNumberState(
                `+${
                  typingPhoneNumber.substr(0, 1) === '0'
                    ? selectedCountry.callingCodes[0] +
                      typingPhoneNumber.substr(1)
                    : selectedCountry.callingCodes[0] + typingPhoneNumber
                }`,
              );
              navigation.navigate('EnterDigitCode');
            } else {
              // display error
              setDisplayPhoneNumberError(true);
            }
          },
        );
      } else {
        setSpinner(false);
        setDisplayPhoneNumberError(true);
      }
    } catch (error) {
      setSpinner(false);
      setDisplayPhoneNumberError(true);
    }
  };

  const navigateToBack = () => {
    navigation.navigate('SpalshScreen');
  };
  const visibilitySuccessfullHandler = status => {
    setVisibleCountrySheet(status);
  };
  const selectedCountryHandler = item => {
    setSelectedCountry(item);
    setVisibleCountrySheet(false);
  };

  const countryListBottomListContainer = () => (
    <View style={styles.countryPopupContainer}>
      <Scroller
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        {countryList.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => selectedCountryHandler(item)}
              style={styles.countryListContainerItem}>
              <View style={styles.countryListFlagData}>
                <Image
                  style={styles.flagImg}
                  source={{
                    uri: `${intialImagePath}/${item.path}`,
                  }}
                />
                <Text
                  style={[
                    styles.countryDataText,
                    {width: '80%', marginLeft: 10},
                  ]}>
                  {item.name}
                </Text>
              </View>
              <Text style={styles.countryDataText}>
                +{item.callingCodes[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Scroller>
    </View>
  );

  const countryBottomSheet = () => {
    return (
      <BottomSheet
        onVisible={visibleCountrySheet}
        visibilityHandler={visibilitySuccessfullHandler}
        children={countryListBottomListContainer}
        height={[height * 0.5, 0]}
        onCloseClick={onClose}
      />
    );
  };

  return (
    <MainLoginContainer
      lightTitle="Sign up with you"
      strongTitle="mobile number"
      submitContinueButton={navigateToEnterdigitCode}
      BottomSheets={visibleCountrySheet ? countryBottomSheet : null}
      backNavigation={navigateToBack}
      enableShift={enableShift}>
      <View
        style={{height: '75%', justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.inputFieldContainer}>
          <View style={styles.flagcontainer}>
            <TouchableOpacity
              onPress={() => {
                setVisibleCountrySheet(true);
                setOnClose(false);
                Keyboard.dismiss();
              }}>
              <Image
                style={styles.flagImg}
                source={{
                  uri: `${intialImagePath}/${selectedCountry.alpha2Code.toLocaleLowerCase()}.png`,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.inputPhoneNumberContainer,
              displayPhoneNumberError
                ? styles.inputPhoneNumberContainerError
                : null,
            ]}>
            <Text style={styles.mainNumber}>
              +{selectedCountry.callingCodes[0]}
            </Text>
            <TextInput
              style={[
                styles.inputPhoneNumber,
                displayPhoneNumberError ? {color: '#DD1C3A'} : null,
              ]}
              underlineColorAndroid="transparent"
              onChangeText={text => {
                setTypingPhoneNumber(text);
                setDisplayPhoneNumberError(false);
              }}
              value={typingPhoneNumber}
              keyboardType="numeric"
              maxLength={typingPhoneNumber.substr(0, 1) === '0' ? 10 : 9}
              onFocus={() => {
                setEnableShift(true);
                setVisibleCountrySheet(false);
                setDisplayPhoneNumberError(false);
              }}
            />
          </View>
        </View>
        <Text style={styles.textTitle}>
          By continuing you may receive a SMS for verification.
        </Text>
        {displayPhoneNumberError && (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>
              This number is not linked to any registered account.
            </Text>
            <Text style={styles.errorMessage}>
              Please contact your community administrator for more details.
            </Text>
          </View>
        )}
      </View>

      {spinner && spinner === true ? (
        <View style={[styles.spinnerContainer]}>
          <ActivityIndicator size="large" color="#0E9CC9" />
        </View>
      ) : null}
    </MainLoginContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: height,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#182850',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: 'black',
  },
  topCardMaincontainer: {
    flex: 4,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    width: width,
  },
  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
    left: width * 0.05,
  },
  apartnerTextContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },
  logoImg: {
    width: 80,
    height: 20,
  },
  continueBtn: {
    alignItems: 'center',
    flex: 1,
  },

  textTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 10,
    color: '#26272C',
    marginTop: height * 0.025,
  },
  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },
  countryPopupContainer: {
    backgroundColor: '#F5F7FD',
    alignItems: 'center',
    paddingHorizontal: '8%',
    paddingVertical: '5%',
    height: '100%',
    paddingBottom: 30,
  },
  flatList: {
    width: '100%',
  },
  countryListContainerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
  },
  countryListFlagData: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  countryDataText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#26272C',
  },
  mainContentContainer: {
    height: '45%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {fontFamily: 'Roboto-Light', fontSize: 18, color: '#26272C'},
  titleBoldText: {fontFamily: 'Roboto-Black', fontSize: 26, color: '#26272C'},

  inputFieldContainer: {
    flexDirection: 'row',
    width: width * 0.85,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flagcontainer: {
    paddingRight: 15,
  },

  flagImg: {
    width: 50,
    height: 25,
    resizeMode: 'stretch',
  },

  inputPhoneNumberContainer: {
    height: 50,
    width: width * 0.7,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F7FD',
    paddingHorizontal: width * 0.02,
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  inputPhoneNumberContainerError: {
    borderWidth: 1,
    borderColor: '#DD1C3A',
  },
  inputPhoneNumber: {
    width: '85%',
    marginLeft: 10,
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#26272C',
  },
  mainNumber: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#AAAAAA',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 10,
    color: '#DD1C3A',
    opacity: 1,
    fontFamily: 'Roboto-Regular',
  },
  errorMessageContainer: {
    marginTop: 5,
  },
});

const mapStateToProps = state => ({
  userPhoneNumberAlreadyRegistered:
    state.signUpState.userPhoneNumberAlreadyRegistered,
});

const mapDispatchToProps = dispatch => ({
  checkUserPhoneNumberAvailability: (payload, callBack) =>
    dispatch(checkUserPhoneNumberAvailabilityAction(payload, callBack)),
  phoneNumberState: phoneNumber =>
    dispatch(phoneNumberStateAction(phoneNumber)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUpMobileNew);
