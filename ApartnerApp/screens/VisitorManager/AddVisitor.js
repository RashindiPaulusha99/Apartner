import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';

import {Input} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import {connect} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import {MainContainer, TopCardContainer} from '../../components/';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import ContactIcon from '../../assets/images/Contact-Icon.svg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {saveUserAddVisitor} from './services/Visitor-service';
import BottomSheet from '../../components/containers/bottomSheet';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import {changeVisitorAction} from './actions/apartment-action';
import {weekdays} from '../../components/constants/weekdays';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import TickBoxIconBlue from '../../assets/icons/TickBoxIconBlue.svg';
import TickBoxIconGray from '../../assets/icons/TickBoxIconGray.svg';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import { setVisitorDataListAction } from './actions/visitor-actions';

const {width, height} = Dimensions.get('window');

const AddVisitor = ({
  navigation,
  apartmentUnitsList,
  loggedInUserData,
  selectedUnitInMain,
  setSelectedUnit,
  visitorListChange,
  visitorStatusChange,
  selectedApartmentComplex,
  visitorsDataList,
  setMemberVisitorDataList
}) => {
  let datepickerRef = useRef(null);

  const [show, setShow] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nicPassport, setNicPassport] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  const [additionalVisitorCount, setAdditionalVisitorCount] = useState('0');
  const [visitingUnitData, setVisitingUnitData] = useState(selectedUnitInMain);
  const [visitingFrequency, setVisitingFrequency] = useState('none');
  const [visitingWeekDays, setVisitingWeekDays] = useState('');
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [openBottomSheetOne, setOpenBottomSheetOne] = useState(false);
  const [receivedSecurityCode, setReceivedSecurityCode] = useState(false);
  const [enableAddVisitorButton, setEnableAddVisitorButton] = useState(false);
  const [visitorSaving, setVisitorSaving] = useState(false);
  const [visitingDate, setVisitingDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [bottomCard, setBottomCard] = useState(weekdays);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [weekDayListLength, setWeekDayListLength] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    validateForm();
  }, [firstName, lastName, contactNo, vehicleNo, visitingUnitData]);

  useEffect(() => {
    if (visitingWeekDays === '') {
      setWeekDayListLength(0);
      setVisitingFrequency('none');
    } else {
      setWeekDayListLength(visitingWeekDays.split(',').length);
    }
  }, [visitingWeekDays]);

  const navigateToBack = () => {
    navigation.goBack();
  };

  const saveVisitorData = async () => {
    try {
      setVisitorSaving(true);
      displayNotification(false, '');
      const formattedVisitingDateTime =
        visitingDate !== null ? moment(visitingDate) : null;

      const dataParams = {
        apartmentUnitId: visitingUnitData.apartment_unit_id,
        apartmentUnitRowId: visitingUnitData.apartment_unit_row_id,
        visitorFirstName: firstName,
        visitorLastName: lastName,
        visitorNic: nicPassport,
        visitorExpectedArrivalTime: formattedVisitingDateTime,
        visitorStatus: 'awaiting_arrival',
        contactNumber: `${
          contactNo.substr(0, 1) === '0'
            ? [0] + contactNo.substr(1)
            : [0] + contactNo
        }`,
        vehicleNumber: vehicleNo,
        additionalVisitorsCount: additionalVisitorCount,
        additionalNote: additionalNote,
        vistingFrequecy: visitingFrequency,
        visitingWeekDays: visitingWeekDays,
        visitingUnit: visitingUnitData.unit_name,
        complexId: selectedApartmentComplex.key,
        createdBy: loggedInUserData.user_id,
      };
      const saveVisitorData = await saveUserAddVisitor(dataParams);

      if (saveVisitorData.data.message == 'success') {
        visitorStatusChange(true);
        setReceivedSecurityCode(saveVisitorData.data.body.securityCode);
        displayNotification('success', 'Visitor Data Saved Successfully');
        let updatedVisitorsList = [...visitorsDataList];
        updatedVisitorsList.push(saveVisitorData.data.body);
        setMemberVisitorDataList(updatedVisitorsList);
      } else {
        displayNotification('error', 'Visitor Data Saving Failed');
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
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
        setVisitorSaving(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setVisitorSaving(false);
    }
  };

  const onChange = selectedDate => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setVisitingDate(currentDate);
  };

  const onChangeAndroidHandler = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    if (mode === 'date') {
      setShow(false);
      setDate(currentDate);
      showTimepicker();
    }
    if (selectedDate === undefined) {
      setShow(false);
    } else {
      if (moment(selectedDate).isBefore(new Date())) {
        setErrorMessage('Enter a valid date and a time');
        setShow(false);
      } else {
        setErrorMessage(null);
        setShow(false);
        setVisitingFrequency('none');
        setDate(currentDate);
        setVisitingDate(currentDate);
      }
    }
  };

  const showMode = async currentMode => {
    await setMode(currentMode);
    setShow(true);
  };
  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };

  const unitHandler = unit => {
    setVisitingUnitData(unit);
  };

  const validateForm = () => {
    let validation = false;
    if (firstName != '' && contactNo != '' && visitingUnitData) {
      validation = true;
    }
    setEnableAddVisitorButton(validation);
  };

  const popup = async () => {
    setOpenBottomSheetOne(true);
  };
  const onClose = () => {
    visibilityHandler(false);
    visibilityHandlerOne(false);
  };

  const checkWeekDay = day => {
    const updatedWeekDays = bottomCard.map(item => {
      if (item.weekDaysName === day) {
        let updatedItem = {
          ...item,
          checked: !item.checked,
        };
        return updatedItem;
      }
      return item;
    });
    setBottomCard(updatedWeekDays);
  };

  const proceedWeekDays = () => {
    const processingDays = bottomCard
      .filter(item => item.checked === true)
      .map(item => {
        return item.weekDaysName;
      });
    setVisitingWeekDays(processingDays.toString());
    setVisitingDate(null);
    setOpenBottomSheetOne(false);
  };

  const clearWeekDays = () => {
    const updatedWeekDays = bottomCard.map(item => {
      let updatedItem = {
        ...item,
        checked: false,
      };
      return updatedItem;
    });

    setBottomCard(updatedWeekDays);
    setVisitingWeekDays('');
    setOpenBottomSheetOne(false);
  };

  const renderInner = () => (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
      }}>
      <View style={styles.mainBottomSheetContainer}>
        <Text style={styles.mainTitleBottomSheet}>Repeat Weekly</Text>
        <Text style={styles.secondMainTitleBottomSheet}>
          Select the days on which the visitor will repeat
        </Text>
        {bottomCard.map((item, i) => (
          <View style={styles.weekContainer}>
            {i < 6 ? (
              <View style={styles.lineBreak}>
                <TouchableOpacity
                  style={styles.checkBoxContainer}
                  onPress={() => checkWeekDay(item.weekDaysName)}>
                  <Text style={styles.weekDaysName}>{item.weekDaysName}</Text>
                  <TouchableOpacity
                    style={styles.tickBox}
                    onPress={() => checkWeekDay(item.weekDaysName)}>
                    {item.checked ? <TickBoxIconBlue /> : <TickBoxIconGray />}
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.lineBreakFinal}>
                <TouchableOpacity
                  style={styles.checkBoxContainer}
                  onPress={() => checkWeekDay(item.weekDaysName)}>
                  <Text style={styles.weekDaysName}>{item.weekDaysName}</Text>
                  <TouchableOpacity
                    style={styles.tickBox}
                    onPress={() => checkWeekDay(item.weekDaysName)}>
                    {item.checked ? <TickBoxIconBlue /> : <TickBoxIconGray />}
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {
              clearWeekDays();
            }}
            style={styles.cancelButtonContainer}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.proceedButtonContainer}
            onPress={() => proceedWeekDays()}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const visibilityHandlerOne = status => {
    setOpenBottomSheetOne(status);
  };

  const dailyVisitorChange = () => {
    setVisitingDate(null);
    setVisitingFrequency('daily');
    setVisitingWeekDays('Everyday');
  };

  const visitingDateHandler = () => {
    if (visitingWeekDays !== 'Every day' && visitingWeekDays !== '') {
      valuesAssignToWeekPopup();
      setVisitingFrequency('weekly');
      popup();
    } else {
      return false;
    }
  };

  const keyboardDissmissHandler = () => {
    setShow(false);
    Keyboard.dismiss();
  };

  const valuesAssignToWeekPopup = () => {
    const savedDaylist = weekdays.map(item => {
      if (visitingWeekDays.includes(item.weekDaysName)) {
        return {
          ...item,
          checked: true,
        };
      }
      return {
        ...item,
      };
    });
    setBottomCard(savedDaylist);
  };
  const onCalenderIconHandler = () => {
    if (Platform.OS === 'ios') {
      setVisitingFrequency('none');
      setTimeout(() => {
        datepickerRef.current.onPressDate();
      }, 500);
      onClose();
    } else {
      showDatepicker();
    }
  };
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Add Visitor"
      subTitle="Add frequent or one-time visitors"
      keyboardDissmissHandler={keyboardDissmissHandler}
      changeUnitState={false}
      formContainer={true}>
      <TopCardContainer>
        {/* ---- In Bug Bash ---- */}
        {/* <View style={styles.cardHeaderView}>
          <TouchableOpacity style={styles.courierCardView}>
            <ContactIcon style={styles.ContactIcon} />
            <Text style={styles.ViewCourierText}>Add from Contacts</Text>
          </TouchableOpacity>
        </View> */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={130}
          extraScrollHeight={50}
          keyboardOpeningTime={0}>
          <View style={styles.scroll} onStartShouldSetResponder={() => true}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={{flex: 1}}>
              <View style={styles.formMainContainer}>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="First Name *"
                    value={firstName}
                    onChangeText={text => {
                      setFirstName(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownTextContainer}
                    placeholderTextColor="#9B9B9B"
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="Last Name (Optional)"
                    value={lastName}
                    onChangeText={text => {
                      setLastName(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownTextContainer}
                    placeholderTextColor="#9B9B9B"
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="NIC / Passport (Optional)"
                    value={nicPassport}
                    onChangeText={text => {
                      setNicPassport(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                    style={styles.dropdownTextContainer}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="(+94) Contact No. *"
                    value={contactNo}
                    maxLength={contactNo.substr(0, 1) === '0' ? 10 : 9}
                    onChangeText={text => {
                      setContactNo(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownTextContainer}
                    placeholderTextColor="#9B9B9B"
                    keyboardType="phone-pad"
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                  />
                </View>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="Vehicle No "
                    value={vehicleNo}
                    onChangeText={text => {
                      setVehicleNo(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                    style={styles.dropdownTextContainer}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
                <View style={styles.formContainerVisitor}>
                  <Text style={styles.dropdownText}>
                    Additional Visitor Count *
                  </Text>
                  <View style={styles.visitorCountDropDown}>
                    <Input
                      keyboardType="numeric"
                      value={additionalVisitorCount}
                      onChangeText={text => {
                        setAdditionalVisitorCount(text);
                      }}
                      inputStyle={styles.inputFieldAdditionalVisitorCount}
                      inputContainerStyle={styles.visitorCountView}
                      onFocus={() => {
                        setEnableShift(true);
                        onClose();
                      }}
                    />
                  </View>
                </View>
                <View style={styles.formContainerVisitorUnit}>
                  <Text style={styles.dropdownText}>Visiting Unit *</Text>
                  <TouchableOpacity
                    style={styles.visitorUnitDropDown}
                    onPress={() => {
                      Keyboard.dismiss();
                      setVisibleBottomSheet(true);
                    }}>
                    <View style={styles.visitorUnitDropDownContainer}>
                      <Text style={styles.visitorUnitDropText}>
                        {visitingUnitData != null
                          ? visitingUnitData.unit_name
                          : ''}
                      </Text>
                      {visibleBottomSheet ? (
                        <UpIcon height={10} width={10} />
                      ) : (
                        <DownIcon height={10} width={10} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.formContainerDateView}>
                  <Text style={styles.dropdownText}>
                    Provide Visiting Dates and Times *
                  </Text>
                  <View style={styles.calenderContainer}>
                    <View style={styles.dateIconView}>
                      <TouchableOpacity onPress={onCalenderIconHandler}>
                        <MaterialIcon
                          name="calendar-today"
                          size={24}
                          color="#0E9CC9"
                          style={styles.calendarIcon}
                        />
                      </TouchableOpacity>
                      <View style={styles.textInputNameMainDateNew}>
                        {visitingFrequency === 'none' &&
                        Platform.OS === 'ios' ? (
                          <DatePicker
                            style={{
                              width: '100%',
                              flexDirection: 'column',
                            }}
                            date={date}
                            ref={datepickerRef}
                            mode="datetime"
                            androidMode="spinner"
                            showIcon={false}
                            format="LLLL"
                            minDate={new Date()}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateTouchBody: {height: 30},
                              dateInput: {
                                width: '100%',
                                height: 30,
                                borderWidth: 0,
                                justifyContent: 'flex-end',
                                alignItems: 'baseline',
                              },
                              datePicker: {
                                backgroundColor: '#d1d3d8',
                                justifyContent: 'center',
                                height: 30,
                              },
                              datePickerCon: {
                                paddingTop: 80,
                              },
                              dateText: {
                                fontFamily: 'Roboto-Medium',
                                color: '#212322',
                                fontSize: 16,
                                lineHeight: 18,
                              },
                              btnTextConfirm: {
                                color: '#26272C',
                                fontFamily: 'Roboto-Medium',
                                fontSize: 18,
                              },
                              btnTextCancel: {
                                color: '#26272C',
                                fontFamily: 'Roboto-Regular',
                                fontSize: 18,
                              },
                            }}
                            onDateChange={onChange}
                          />
                        ) : (
                          <TouchableOpacity
                            style={styles.textInputNameNew}
                            onPress={() => showDatepicker()}>
                            <Input
                              style={styles.textInputNameNew}
                              inputContainerStyle={{borderBottomWidth: 0}}
                              renderErrorMessage={false}
                              errorStyle={{color: 'red'}}
                              errorMessage={
                                errorMessage && 'ENTER A VALID DATE TIME'
                              }
                              underlineColorAndroid="transparent"
                              placeholder="Select Date"
                              value={
                                visitingDate !== null
                                  ? moment(visitingDate).format('LLL')
                                  : weekDayListLength > 2
                                  ? visitingWeekDays.split(',')[0] +
                                    ',' +
                                    visitingWeekDays.split(',')[1] +
                                    '...'
                                  : weekDayListLength > 0
                                  ? visitingWeekDays
                                  : weekDayListLength === 0
                                  ? moment().format('LLL')
                                  : moment().format('LLL')
                              }
                              editable={false}
                              disabledInputStyle={{
                                color: '#212322',
                                opacity: 1,
                              }}
                              onFocus={onClose}
                            />
                          </TouchableOpacity>
                        )}

                        {weekDayListLength > 2 && (
                          <TouchableOpacity
                            onPress={() => visitingDateHandler()}>
                            <Text style={styles.viewText}>View All</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.repeatText}>or repeat visitor by,</Text>
                </View>

                <View style={styles.dilyWeeklyBtn}>
                  <TouchableOpacity
                    style={
                      visitingFrequency == 'daily'
                        ? styles.dilyCardViewsActive
                        : styles.dilyCardViews
                    }
                    onPress={() => {
                      dailyVisitorChange();
                    }}>
                    <Text style={styles.ViewdilyWeeklyTexts}>Daily</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      visitingFrequency == 'weekly'
                        ? styles.weeklyCardViewsActive
                        : styles.weeklyCardViews
                    }
                    onPress={() => {
                      setVisitingFrequency('weekly');
                      popup('weekly');
                    }}>
                    <Text style={styles.ViewdilyWeeklyTexts}>Weekly</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.subTextContainer}>
                  <Text style={styles.textContainerBottom}>
                    Your visitor will get added to enter premises on
                    {visitingWeekDays !== ''
                      ? ' ' + visitingWeekDays
                      : ' selected date'}
                    .
                  </Text>
                </View>
                <View style={styles.formContainer}>
                  <Input
                    placeholder="Additional Notes"
                    value={additionalNote}
                    onChangeText={text => {
                      setAdditionalNote(text != '' ? text : '');
                    }}
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownTextContainer}
                    onFocus={() => {
                      setEnableShift(true);
                      onClose();
                    }}
                    placeholderTextColor="#9B9B9B"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.buttonView}>
          <TouchableOpacity
            disabled={!enableAddVisitorButton || visitorSaving}
            style={
              enableAddVisitorButton
                ? styles.buttonMainView
                : styles.buttonMainViewDisabled
            }
            onPress={saveVisitorData}>
            <Text style={styles.visitortText}>Add Visitor</Text>
          </TouchableOpacity>
        </View>
      </TopCardContainer>
      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
          bottomSheetHeight={[250, 300, 0]}
        />
      )}
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      {openBottomSheetOne === true ? (
        <BottomSheet
          onVisible={openBottomSheetOne}
          visibilityHandler={visibilityHandlerOne}
          children={renderInner}
          height={[525, 0]}
        />
      ) : null}
      {show ? (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={false}
          display="spinner"
          minimumDate={new Date()}
          onChange={onChangeAndroidHandler}
        />
      ) : null}
      <LoadingDialogue visible={visitorSaving} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  buttonMainView: {
    width: width * 0.87,
    height: height * 0.08,
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMainViewDisabled: {
    width: width * 0.85,
    height: height * 0.08,
    backgroundColor: '#96BAC6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
  },
  cardHeaderView: {
    alignItems: 'center',
  },
  visitortText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  courierCardView: {
    flexDirection: 'row',
    width: width * 0.85,
    height: height * 0.08,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  ViewCourierText: {
    color: '#197B9A',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
  },
  inputFieldAdditionalVisitorCount: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
    textAlign: 'center',
  },
  inputFieldContainer: {
    width: width * 0.79,
    height: 23,
    marginTop: height * 0.04,
    borderColor: '#C8C8C8',
  },

  ContactIcon: {
    marginRight: height * 0.02,
  },
  dropdownText: {
    fontSize: 16,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Bold',
  },

  repeatText: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    color: '#9B9B9B',
    marginTop: height * 0.02,
  },
  dilyWeeklyBtn: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dilyCardViews: {
    width: width * 0.4,
    height: height * 0.065,
    backgroundColor: '#F5F5F5',
    color: '#C8C8C8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  dilyCardViewsActive: {
    width: width * 0.4,
    height: height * 0.065,
    backgroundColor: '#197B9A',
    color: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  weeklyCardViews: {
    width: width * 0.4,
    height: height * 0.065,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  weeklyCardViewsActive: {
    width: width * 0.4,
    height: height * 0.065,
    backgroundColor: '#197B9A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: height * 0.01,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  ViewdilyWeeklyTexts: {
    color: '#C8C8C8',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  visitorCountDropDown: {
    width: width * 0.23,
    height: 30,
    backgroundColor: '#E2E2E2',
    borderRadius: 7,
    alignItems: 'center',
    paddingVertical: height * 0.0,
    paddingHorizontal: width * 0.04,
  },

  visitorUnitDropDown: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    paddingHorizontal: width * 0.03,
    justifyContent: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
    marginTop: height * 0.02,
  },
  visitorUnitDropText: {
    fontSize: 16,
    color: '#212322',
    fontFamily: 'Roboto-Bold',
  },

  closeText: {
    fontSize: 16,
    color: '#0E9CC9',
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },

  scroll: {
    height: '100%',
  },
  mainBottomSheetContainer: {
    paddingHorizontal: height * 0.02,
    marginTop: height * 0.02,
  },
  mainTitleBottomSheet: {
    marginLeft: height * 0.03,
    marginTop: height * 0.02,
    fontSize: 26,
    fontFamily: 'Roboto-Bold',
    color: '#212322',
  },
  secondMainTitleBottomSheet: {
    fontSize: 12,
    lineHeight: 14,
    marginLeft: height * 0.03,
    color: '#89B2C4',
    fontFamily: 'Roboto-Bold',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  cancelButtonContainer: {
    width: 126,
    height: 52,
    backgroundColor: '#DBEAEF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  proceedButtonContainer: {
    width: 190,
    height: 52,
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  proceedText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  weekContainer: {
    alignItems: 'center',
  },
  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lineBreak: {
    width: width * 0.84,
    borderBottomWidth: 1,
    borderColor: '#C8C8C8',
    paddingVertical: 10,
  },
  lineBreakFinal: {
    width: width * 0.84,
    paddingVertical: 10,
  },
  weekDaysName: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#000000',
  },

  textContainerBottom: {
    fontSize: 11,
    fontFamily: 'Roboto-Bold',
    color: '#9B9B9B',
    marginTop: height * 0.02,
  },
  formContainerVisitor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.02,
    marginTop: height * 0.01,
  },
  formContainerVisitorUnit: {
    marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
  },
  dateIconView: {
    flexDirection: 'row',
    marginTop: height * 0.01,
    alignItems: 'center',
  },
  formContainerDateView: {
    marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
  },
  visitorCountView: {
    height: height * 0.03,
    width: width * 0.09,
    borderColor: '#F5F5F5',
  },
  calenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    color: '#004F71',
    textDecorationLine: 'underline',
  },
  calendarIcon: {
    marginTop: height * 0.01,
    marginRight: width * 0.02,
  },
  textInputNameMainDateNew: {
    flexDirection: 'row',
    width: width * 0.7,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    alignItems: 'center',
  },
  textInputNameNew: {
    fontFamily: 'Roboto-Bold',
    color: '#212322',
    fontSize: 16,
    width: '100%',
    marginTop: height * 0.01,
  },
  subTextContainer: {
    alignItems: 'center',
  },
  visitorUnitDropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownTextContainer: {
    fontSize: 16,
    color: '#212322',
    fontFamily: 'Roboto-Medium',
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnitInMain: state.apartmentState.selectedUnit,
  visitorListChange: state.visitorState.getVisitorChangeDetails,
  selectedApartmentComplex: state.apartmentState.seleletedApatment,
  visitorsDataList: state.memberVisitorState.visitorsDataList
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  visitorStatusChange: payload => dispatch(changeVisitorAction(payload)),
  setMemberVisitorDataList: (payload, callback) => dispatch(setVisitorDataListAction(payload, callback)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddVisitor);
