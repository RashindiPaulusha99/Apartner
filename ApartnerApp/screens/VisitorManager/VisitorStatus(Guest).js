import React, {useState, useEffect} from 'react';
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
import moment from 'moment';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import ChangeCountVisitorBottomSheet from '../../components/containers/ChangeCountBottomSheet';
import {connect} from 'react-redux';
import {getVisitorData} from './services/Visitor-service';
import AsyncStorage from '@react-native-community/async-storage';
import {MainContainer} from '../../components/';

const {width, height} = Dimensions.get('window');

const VisitorStatusGuest = ({
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

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [vehicleNo, setVehicleNo] = useState(null);
  const [additionalVisitorCounts, setAdditionalVisitorCounts] = useState(null);

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
  const [visitorDataList, setVisitorDataList] = useState([]);

  useEffect(() => {
    initDataInPage();
  }, []);
  // get function
  const initDataInPage = async () => {
    const visitorId = await AsyncStorage.getItem('selectedVisiorId');
    const dataParam = {visitors_id: visitorId};
    const getData = await getVisitorData(dataParam);
    setVisitorDataList(getData.data[0]);
  };

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Visitor Status"
      subTitle="View Visitor Details"
      flagName="IN"
      tagBackgroundColour="#239D06"
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
                      <Text style={styles.visitorTypeText}>GUEST</Text>
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
                      labelStyle={styles.inputLabel}
                      inputStyle={styles.inputField}
                      editable={false}
                      onFocus={() => setEnableShift(false)}
                      label="First Name"
                      autoCapitalize="none"
                      autoComplete={false}
                      value={
                        firstName != null
                          ? firstName
                          : visitorDataList.visiter_first_name
                      }
                    />
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      editable={false}
                      onFocus={() => setEnableShift(false)}
                      label="Last Name"
                      autoCapitalize="none"
                      autoComplete={false}
                      value={
                        lastName != null
                          ? lastName
                          : visitorDataList.visiter_last_name
                      }
                    />
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      editable={false}
                      onFocus={() => setEnableShift(false)}
                      label="Contact No."
                      autoCapitalize="none"
                      autoComplete={false}
                      leftIcon={<Text style={styles.leftNumber}>+94</Text>}
                      value={visitorDataList.contact_no}
                    />
                    <Input
                      inputContainerStyle={styles.inputContainerField}
                      inputStyle={styles.inputField}
                      labelStyle={styles.inputLabel}
                      editable={false}
                      onFocus={() => setEnableShift(false)}
                      label="Vehicle No."
                      autoCapitalize="none"
                      autoComplete={false}
                      value={
                        vehicleNo != null
                          ? vehicleNo
                          : visitorDataList.vehicle_no
                      }
                    />
                    <View style={styles.CountVisitorContainer}>
                      <Text style={styles.inputLabel}>
                        Additional Visitor Count
                      </Text>
                      <View style={styles.visitorCountDropDown}>
                        <Input
                          editable={false}
                          keyboardType="numeric"
                          value={
                            additionalVisitorCounts != null
                              ? additionalVisitorCounts
                              : `${visitorDataList.additional_visitor_count}`
                          }
                          inputStyle={styles.inputFeildVisitorCount}
                          inputContainerStyle={
                            styles.additionalVisitorInputFieldContainer
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.CountVisitorContainer}>
                      <Text style={styles.inputLabel}>Visited Unit</Text>
                      <TouchableOpacity
                        editable={false}
                        style={styles.bottomSheetCountVisitorBtn}>
                        <Text style={styles.visitorUnitDropText}>
                          {visitorDataList != null
                            ? visitorDataList.visiting_unit
                            : ''}
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
                      <CalenderIcon width={25} height={25} />
                      <Input
                        inputContainerStyle={styles.inputContainerField}
                        inputStyle={styles.inputField}
                        editable={false}
                        labelStyle={styles.inputLabel}
                        onFocus={() => setEnableShift(false)}
                        autoCapitalize="none"
                        autoComplete={false}
                        value={moment(
                          visitorDataList.visiting_date != null
                            ? visitorDataList.visiting_date
                            : '',
                        ).format('MMMM DD YYYY hh:mm:ss')}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View style={styles.mainBtnContainer}>
                <TouchableOpacity
                  style={[
                    styles.buttonMainView,
                    {width: '80%', backgroundColor: '#89B2C4'},
                  ]}
                  onPress={navigateToBack}>
                  <Text style={styles.visitortText}>Close</Text>
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
  overlay: {
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  // bottomCardView: {
  //   alignItems: 'center',
  //   marginTop: height * 0.005,
  //   backgroundColor: 'red',
  // },
  bottomCard: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  mainBtnContainer: {
    alignItems: 'center',
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
    flex: 1,
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
  uploadCorner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadCameraContainer: {
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 25,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    textAlignVertical: 'center',
    left: -15,
  },
  scroll: {
    // flex: 1,
    width: '100%',
    height: height * 0.68,
  },
  firstTwoInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.04,
    marginHorizontal: width * 0.02,
  },
  residentUnitContainer: {
    width: '50%',
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

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#212322',
    fontFamily: 'Poppins-Bold',
    marginLeft: 15,
  },
  bottonCardBottom: {
    width: 221,
    height: 51,
    borderRadius: 16,
    backgroundColor: '#197B9A',
    justifyContent: 'center',
    marginTop: 5,
  },
  bottonCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottonCardContainerText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    marginLeft: 15,
  },
  visitorCountDropDown: {
    height: 40,
    width: '40%',
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    marginTop: height * 0.02,
    justifyContent: 'center',
    marginRight: height * 0.02,
  },
  inputFeildVisitorCounta: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212322',
  },
  additionalVisitorInputFieldContainer: {
    width: 40,
    height: 23,
    marginTop: height * 0.04,
    marginLeft: width * 0.05,
    borderColor: '#9B9B9B',
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
)(VisitorStatusGuest);
