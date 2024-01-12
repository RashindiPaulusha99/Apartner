import React, {useState} from 'react';
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
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
  StatusBar,
  ImageBackground,
  Image,
  Modal,
} from 'react-native';

import {Button, Input} from 'react-native-elements';

import SignUpBg from '../../assets/images/AddBg.png';

import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import CheckCircle from '../../assets/icons/green-check-circle.svg';
import CalenderIcon from '../../assets/icons/feather-calendar-black.svg';
import UploadCamera from '../../assets/icons/upload-feather-camera.svg';
import EditIcon from '../../assets/icons/feather-edit.svg';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
// import {saveUserAddVisitor} from './services/Member-service';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import ChangeCountVisitorBottomSheet from '../../components/containers/ChangeCountBottomSheet';
import {connect} from 'react-redux';
import member from '../../assets/images/user-dummy.png';
import {MainContainer} from '../../components/';

const {width, height} = Dimensions.get('window');

const VisitorStatus = ({
  navigation,
  apartmentUnitsList,
  loggedInUserData,
  selectedUnitInMain,
}) => {
  const [show, setShow] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [visitingUnitData, setVisitingUnitData] = useState(null);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [
    visibleReleationshipBottomSheet,
    setVisibleCountVisitorBottomSheet,
  ] = useState(false);

  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const [countVisitor, setCountVisitorData] = useState(null);
  const [date, setDate] = useState(new Date());

  const navigateToBack = () => {
    navigation.navigate('VisitorManager');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
  };

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };

  const visibilityCountVisitorHandler = status => {
    setVisibleCountVisitorBottomSheet(status);
  };
  const visitorCountHandler = num => {
    setCountVisitorData(num);
  };
  const unitHandler = unit => {
    setVisitingUnitData(unit);
  };

  const showMode = () => {
    setShow(true);
  };

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Visitor Status"
      subTitle="View Visitor Details"
      flagName="OUT"
      tagBackgroundColour="#F23B4E"
      changeUnitState={false}>
      <View>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={enableShift}
            style={styles.container}
            keyboardVerticalOffset={Platform.select({
              ios: () => 0,
              android: () => height * 0.1,
            })()}>
            <View style={styles.bottomCard}>
              <View style={styles.cardHeaderView}>
                <View
                  style={styles.scroll}
                  onStartShouldSetResponder={() => true}>
                  <View style={styles.topCardSecondContainer}>
                    <View style={styles.courierCardView}>
                      <CheckCircle style={styles.ApartnerSecondIcon} />
                      <Text style={styles.ViewCourierText}>
                        Approved by{' '}
                        <Text style={{fontFamily: 'Poppins-SemiBold'}}>
                          John Doe
                        </Text>
                      </Text>
                    </View>
                    <View style={styles.VisitorTypeContainer}>
                      <Text style={styles.visitorTypeText}>COURIOR</Text>
                    </View>
                  </View>
                  <ScrollView
                    keyboardDismissMode="on-drag"
                    style={{
                      flex: 1,
                      paddingHorizontal: width * 0.03,
                      marginTop: height * 0.02,
                    }}>
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      onFocus={() => setEnableShift(false)}
                      label="Company"
                      autoCapitalize="none"
                      autoComplete={false}
                    />

                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      labelStyle={styles.inputLabel}
                      onFocus={() => setEnableShift(false)}
                      label="First Name"
                      autoCapitalize="none"
                      autoComplete={false}
                    />
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      onFocus={() => setEnableShift(false)}
                      label="Last Name"
                      autoCapitalize="none"
                      autoComplete={false}
                    />
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      value="77 650 1987"
                      labelStyle={styles.inputLabel}
                      onFocus={() => setEnableShift(false)}
                      label="Contact No."
                      autoCapitalize="none"
                      autoComplete={false}
                      leftIcon={<Text style={styles.leftNumber}>+94</Text>}
                    />

                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      onFocus={() => setEnableShift(false)}
                      label="Vehicle No."
                      autoCapitalize="none"
                      autoComplete={false}
                    />
                    <View style={styles.CountVisitorContainer}>
                      <Text style={styles.inputLabel}>
                        Additional Visitor Count
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setVisibleCountVisitorBottomSheet(true);
                        }}
                        style={styles.bottomSheetCountVisitorBtn}>
                        <Text style={styles.residentUnitText}>
                          {countVisitor ? countVisitor : '0'}
                        </Text>
                        {visibleReleationshipBottomSheet ? (
                          <UpIcon height={10} width={10} />
                        ) : (
                          <DownIcon height={10} width={10} />
                        )}
                      </TouchableOpacity>
                    </View>

                    <View style={styles.CountVisitorContainer}>
                      <Text style={styles.inputLabel}>Visited Unit</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setVisibleBottomSheet(true);
                        }}
                        style={styles.bottomSheetCountVisitorBtn}>
                        <Text style={styles.residentUnitText}>
                          {visitingUnitData ? visitingUnitData : 'XB/01'}
                        </Text>
                        {visibleBottomSheet ? (
                          <UpIcon height={10} width={10} />
                        ) : (
                          <DownIcon height={10} width={10} />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.inputLabelContainer}>
                      <Text style={styles.inputLabel}>In Time</Text>
                    </View>
                    <View style={styles.calenderComponent}>
                      <TouchableOpacity
                        onPress={() => {
                          showMode();
                        }}
                        style={{marginTop: 10}}>
                        <CalenderIcon width={25} height={25} />
                      </TouchableOpacity>
                      <Input
                        inputContainerStyle={styles.inputContainerField}
                        inputStyle={styles.inputField}
                        labelStyle={styles.inputLabel}
                        onFocus={() => setEnableShift(false)}
                        autoCapitalize="none"
                        autoComplete={false}
                      />
                    </View>

                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                    <View style={styles.inputLabelContainer}>
                      <Text style={styles.inputLabel}>Out Time</Text>
                    </View>
                    <View style={styles.calenderComponent}>
                      <TouchableOpacity
                        onPress={() => {
                          showMode();
                        }}
                        style={{marginTop: 10}}>
                        <CalenderIcon width={25} height={25} />
                      </TouchableOpacity>
                      <Input
                        inputContainerStyle={styles.inputContainerField}
                        inputStyle={styles.inputField}
                        labelStyle={styles.inputLabel}
                        onFocus={() => setEnableShift(false)}
                        autoCapitalize="none"
                        autoComplete={false}
                      />
                    </View>

                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={false}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </ScrollView>
                </View>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={[
                    styles.buttonMainView,
                    {width: '47.5%', backgroundColor: '#89B2C4'},
                  ]}
                  onPress={navigateToBack}>
                  <Text style={styles.visitortText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.buttonMainView, {width: '47.5%'}]}>
                  <Text style={styles.visitortText}>View Parcel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
      {visibleReleationshipBottomSheet && (
        <ChangeCountVisitorBottomSheet
          onVisible={visibleReleationshipBottomSheet}
          visibilityHandler={visibilityCountVisitorHandler}
          unitHandler={visitorCountHandler}
          unitList={apartmentUnitsList}
        />
      )}
      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
        />
      )}
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
  topRowContainer: {
    flexDirection: 'row',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  backBtnContainer: {
    marginTop: height * 0.01,
    width: '5%',
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 26,
    color: '#004F71',
    fontWeight: 'bold',
  },

  titleContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: width * 0.03,
    paddingRight: width * 0.07,
  },
  mainTitleExplore: {
    fontSize: 12,
    color: '#89B2C4',
    fontFamily: 'Poppins-Regular',
  },
  VisitorStatusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    justifyContent: 'center',
    height: 30,
  },
  visitorStatusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  bottomCard: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  buttonMainView: {
    height: height * 0.08,
    backgroundColor: '#197B9A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
  },
  buttonView: {
    paddingHorizontal: width * 0.05,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderView: {
    alignItems: 'center',
  },
  visitortText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
  },
  topCardSecondContainer: {
    width: '100%',
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  courierCardView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewCourierText: {
    color: '#239D06',
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  VisitorTypeContainer: {
    backgroundColor: '#197B9A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  visitorTypeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  scroll: {
    width: '100%',
    height: height * 0.68,
  },
  calenderComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.02,
  },
  CountVisitorContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: width * 0.02,
  },
  bottomSheetBtn: {
    height: 40,
    width: '80%',
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSheetCountVisitorBtn: {
    height: 40,
    width: '40%',
    marginHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentUnitText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#212322',
  },
  inputField: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#212322',
  },
  leftNumber: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#9B9B9B',
  },
  inputLabelContainer: {
    marginHorizontal: width * 0.02,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    color: '#9B9B9B',
    fontSize: 12,
  },
  inputContainerField: {
    width: '100%',
    height: 40,
    borderColor: '#9B9B9B',
    borderBottomWidth: 1,
  },

  CheckCircle: {
    marginRight: 5,
  },
  ApartnerSecondIcon: {
    marginRight: 15,
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnitInMain: state.apartmentState.selectedUnit,
});
const mapDispatchToProps = dispatch => ({});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisitorStatus);
