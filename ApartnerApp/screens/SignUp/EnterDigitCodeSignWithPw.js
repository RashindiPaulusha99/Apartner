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
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.svg';
import {connect} from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {getUserApartmentsListAction} from '../Apartment/actions/apartment-action';

const {width, height} = Dimensions.get('window');

const EnterDigitCodeSignWithPw = ({navigation, getUserApartmentsList}) => {
  const [enableShift, setEnableShift] = useState(false);
  const navigateToBack = () => {
    navigation.navigate('EnterDigitCode');
  };
  const navigateToWelcomeBack = () => {
    Keyboard.dismiss();
    navigation.navigate('WelcomeBack');
  };
  const navigateToApartmentSelection = () => {
    Keyboard.dismiss();
    getUserApartmentsList(
      {
        userId: 1,
      },
      responseData => {
        navigation.navigate('ApartmentSelection');
      },
    );
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
            <View style={styles.topRowmainContainer}>
              <View style={styles.topRowContainer}>
                <TouchableOpacity
                  onPress={navigateToBack}
                  style={styles.backBtnContainer}>
                  <BackImage />
                </TouchableOpacity>
                <View>
                  <Text style={styles.mainTitle}>
                    Enter 4-digit code sent to
                  </Text>
                  <Text style={styles.mainTitleNumber}>071 *** **87</Text>
                </View>
              </View>
              <View style={styles.mainView}>
                <OTPInputView
                  style={styles.mainGrid}
                  pinCount={4}
                  onCodeFilled={code => {
                    setTypingOtpNumber(code);
                  }}
                  autoFocusOnLoad
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                />
              </View>
              <TouchableOpacity>
                <View style={styles.resendView}>
                  <Text style={styles.resendText}>Resend Code</Text>
                  <Text style={styles.resendTime}>00 : 29</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.signinwithpwView}>
                  <Text
                    style={styles.signinwithpwText}
                    onPress={navigateToWelcomeBack}>
                    Sign in with Password
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
              <View style={styles.continueBtn}>
                <TouchableOpacity
                  onPress={navigateToApartmentSelection}
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
    borderRadius: 24,
  },
  backBtnContainer: {
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
    width: 20,
  },
  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
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
    marginBottom: 9,
  },
  apartnerLogo: {
    height: height * 0.5,
    marginTop: '30%',
    alignItems: 'center',
  },

  mainContainer: {
    flex: 1,
  },
  buttonContinue: {
    backgroundColor: '#197B9A',
    borderColor: '#004F71',
    width: 300,
    height: 52,
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
    // marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  continueArrow: {
    marginHorizontal: 10,
  },

  mainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  resendText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: 'black',
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  resendView: {
    flexDirection: 'row',
    marginTop: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitleNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: 'black',
  },
  signinwithpwView: {
    flexDirection: 'row',
    marginTop: height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinwithpwText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#004F71',
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    marginRight: 5,
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
  topRowmainContainer: {
    flex: 6,
  },
  underlineStyleBase: {
    width: 55,
    height: 83,
    borderColor: '#707070',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: '#707070',
  },
  mainGrid: {
    width: '70%',
    height: 90,
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnterDigitCodeSignWithPw);
