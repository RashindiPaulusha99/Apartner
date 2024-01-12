import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TextInput,
  InputText,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import {DefaultButton} from '../../components';
import {
  confirmPasswordApi,
  updateCheckIsNewUser,
} from './services/signUp-service';
import {connect} from 'react-redux';
import {getUserApartmentsListAction} from '../Apartment/actions/apartment-action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {setUpdatedUserDataAction} from './actions/signUp-action';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

const ConfirmPassword = ({
  navigation,
  loggedInUserData,
  getUserApartmentsList,
  setUpdatedUserData,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [userPassword, setUserPassword] = useState(null);
  const [confirmPassword, setUserConfirmPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryConfirmPassword, setSecureTextEntryConfirmPassword] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const changePasswordHandler = data => {
    // password change logic / code
  };

  const navigateToBack = () => {
    navigation.navigate('EnterDigitCode');
  };

  useEffect(() => {}, [loggedInUserData]);

  const changePassword = async () => {
    setSpinner(true);
    Keyboard.dismiss();
    setErrorStatus(false);
    if (!userPassword || !confirmPassword) {
      setErrorStatus(true);

      setErrorMessage('Fill all the fields');
      setSpinner(false);
    } else {
      if (userPassword === confirmPassword) {
        if (userPassword.length < 8) {
          setErrorStatus(true);
          setErrorMessage('Password is too short');
          setSpinner(false);
        } else {
          const data = {
            userPassword: userPassword,
            // userId: userId,
          };
          let userData = {
            password: userPassword,
            userId: loggedInUserData.user_id,
            userRowId: loggedInUserData.user_row_id,
          };
          const setPassword = await confirmPasswordApi(userData);
          let updatedUser = setPassword.data.body.newUserData;
          await setUpdatedUserData(setPassword.data.body.newUserData);

          let response = {
            userId: updatedUser.user_id,
            userRowId: updatedUser.user_row_id,
          };

          const updateIsNewUser = await updateCheckIsNewUser(response);

          setUpdatedUserData(updateIsNewUser.data.body.newUserData);
          Keyboard.dismiss();
          getUserApartmentsList(
            {
              userId: 1,
            },
            responseData => {
              navigation.navigate('PrivacyAndPolicy');
            },
          );
        }
      } else {
        setSpinner(false);
        setErrorStatus(true);
        setErrorMessage(
          'You must enter the same password twice in order to confirm.',
        );
      }
    }
  };

  const navigateToEnterDigitCodeSignWithPwScreen = () => {
    navigation.navigate('ApartmentSelection');
  };

  const visiblityPassword = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const visiblityPasswordConfirmPassword = () => {
    setSecureTextEntryConfirmPassword(!secureTextEntryConfirmPassword);
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
              <View style={styles.mainContentContainer}>
                <View style={{alignItems: 'center', marginTop: 20}}>
                  <Text style={styles.titleText}>Sign in with </Text>
                  <Text style={styles.titleBoldText}>Password</Text>
                  <Text style={styles.titleTextSetYourNewPassword}>
                    Set your new Password
                  </Text>
                </View>
                <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
                  <KeyboardAvoidingView
                    behavior="position"
                    enabled={enableShift}
                    keyboardVerticalOffset={Platform.select({
                      ios: () => height * 0.2,
                      android: () => height * 0.2,
                    })()}
                    style={styles.formContainer}>
                    <View style={styles.inputMainContainer}>
                      <Input
                        inputContainerStyle={[
                          styles.inputContainerField,
                          errorMessage ? styles.inputContainerFieldError : null,
                        ]}
                        lable={'Password *'}
                        inputStyle={styles.inputField}
                        labelStyle={styles.inputLabel}
                        secureTextEntry={secureTextEntry}
                        onChangeText={text => {
                          setErrorStatus(false);
                          setErrorMessage(null);
                          setUserPassword(text);
                        }}
                        rightIcon={
                          secureTextEntry
                            ? {
                                type: 'font-awesome',
                                name: 'eye-slash',
                                color: '#84C7DD',
                                onPress: () => {
                                  visiblityPassword();
                                },
                              }
                            : {
                                type: 'font-awesome',
                                name: 'eye',
                                color: '#84C7DD',
                                onPress: () => {
                                  visiblityPassword();
                                },
                              }
                        }
                        onFocus={() => setEnableShift(true)}
                        label="Enter Password"
                        autoCapitalize="none"
                        placeholder="Enter the password"
                      />
                      <Input
                        inputContainerStyle={[
                          styles.inputContainerField,
                          errorMessage ? styles.inputContainerFieldError : null,
                        ]}
                        inputStyle={styles.inputField}
                        labelStyle={styles.inputLabel}
                        lable={'Password *'}
                        secureTextEntry={secureTextEntryConfirmPassword}
                        onChangeText={text => {
                          setErrorStatus(false);
                          setErrorMessage(null);
                          setUserConfirmPassword(text);
                        }}
                        rightIcon={
                          secureTextEntryConfirmPassword
                            ? {
                                type: 'font-awesome',
                                name: 'eye-slash',
                                color: '#84C7DD',
                                onPress: () => {
                                  visiblityPasswordConfirmPassword();
                                },
                              }
                            : {
                                type: 'font-awesome',
                                name: 'eye',
                                color: '#84C7DD',
                                onPress: () => {
                                  visiblityPasswordConfirmPassword();
                                },
                              }
                        }
                        onFocus={() => setEnableShift(true)}
                        label="Confirm Password"
                        autoCapitalize="none"
                        placeholder="Enter the password"
                      />
                      <View style={styles.errorMessageMainContainer}>
                        {errorMessage && (
                          <Text style={styles.textTitle}>{errorMessage}</Text>
                        )}
                      </View>
                    </View>
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
            </View>
            <View style={styles.continueBtn}>
              <DefaultButton
                submit={changePassword}
                title="Continue"
                customStyle={styles.bottomBtnStyle}
              />
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
    width: 80,
    height: 20,
  },
  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },
  mainContentContainer: {
    height: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {fontFamily: 'Roboto-Light', fontSize: 18, color: '#26272C'},
  titleBoldText: {fontFamily: 'Roboto-Black', fontSize: 26, color: '#26272C'},

  titleTextSetYourNewPassword: {
    fontFamily: 'Roboto-bold',
    fontSize: 16,
    color: '#26272C',
  },
  inputMainContainer: {
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  continueBtn: {
    alignItems: 'center',
    flex: 1,
    marginBottom: height * 0.02,
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#F23B4E',
    fontWeight: 'bold',
    marginTop: 5,
  },
  inputContainerField: {
    width: width * 0.85,
    height: 42,
    backgroundColor: '#F5F7FD',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 6,
    paddingHorizontal: width * 0.025,
  },
  inputContainerFieldError: {
    borderWidth: 1,
    borderColor: '#DD1C3A',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'Roboto',
    color: '#26272C',
    fontSize: 15,
  },
  inputLabel: {
    fontFamily: 'Roboto',
    color: '#235464',
    fontSize: 16,
    opacity: 1,
    marginBottom: height * 0.01,
  },
  topCardMaincontainer: {
    flex: 6,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },
});
const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
  setUpdatedUserData: payload => dispatch(setUpdatedUserDataAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmPassword);
