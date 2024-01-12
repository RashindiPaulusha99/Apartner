import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
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
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Input, CheckBox} from 'react-native-elements';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  updateVisitorData,
  getVisitorData,
  deleteVisitorData,
} from './services/Visitor-service';
import {Alert} from 'react-native';
import moment from 'moment';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {connect} from 'react-redux';
import BottomSheet from '../../components/containers/bottomSheet';
import SignUpBg from '../../assets/images/AddBg.png';
import ReceiptSubmittedIcon from '../../assets/images/ReceiptSubmittedIcon.svg';
import AsyncStorage from '@react-native-community/async-storage';
import {changeVisitorAction} from '../VisitorManager/actions/apartment-action';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import {weekdays} from '../../components/constants/weekdays';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MainContainer, TopCardContainer} from '../../components/';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import TickBoxIconBlue from '../../assets/icons/TickBoxIconBlue.svg';
import TickBoxIconGray from '../../assets/icons/TickBoxIconGray.svg';
import CheckCircle from '../../assets/icons/green-check-circle.svg';
import DatePicker from 'react-native-datepicker';

const {width, height} = Dimensions.get('window');

const ReinviteVisitor = ({
  navigation,
  apartmentUnitsList,
  loggedInUserData,
  selectedUnitInMain,
  visitorStatusChange,
  selectedApartmentComplex
}) => {
  let datepickerRef = useRef(null);
  const [show, setShow] = useState(false);
  const [enableShift, setEnableShift] = useState(false);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [nicPassport, setNicPassport] = useState(null);
  const [contactNo, setContactNo] = useState(null);
  const [visitingDate, setVisitingDate] = useState(null);
  const [vehicleNo, setVehicleNo] = useState(null);
  const [additionalNote, setAdditionalNote] = useState(null);
  const [additionalVisitorCounts, setAdditionalVisitorCounts] = useState(null);
  const [visitingUnitData, setVisitingUnitData] = useState(selectedUnitInMain);
  const [visitingFrequency, setVisitingFrequency] = useState('none');
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);

  const [openBottomSheetOne, setOpenBottomSheetOne] = useState(false);

  const [visitingWeekDays, setVisitingWeekDays] = useState('');
  const [visitorDataList, setVisitorDataList] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [enableSaveButton, setEnableSaveButton] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [bottomCard, setBottomCard] = useState(weekdays);
  const [isLoading, setIsLoading] = useState(false);
  const [weekDayListLength, setWeekDayListLength] = useState(0);
  useEffect(() => {
    initDataInPage();
  }, []);

  useEffect(() => {}, [visitingDate]);

  useEffect(() => {
    if (visitingWeekDays !== null) {
      if (visitingWeekDays === '') {
        setWeekDayListLength(0);
        setVisitingFrequency('none');
      } else {
        setWeekDayListLength(visitingWeekDays.split(',').length);
      }
    }
  }, [visitingWeekDays]);

  // get function
  const initDataInPage = async () => {
    setIsLoading(true);
    const visitorId = await AsyncStorage.getItem('selectedVisiorId');
    const dataParam = {visitors_id: visitorId};
    const getData = await getVisitorData(dataParam);
    const visitingFreq = getData.data[0].visiting_frequency;
    if (visitingFreq === 'none') {
      if (getData.data[0].visitors_status === 'arrived') {
        setVisitingDate(getData.data[0].recorded_date);
      } else {
        setVisitingDate(getData.data[0].visitors_expected_arrival_time);
      }
    }

    if (visitingUnitData === 0) {
      setVisitingUnitData({unit_name: getData.data[0].visiting_unit_name});
    }
    setVisitingFrequency(getData.data[0].visiting_frequency);
    setVisitorDataList(getData.data[0], 'get data ');
    setContactNo(`${getData.data[0].contact_no}`);
    setAdditionalVisitorCounts(`${getData.data[0].additional_visitor_count}`);
    setVisitingWeekDays(
      getData.data[0].visiting_frequency === 'weekly'
        ? getData.data[0].visiting_week_days
        : getData.data[0].visiting_frequency === 'daily'
        ? 'Every day'
        : '',
    );

    setIsLoading(false);
  };
  // update function
  const updateVisitorsData = async () => {
    displayNotification(false, '');
    setIsLoading(true);
    try {
      const savedata = {
        visitors_id: visitorDataList.apartment_visitors_id,
        first_name:
          firstName != null ? firstName : visitorDataList.visiter_first_name,
        last_name:
          lastName != null ? lastName : visitorDataList.visiter_last_name,
        visitor_nic:
          nicPassport != null ? nicPassport : visitorDataList.visitor_nic,
        contact_no:
          contactNo != null ? contactNo : `${visitorDataList.contact_no}`,
        vehicle_no: vehicleNo != null ? vehicleNo : visitorDataList.vehicle_no,
        additional_visitor_count:
          additionalVisitorCounts != null
            ? additionalVisitorCounts
            : `${visitorDataList.additional_visitor_count}`,
        visiting_unit_id: visitingUnitData.apartment_unit_id,
        visiting_unit_row_id: visitingUnitData.apartment_unit_row_id,
        visiting_date:
          visitingDate != null ? visitingDate : visitorDataList.visiting_date,
        visiting_week_days:
          visitingWeekDays != null
            ? visitingWeekDays
            : visitorDataList.visiting_week_days,
        visiting_frequency:
          visitingFrequency != null
            ? visitingFrequency
            : visitorDataList.visiting_frequency,
        additional_note:
          additionalNote != null
            ? additionalNote
            : visitorDataList.additional_note,
        apartment_visitors_row_id: visitorDataList.apartment_visitors_row_id,
        visitorType: 'Reinvite',
        complexId : selectedApartmentComplex.key,
        updatedBy : loggedInUserData.user_id
      };
      const saveupdateVisitorData = await updateVisitorData(savedata);
      if (saveupdateVisitorData.data.message == 'success') {
        visitorStatusChange(true);
        setVisitorDataList(false);
        displayNotification('success', 'Visitor updated Successfully');
      } else {
        displayNotification('error', 'Visitor Update Failed');
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
        setIsLoading(false);
        navigation.navigate('VisitorManager', {
          open: 'visitor',
        });
      }, 2000);
    } else if (type == 'error') {
      setIsLoading(false);
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };

  const unitHandler = unit => {
    setVisitingUnitData(unit);
  };
  const dailyVisitorChange = () => {
    setEnableSaveButton(false);
    setVisitingFrequency('daily');
    setVisitingDate(null);
    setVisitingWeekDays('Every Day');
  };

  const onChange = (event, selectedDate) => {
    setEnableSaveButton(false);
    const currentDate = selectedDate || date;
    setVisitingFrequency('none');
    setDate(currentDate);
    setVisitingDate(currentDate);
  };
  const onChangeAndroidHandler = (e, selectedDate) => {
    setEnableSaveButton(false);
    const currentDate = selectedDate || date;
    if (mode === 'date') {
      setShow(false);
      setDate(currentDate);
      showTimepicker();
    }
    if (mode === 'time') {
      if (selectedDate === undefined) {
        setShow(false);
      } else {
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

  // add repeat weekly bottomsheet
  const popup = async () => {
    setOpenBottomSheetOne(true);
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
    setEnableSaveButton(false);
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
                <View style={styles.checkBoxContainer}>
                  <Text style={styles.weekDaysName}>{item.weekDaysName}</Text>
                  <TouchableOpacity
                    style={styles.tickBox}
                    onPress={() => checkWeekDay(item.weekDaysName)}>
                    {item.checked ? <TickBoxIconBlue /> : <TickBoxIconGray />}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.lineBreakFinal}>
                <View style={styles.checkBoxContainer}>
                  <Text style={styles.weekDaysName}>{item.weekDaysName}</Text>
                  <TouchableOpacity
                    style={styles.tickBox}
                    onPress={() => checkWeekDay(item.weekDaysName)}>
                    {item.checked ? <TickBoxIconBlue /> : <TickBoxIconGray />}
                  </TouchableOpacity>
                </View>
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
  const onClose = () => {
    visibilityHandler(false);
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

  const keyboardDissmissHandler = () => {
    onClose();
    setShow(false);
    Keyboard.dismiss();
  };

  const calendarIconChange = () => {
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
  const multipleWeeklyDataHandler = () => {
    if (visitingWeekDays !== 'Every day' && visitingWeekDays !== '') {
      valuesAssignToWeekPopup();
      setVisitingFrequency('weekly');
      popup();
    } else {
      return false;
    }
  };
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Reinvite Visitor"
      subTitle=" View Visitor Details"
      keyboardDissmissHandler={keyboardDissmissHandler}
      changeUnitState={false}
      formContainer={true}>
      <TopCardContainer customStyle={styles.bottomRowContainer}>
        <View style={styles.scroll} onStartShouldSetResponder={() => true}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              behavior="position"
              enabled={enableShift}
              keyboardVerticalOffset={Platform.select({
                ios: () => height * 0.2,
                android: () => -height * 0.4,
              })()}>
              <TouchableWithoutFeedback onPress={onClose}>
                <View>
                  <Input
                    labelStyle={styles.inputLabel}
                    label="First Name *"
                    value={
                      firstName != null
                        ? firstName
                        : visitorDataList.visiter_first_name
                    }
                    onChangeText={text => {
                      setFirstName(text);
                    }}
                    inputStyle={styles.inputField}
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                    inputContainerStyle={styles.inputFieldContainer}
                  />
                  <Input
                    labelStyle={styles.inputLabel}
                    label="Last Name"
                    value={
                      lastName != null
                        ? lastName
                        : visitorDataList.visiter_last_name
                    }
                    onChangeText={text => {
                      setLastName(text);
                    }}
                    inputStyle={styles.inputField}
                    onFocus={() => {
                      setEnableShift(false);
                      onClose();
                    }}
                    inputContainerStyle={styles.inputFieldContainer}
                  />
                  <Input
                    labelStyle={styles.inputLabel}
                    label="NIC / Passport (Optional)"
                    value={
                      nicPassport != null
                        ? nicPassport
                        : visitorDataList.apartment_visitors_nic
                    }
                    onChangeText={text => {
                      setNicPassport(text);
                    }}
                    inputStyle={styles.inputField}
                    onFocus={() => {
                      setEnableShift(true);
                      onClose();
                    }}
                    inputContainerStyle={styles.inputFieldContainer}
                  />
                  <Input
                    labelStyle={styles.inputLabel}
                    label="Contact No. *"
                    value={
                      contactNo != null ? contactNo : visitorDataList.contact_no
                    }
                    onChangeText={text => {
                      setContactNo(text);
                    }}
                    inputStyle={styles.inputField}
                    onFocus={() => {
                      setEnableShift(true);
                      onClose();
                    }}
                    inputContainerStyle={styles.inputFieldContainer}
                    keyboardType="phone-pad"
                  />
                  <Input
                    labelStyle={styles.inputLabel}
                    label="Vehicle No."
                    value={
                      vehicleNo != null ? vehicleNo : visitorDataList.vehicle_no
                    }
                    onChangeText={text => {
                      setVehicleNo(text);
                    }}
                    inputStyle={styles.inputField}
                    onFocus={() => {
                      setEnableShift(true);
                      onClose();
                    }}
                    inputContainerStyle={styles.inputFieldContainer}
                  />
                  <View style={styles.formContainerVisitor}>
                    <Text style={styles.dropdownText}>
                      Additional Visitor Count *
                    </Text>
                    <View style={styles.visitorCountDropDown}>
                      <Input
                        keyboardType="numeric"
                        value={
                          additionalVisitorCounts != null
                            ? additionalVisitorCounts
                            : ''
                        }
                        onChangeText={text => {
                          setAdditionalVisitorCounts(text);
                        }}
                        inputStyle={styles.inputField}
                        inputContainerStyle={
                          styles.additionalVisitorInputFieldContainer
                        }
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
                      <Text style={styles.visitorUnitDropText}>
                        {visitingUnitData ? visitingUnitData.unit_name : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formContainerDateView}>
                    <Text style={styles.visitingDateTitle}>
                      Visiting Dates *
                    </Text>
                    <View style={styles.calenderContainer}>
                      <TouchableOpacity onPress={() => calendarIconChange()}>
                        <MaterialIcon name="calendar-today" size={24} color="#0E9CC9" style={styles.calendarIcon}/>
                      </TouchableOpacity>
                      <View style={styles.textInputNameMainDateNew}>
                        {visitingFrequency === 'none' &&
                        Platform.OS === 'ios' ? (
                          <DatePicker
                            style={{
                              width: '100%',
                              flexDirection: 'column',
                            }}
                            date={visitingDate != null && moment(visitingDate)}
                            ref={datepickerRef}
                            mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
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
                          <TouchableOpacity  style={styles.textInputNameNew} onPress={() => showDatepicker()}>
                          <TextInput
                            style={styles.textInputNameNew}
                            underlineColorAndroid='transparent'
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
                        {visitingFrequency !== 'none' && weekDayListLength > 2 && (
                          <TouchableOpacity
                            onPress={() => multipleWeeklyDataHandler()}>
                            <Text style={styles.viewText}>View All</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <Text style={styles.repeatText}>or repeat visitor by,</Text>
                  </View>
                  <View style={styles.dilyWeeklyMainContainer}>
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
                    <Text style={styles.textContainerBottom}>
                      Your visitor will get added to enter premises on
                      {visitingWeekDays !== ''
                        ? ' ' + visitingWeekDays
                        : ' selected date'}
                      .
                    </Text>
                  </View>
                  <View style={styles.formContainerAdditionalNote}>
                    <Input
                      labelStyle={styles.inputLabel}
                      label="Additional Notes"
                      value={
                        additionalNote != null
                          ? additionalNote
                          : visitorDataList.additional_note
                      }
                      onChangeText={text => {
                        setAdditionalNote(text);
                      }}
                      inputStyle={styles.inputField}
                      inputContainerStyle={styles.inputFieldContainer}
                      onFocus={() => {
                        setEnableShift(true);
                        onClose();
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <View style={styles.buttomView}>
          <View style={styles.saveRemoveBtn}>
            <TouchableOpacity
              disabled={enableSaveButton}
              style={
                enableSaveButton === true
                  ? styles.reinviteBtnDisabled
                  : styles.reinviteBtn
              }
              onPress={updateVisitorsData}>
              <Text style={styles.saveTexts}>Reinvite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TopCardContainer>

      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
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

      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
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
      <LoadingDialogue visible={isLoading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  continueBtn: {
    alignItems: 'center',
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  bottomRowContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    height: height * 0.87,
  },
  scroll: {
    height: height * 0.74,
  },
  formContainer: {
    flexDirection: 'row',
  },
  buttonMainView: {
    width: 336,
    height: 51,
    backgroundColor: '#197B9A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMainViewDisabled: {
    width: 336,
    height: 51,
    backgroundColor: '#777b7d',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
    flex: 1,
  },
  visitortText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },

  formMainContainer: {
    flexDirection: 'row',
  },
  inputField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212322',
  },
  inputFieldContainer: {
    width: width * 0.79,
    height: 23,
    marginTop: height * 0.04,
    borderColor: '#9B9B9B',
  },
  additionalVisitorInputFieldContainer: {
    height: height * 0.03,
    width: width * 0.09,
    borderColor: '#F5F5F5',
  },
  formContainerVisitorUnit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.03,
    marginTop: height * 0.02,
  },
  ContactIcon: {
    marginRight: height * 0.02,
  },
  dropdownText: {
    fontSize: 12,
    color: '#9B9B9B',
    fontFamily: 'Poppins-Medium',
  },
  visitingDateTitle: {
    fontSize: 12,
    color: '#9B9B9B',
    fontFamily: 'Poppins-Medium',
  },
  selectDateField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C8C8C8',
    marginBottom: height * 0.05,
  },
  selectDateFieldContainer: {
    borderColor: '#9B9B9B',
  },
  calendarIcon: {
    marginTop: height * 0.01,
    marginRight: width * 0.02,
  },
  repeatText: {
    fontSize: 11,
    color: '#9B9B9B',
    fontFamily: 'Poppins-Regular',
  },
  dilyWeeklyBtn: {
    flexDirection: 'row',
    marginTop: height * 0.01,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dilyWeeklyMainContainer: {
    marginHorizontal: width * 0.03,
  },
  dilyCardViews: {
    width: width * 0.38,
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
    width: width * 0.38,
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
    width: width * 0.38,
    height: height * 0.065,
    backgroundColor: '#F5F5F5',
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
  weeklyCardViewsActive: {
    width: width * 0.38,
    height: height * 0.065,
    backgroundColor: '#197B9A',
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
  ViewdilyWeeklyTexts: {
    color: '#C8C8C8',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  textContainerBottom: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    color: '#9B9B9B',
    marginTop: height * 0.02,
  },
  formContainerAdditionalNote: {
    flexDirection: 'row',
    marginTop: height * 0.02,
  },
  formContainerVisitor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.03,
    marginTop: height * 0.01,
  },
  visitorCountDropDown: {
    width: width * 0.23,
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    alignItems: 'center',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
  },

  visitorUnitDropDown: {
    width: width * 0.23,
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  visitorUnitDropText: {
    fontSize: 10,
    color: '#212322',
    fontFamily: 'Poppins-Bold',
  },
  formContainerDateView: {
    marginHorizontal: width * 0.03,
    marginTop: height * 0.02,
  },

  receiptSubmittedContainer: {
    flex: 1,
  },
  ReceiptSubmittedIcon: {
    marginTop: height * 0.02,
  },
  ReceiptSubmittedIconContainer: {
    alignItems: 'center',
  },
  ReceiptSubmittedText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4D4D4D',
  },
  otpText: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4D4D4D',
  },
  secondTextContainer: {
    marginTop: height * 0.03,
  },
  closeButtonContainer: {
    backgroundColor: '#C8C8C8',
    borderColor: '#707070',
    width: 150,
    height: 52,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  shareButtonContainer: {
    backgroundColor: '#197B9A',
    borderColor: '#707070',
    width: 150,
    height: 52,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#4D4D4D',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttomView: {
    alignItems: 'center',
  },
  saveRemoveBtn: {
    flexDirection: 'row',
    marginTop: height * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    width: width * 0.3,
    height: height * 0.07,
    backgroundColor: '#F23B4E',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reinviteBtn: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#197B9A',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reinviteBtnDisabled: {
    width: '100%',
    height: height * 0.07,
    backgroundColor: '#96BAC6',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTexts: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  saveTexts: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    color: '#9B9B9B',
    fontSize: 12,
  },
  cancelButtonContainer: {
    width: 126,
    height: 52,
    backgroundColor: '#C8C8C8',
    borderRadius: 12,
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
  proceedButtonContainer: {
    width: 190,
    height: 52,
    backgroundColor: '#197B9A',
    borderRadius: 12,
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
    fontWeight: 'bold',
  },
  mainBottomSheetContainer: {
    paddingHorizontal: height * 0.02,
    marginTop: height * 0.02,
  },
  mainTitleBottomSheet: {
    marginLeft: height * 0.03,
    marginTop: height * 0.02,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212322',
  },
  secondMainTitleBottomSheet: {
    marginLeft: height * 0.03,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9B9B9B',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  calenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputNameMainDateNew: {
    flexDirection: 'row',
    width: width * 0.7,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    alignItems: 'center',
  },
  textInputNameNew: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    width: '100%',
    marginTop: height * 0.01,
  },
  viewText: {
    color: '#004F71',
    textDecorationLine: 'underline',
  },
  weekContainer: {
    alignItems: 'center',
  },
  weekDaysName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
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
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnitInMain: state.apartmentState.selectedUnit,
  visitorListChange: state.visitorState.getVisitorChangeDetails,
  selectedApartmentComplex: state.apartmentState.seleletedApatment,
});
const mapDispatchToProps = dispatch => ({
  visitorStatusChange: payload => dispatch(changeVisitorAction(payload)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReinviteVisitor);
