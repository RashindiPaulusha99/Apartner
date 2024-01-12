import React, {useState} from 'react';
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
  StatusBar
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.svg';
import FlagIcon from '../../assets/images/FlagIcon.svg';
import {connect} from 'react-redux';
import {checkUserPhoneNumberAvailabilityAction} from './actions/signUp-action';
import {phoneNumberStateAction} from '../SignUp/actions/signUp-action';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight + (height * 0.05);
const SignUpMobileNew = ({
  navigation,
  userPhoneNumberAlreadyRegistered,
  checkUserPhoneNumberAvailability,
  phoneNumberState,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [typingPhoneNumber, setTypingPhoneNumber] = useState('');
  const [displayPhoneNumberError, setDisplayPhoneNumberError] = useState(false);
  const navigateToEnterdigitCode = async () => {
    Keyboard.dismiss();
    setSpinner(true);
    try {
      const validate = await checkUserPhoneNumberAvailability(
        {
          phoneNumber: typingPhoneNumber,
        },
        response => {
          setSpinner(false);
          if (response.userExists) {
            setDisplayPhoneNumberError(false);
            phoneNumberState(typingPhoneNumber);
            navigation.navigate('EnterDigitCode');
          } else {
            // display error
            setDisplayPhoneNumberError(true);
          }
        },
      );
    } catch (error) {
      setSpinner(false);
      setDisplayPhoneNumberError(true);
    }
  };
  const navigateToBack = () => {
    navigation.navigate('SplashScreen');
  };

  return (
    <AppInitialSignUpContainer>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={enableShift}
          style={styles.container}
          keyboardVerticalOffset={Platform.select({
            ios: () => 0,
            android: () => height * 0.1,
          })()}>
          <View style={styles.topCard}>
            <View style={styles.topCardMaincontainer}>
              <View style={styles.topRowContainer}>
                <TouchableOpacity
                  onPress={navigateToBack}
                  style={styles.backBtnContainer}>
                  <BackImage />
                </TouchableOpacity>

                <Text style={styles.mainTitle}>Enter your Mobile Number</Text>
              </View>
              <View style={styles.poneNumberMainView}>
                <FlagIcon style={styles.flagImage} />
                <View style={styles.inputPhoneNumberContainer}>
                  <Text style={styles.mainNumber}>+94</Text>
                  <TextInput
                    style={styles.inputPhoneNumber}
                    onChangeText={text => {
                      setTypingPhoneNumber(text);
                    }}
                    value={typingPhoneNumber}
                    placeholder="71 234 5678"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>
              </View>
              {displayPhoneNumberError && (
                <View style={styles.errorMessageContainer}>
                  <Text style={styles.errorMessage}>
                    This number is not linked to any registered account.
                  </Text>
                  <Text style={styles.errorMessage}>
                    Please contact your community administor.
                  </Text>
                </View>
              )}

              {spinner && spinner === true ? (
                <View style={[styles.spinnerContainer]}>
                  <ActivityIndicator size="large" />
                </View>
              ) : null}
            </View>
            <View style={styles.mainContainer}>
              <Text style={styles.textTitle}>
                By continuing you may receive a SMS for verification.
              </Text>
              <View style={styles.continueBtn}>
                <TouchableOpacity
                  onPress={() => navigateToEnterdigitCode()}
                  style={styles.buttonContinue}>
                  <View style={styles.btnTextContainer}>
                    <Text style={styles.textContinue}>Continue</Text>
                    <CountinueBtn style={styles.continueArrow} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <SafeAreaView style={{flex: 3}}>
            <View style={styles.apartnerLogo}>
              <Apartnerlogo />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </AppInitialSignUpContainer>
  );
};

const styles = StyleSheet.create({
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  topCard: {
    flex: 5,
    backgroundColor: 'white',
    borderBottomRightRadius : 24,
    borderBottomLeftRadius : 24,
  },
  backBtnContainer: {
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
    width: 20,
  },
  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: 'black',
    marginTop: height * 0.02,
  },

  topRowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  continueBtn: {
    alignItems: 'center',
  },

  textTitle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'normal',
    paddingBottom: 10,
  },
  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },
  inputPhoneNumberContainer: {
    height: height * 0.065,
    width: width * 0.7,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  poneNumberMainView: {
    flexDirection: 'row',
    marginTop: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagImage: {
    marginRight: height * 0.02,
  },
  inputPhoneNumber: {
    marginLeft: height * 0.02,
    top: 2,
    color: '#000',
  },
  mainNumber: {
    marginLeft: height * 0.02,
    fontWeight: 'bold',
  },
  mainContainer: {
    flex: 1,
  },
  buttonContinue: {
    backgroundColor: '#197B9A',
    borderColor: '#004F71',
    width: width * 0.9,
    height: height * 0.08,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextContainer: {
    flexDirection: 'row',
  },
  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueArrow: {
    marginHorizontal: 10,
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 12,
    color: '#F23B4E',
    fontWeight: 'bold'
  },
  errorMessageContainer: {
    marginTop: 5,
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
  topCardMaincontainer: {
    flex: 3,
    marginTop : statusBarHeight
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
