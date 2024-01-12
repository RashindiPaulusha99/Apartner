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
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.svg';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import {color} from 'react-native-reanimated';
import IconEye from '../../assets/images/feather-eye-off.svg';
import BottomSheet from '../../components/containers/bottomSheetV2';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;
import RightImage from '../../assets/images/feather-check-circle.svg';
import {sendForgotPasswordEmail} from './services/signUp-service';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {DefaultButtonPlain, DefaultButtonPlainOutlined} from '../../components';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {getUserApartmentsListAction} from '../Apartment/actions/apartment-action';

const EnterTheEmail = ({navigation, phoneNumber}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [email, setEmail] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingPage, setLoadingPage] = useState(false);
  const navigateToBack = () => {
    navigation.navigate('WelcomeBack');
  };
  const navigateToWelcomeBack = () => {
    Keyboard.dismiss();
    navigation.navigate('WelcomeBack');
  };
  const visibilityHandler = status => {
    setOpenBottomSheet(status);
    setErrorStatus(false);
    setErrorMessage(null);
  };
  const renderInner = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.topCardGreen}>
        <View style={styles.rightImageview}>
          <Icon name="check" size={32} color="#3ADB14" />
        </View>
        <View style={styles.emailText}>
          <Text style={styles.emailTextSent}>Email Sent!</Text>
        </View>
        <View style={styles.checkTextview}>
          <Text style={styles.checkTextYour}>
            Check your inbox for an email from
          </Text>
          <Text style={styles.checkTextYour}>
            <Text style={styles.checkTextYourApartner}>APARTNER</Text> with a
            link to
          </Text>
          <Text style={styles.checkTextYour}>reset your password.</Text>
        </View>
        <View style={styles.bottonView}>
          <View style={styles.okBtnView}>
            <DefaultButtonPlain submit={navigateToWelcomeBack} title="OK" />
          </View>
          <View
            style={{
              flex: 1,
            }}
          />
          <View style={styles.recendBtnView}>
            <DefaultButtonPlainOutlined submit={emailsend} title="Resend" />
          </View>
        </View>
      </View>
    </View>
  );

  const emailsend = async () => {
    setLoadingPage(true);

    try {
      let dataParams = {
        email: email,
        phoneNumber: phoneNumber,
      };
      const sendmails = await sendForgotPasswordEmail(dataParams);
      if (sendmails.data.body === true) {
        setOpenBottomSheet(true);
      } else {
        setOpenBottomSheet(false);
        setErrorStatus(true);
        setErrorMessage('This email isnt associated with your mobile number.');
      }
    } catch (error) {
    } finally {
      setLoadingPage(false);
    }
  };

  const TopRowContainer = () => {
    return (
      <View style={styles.topRowContainer}>
        <TouchableOpacity
          onPress={navigateToBack}
          style={styles.backBtnContainer}>
          <MaterialIcon name="arrow-back" size={24} color="#26272C" />
        </TouchableOpacity>

        <View style={styles.apartnerTextContainer}>
          <Image style={styles.logoImg} source={apartnerLogo} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.topCard}>
              <View style={styles.topRowmainContainer}>
                <TopRowContainer />
                <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
                  <View style={styles.mainContainerView}>
                    <View style={styles.mainTextHeaderContainer}>
                      <View style={{alignItems: 'center', marginTop: 20}}>
                        <Text style={styles.signInWith}>Sign-in with</Text>
                        <Text style={styles.textEmail}>Email</Text>
                        <Text style={styles.textEnterEmail}>
                          Enter email you used to register
                        </Text>
                      </View>
                    </View>

                    <View style={styles.textInputview}>
                      <View>
                        <Text style={styles.enterEmailText}>
                          Enter Email Address
                        </Text>

                        <TextInput
                          value={email}
                          onChangeText={text => {
                            setEmail(text != '' ? text : '');
                            setErrorStatus(false);
                            setErrorMessage(null);
                          }}
                          style={
                            errorMessage
                              ? styles.inputEmailErrorContainer
                              : styles.inputEmailContainer
                          }
                          placeholder="Enter Registered Email"
                          autoCapitalize="none"
                        />
                        <View style={styles.errorMessageMainView}>
                          {errorMessage && (
                            <Text style={styles.PasswordDoesntMatchText}>
                              {errorMessage}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
              <View style={styles.mainContainer}>
                <View style={styles.continueBtn}>
                  <TouchableOpacity
                    onPress={() => emailsend()}
                    style={styles.buttonContinue}
                    disabled={email ? false : true}>
                    <View
                      style={
                        email
                          ? styles.btnTextContainerEnable
                          : styles.btnTextContainerDisable
                      }>
                      <Text style={styles.textContinue}>Continue</Text>
                      <CountinueBtn style={styles.continueArrow} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <LoadingDialogue visible={loadingPage} />
            </View>
          </SafeAreaView>
          {openBottomSheet ? (
            <Overlay
              overlayStyle={{
                backgroundColor: 'rgba(226, 226, 226, 0.8)',
                padding: 0,
                margin: 0,
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
                visibilityHandler={visibilityHandler}
                children={renderInner}
                height={273}
              />
            </Overlay>
          ) : null}
        </>
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
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topRowmainContainer: {
    flex: 4,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },

  topCardMaincontainer: {
    flex: 4,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },

  mainTextHeaderContainer: {
    height: '25%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  signInWith: {
    color: '#26272C',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Light',
    lineHeight: 28,
  },
  textEmail: {
    fontSize: 26,
    color: '#26272C',
    textAlign: 'center',
    fontFamily: 'Roboto-Black',
    lineHeight: 28,
    marginBottom: 5,
  },

  textEnterEmail: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 16,
    color: '#26272C',
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
    width: 80,
    height: 20,
  },

  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: 'black',
    width: '70%',
  },

  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    paddingHorizontal: 10,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    marginHorizontal: width * 0.05,
    backgroundColor: '#FFFFFF',
  },
  continueBtn: {
    alignItems: 'center',
    flex: 1,
  },

  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },

  buttonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTextContainerEnable: {
    backgroundColor: '#0E9CC9',
    borderColor: '#087395',
    width: width * 0.85,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTextContainerDisable: {
    backgroundColor: '#96BAC6',
    borderColor: '#96BAC6',
    width: width * 0.85,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueArrow: {
    marginHorizontal: 10,
    position: 'absolute',
    right: '10%',
    height: 24,
    width: 24,
  },

  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  inputEmailContainer: {
    flexDirection: 'row',
    borderColor: '#0E9CC9',
    width: width * 0.85,
    height: height * 0.07,
    borderWidth: 0.7,
    borderRadius: 6,
    opacity: 1,
    backgroundColor: '#F5F7FD',
    fontSize: 20,
    paddingHorizontal: 20,
  },

  inputEmailErrorContainer: {
    flexDirection: 'row',
    borderColor: '#DD1C3A',
    width: width * 0.85,
    height: height * 0.07,
    borderWidth: 0.7,
    borderRadius: 6,
    opacity: 1,
    backgroundColor: '#F5F7FD',
    fontSize: 20,
  },

  enterEmailText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: '#235464',
    fontWeight: 'normal',
    marginBottom: 10,
    marginTop: 5,
  },
  PasswordDoesntMatchText: {
    marginTop: height * 0.02,
    color: '#DD1C3A',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    width: '90%',
    alignItems: 'center',
    lineHeight: 16,
  },
  textInputview: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.12,
  },
  errorMessageMainView: {
    justifyContent: 'center',
    alignItems: 'center',
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

  rejectPopop: {
    backgroundColor: '#FFFFFF',
    height: 273,
    width: width,
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
    fontFamily: 'Roboto-Black',
    fontSize: 28,
    color: '#26272C',
  },
  checkTextview: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  checkTextYour: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
  },
  checkTextYourApartner: {
    fontFamily: 'Roboto-Black',
  },
  okBotton: {
    width: 130,
    height: 51,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
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
    marginTop: height * 0.03,
  },
  okBtnView: {
    flex: 6,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  recendBtnView: {
    flex: 6,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  resendBottonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    color: '#4D4D4D',
    fontWeight: 'bold',
  },
  resendBotton: {
    width: 130,
    height: 51,
    backgroundColor: '#C8C8C8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  topCardGreen: {
    flex: 1,
  },
});

const mapStateToProps = state => ({
  phoneNumber: state.signUpState.phoneNumber,
});

const mapDispatchToProps = dispatch => ({
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EnterTheEmail);
