import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';

import {Calendar} from 'react-native-calendars';
import {connect} from 'react-redux';
import {Input} from 'react-native-elements';
import CalenderIcon from '../../assets/images/calendarIcon.svg';
import DatePicker from '../../components/containers/datepicker';
import DocumentPicker from 'react-native-document-picker';
import BottomSheet from '../../components/containers/bottomSheet';
import {callPaymentConfirmationApi} from './services/paymentVerification-service';
import {MainContainer} from '../../components/';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {
  getUnitUpdatesAction,
  changeUnitUpdatesAction,
} from '../Home/actions/home-action';

const {width, height} = Dimensions.get('window');

const PaymentVerification = ({
  navigation,
  selectedDueInvoice,
  selectedApartmentData,
  loggedInUserData,
  getUnitUpdatesProps,
  selectedUnitState,
  unitUpdatesSuccess,
  unitUpdatesChange,
}) => {
  const [show, setShow] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );

  const [totalPaid, setTotalPaid] = useState(selectedDueInvoice.amount);
  const [dateOfPayment, setDateOfPayment] = useState(new moment());
  const [markCalendarDate, setMarkCalendarDate] = useState({
    [moment().format('YYYY-MM-DD')]: {selected: true, selectedColor: '#197B9A'},
  });
  const [paymentSlip, setPaymentSlip] = useState({});
  const [referenceNote, setReferenceNote] = useState('');
  const [openCalendarBottomSheet, setOpenCalendarBottomSheet] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    unitUpdatesChange(false);
  }, []);
  const navigateToBack = () => {
    navigation.navigate('Home');
  };

  const dateOfPaymentOnChange = date => {
    setDateOfPayment(new moment(date));
  };

  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);
    if (type == 'success') {
      setTimeout(() => {
        setLoadingPage(false);
        navigation.navigate('Home');
      }, 2000);
    } else if (type == 'error') {
      setLoadingPage(false);
    }
  };

  const savePaymentConfirmation = async (throughPaymentGateway = false) => {
    displayNotification(false, '');
    setLoadingPage(true);
    try {
      const data = new FormData();
      data.append('totalPaid', totalPaid);
      data.append('dateOfPayment', dateOfPayment.format('YYYY-MM-DD'));
      data.append('referenceNote', referenceNote);
      data.append('paidBy', loggedInUserData.user_id);
      data.append(
        'invoiceId',
        selectedDueInvoice.invoiceId ? selectedDueInvoice.invoiceId : null,
      );
      data.append(
        'invoiceRowId',
        selectedDueInvoice.invoiceRowId
          ? selectedDueInvoice.invoiceRowId
          : null,
      );
      data.append('paymentType', selectedDueInvoice.type);
      data.append('createdBy', loggedInUserData.user_id);
      if (typeof paymentSlip.uri !== 'undefined') {
        data.append('payment_slip', paymentSlip);
      }
      if (throughPaymentGateway) {
        data.append('paymentGateway', true);
      }
      data.append('unitId', selectedDueInvoice.unitId);
      data.append('complexId', selectedApartmentData.key);
      data.append('userId', loggedInUserData.user_id);
      const response = await callPaymentConfirmationApi(data);
      if (response.data.message == 'success') {
        // getUnitUpdatesProps(
        //   {
        //     unitId: selectedUnitState.apartment_unit_id,
        //     userId: loggedInUserData.user_id,
        //     complexId: selectedApartmentData.key,
        //   },
        //   () => {
        unitUpdatesChange(true);
        displayNotification('success', 'Receipt Submitted');

        // );
      } else {
        displayNotification('error', 'Receipt Submission Failed');
      }
    } catch (error) {
      displayNotification('error', 'Error occurred');
    }
  };

  const uploadPaymentSlip = async () => {
    try {
      const fileData = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setPaymentSlip(fileData);
    } catch (error) {}
  };

  const visibilityCalendarBottomSheet = status => {
    setOpenCalendarBottomSheet(status);
  };

  const renderInnerCalender = () => (
    <View style={styles.mainCalanderContainer}>
      <View>
        <View style={styles.mainBottomSheetContainer}>
          <Text style={styles.mainTitleBottomSheet}>
            Select The Date of Payment
          </Text>
        </View>
        <Calendar
          onDayPress={day => {
            setDateOfPayment(new moment(day.timestamp));
            setMarkCalendarDate({
              [day.dateString]: {selected: true, selectedColor: '#197B9A'},
            });
          }}
          markingType={'custom'}
          markedDates={markCalendarDate}
        />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => {
            setOpenCalendarBottomSheet(false);
          }}
          style={styles.cancelButtonContainer}>
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOpenCalendarBottomSheet(false);
          }}
          style={styles.proceedButtonContainer}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Payment Verification"
      subTitle=" Send your complaints to Management Council"
      changeUnitState={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => height * 0.2,
          android: () => -height * 0.09,
        })()}>
        <View style={styles.mainCardContainer}>
          <View style={styles.cardContainer}>
            <ScrollView>
              <View>
                <View style={styles.mainSecondCardContainer}>
                  <View style={styles.secondCardContainer}>
                    <Text style={styles.paymentSummary}>Payment Summary</Text>
                    <Text style={styles.type}>
                      Transaction Type :{' '}
                      {selectedDueInvoice.type == 'overdue-all'
                        ? 'Over Dues'
                        : 'My Dues'}
                    </Text>
                    <Text style={styles.Maintenance}>
                      {selectedDueInvoice.invoiceDueDate
                        ? `Maintenance (${selectedDueInvoice.unitName}, ${
                            selectedDueInvoice.invoiceDueDate
                          } - ${selectedDueInvoice.invoiceDueDate})`
                        : `Maintenance (${selectedDueInvoice.unitName})`}
                    </Text>
                    <Text style={styles.price}>
                      {selectedDueInvoice.amount} LKR
                    </Text>
                  </View>
                </View>

                <View style={styles.mainView}>
                  <View style={styles.formContainer}>
                    <View style={styles.formTextContainer}>
                      <Text style={styles.leftTextNames}>
                        Total Paid (LKR) <Text style={styles.redStar}>*</Text>
                      </Text>
                    </View>
                    <Input
                      disabled={true}
                      containerStyle={styles.containerStyle}
                      inputContainerStyle={styles.inputContainerField}
                      keyboardType="numeric"
                      value={totalPaid.toString()}
                      renderErrorMessage={false}
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <View style={styles.formTextContainer}>
                      <Text style={styles.leftTextNames}>
                        Date of Payment <Text style={styles.redStar}>*</Text>
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setOpenCalendarBottomSheet(true);
                      }}>
                      <CalenderIcon style={styles.celanderIcon} />
                    </TouchableOpacity>
                    <Input
                      containerStyle={styles.containerStyle}
                      inputContainerStyle={styles.inputContainerFieldTwo}
                      value={moment(dateOfPayment).format('DD-MM-YYYY')}
                      renderErrorMessage={false}
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <Text style={styles.leftTextNames}>
                      Payment Slip <Text style={styles.redStar}>*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={uploadPaymentSlip}
                      style={styles.uploadButton}>
                      <Text style={styles.uploadSlipText}>Upload Slip</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formContainer}>
                    <Input
                      placeholder="Reference Note"
                      containerStyle={styles.referenceNoteContainer}
                      inputStyle={styles.inputField}
                      inputContainerStyle={styles.referenceNote}
                      renderErrorMessage={false}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.continueBtn}>
              <TouchableOpacity
                disabled={totalPaid === 0 ? true : false}
                onPress={() => {
                  savePaymentConfirmation();
                }}
                style={styles.buttonContainer}>
                <View
                  style={
                    totalPaid === 0
                      ? styles.disableButtonContainer
                      : styles.btnTextContainer
                  }>
                  <Text style={styles.textContainer}>Bank Slip</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={totalPaid === 0 ? true : false}
                onPress={() => {
                  savePaymentConfirmation(true);
                }}
                style={styles.buttonContainer}>
                <View
                  style={
                    totalPaid === 0
                      ? styles.disableButtonContainer
                      : styles.btnTextContainer
                  }>
                  <Text style={styles.textContainer}>Pay Now</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showNotification && (
          <PopupTopNotification
            visible={showNotification}
            message={notificationDisplayMessage}
            navigation={navigation}
            type={showNotification}
          />
        )}

        <LoadingDialogue visible={loadingPage} />
      </KeyboardAvoidingView>
      <DatePicker
        setShow={setShow}
        show={show}
        date={dateOfPayment.toDate()}
        onChangeDate={dateOfPaymentOnChange}
      />
      {openCalendarBottomSheet && (
        <BottomSheet
          height={[450, 0]}
          onVisible={openCalendarBottomSheet}
          visibilityHandler={visibilityCalendarBottomSheet}
          children={renderInnerCalender}
        />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#197B9A',
    borderColor: '#004F71',
    width: width * 0.4,
    height: height * 0.07,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disableButtonContainer: {
    backgroundColor: '#4d5052',
    borderColor: '#004F71',
    width: width * 0.4,
    height: height * 0.07,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextContainer: {
    flexDirection: 'row',
  },

  textContainer: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    height: Platform.OS === 'ios' ? '93%' : '99%',
    width: '95%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'space-between',
    paddingVertical: height * 0.02,
  },
  mainCardContainer: {
    alignItems: 'center',
  },
  secondCardContainer: {
    width: width * 0.85,
    height: height * 0.3,
    backgroundColor: '#EEFAFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  mainSecondCardContainer: {
    alignItems: 'center',
  },
  paymentSummary: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
  },
  Maintenance: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
  },
  Utilities: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    marginLeft: width * 0.05,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    marginTop: height * 0.02,
    marginLeft: width * 0.05,
  },
  mainView: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  formTextContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
  redStar: {
    color: 'red',
  },
  leftTextNames: {
    color: '#9B9B9B',
    fontSize: 16,
  },
  containerStyle: {
    paddingHorizontal: 0,
  },
  inputContainerField: {
    width: '60%',
    height: 23,
    marginLeft: width * 0.02,
    borderColor: '#9B9B9B',
  },
  inputContainerFieldTwo: {
    width: '50%',
    height: 23,
    marginLeft: width * 0.01,
    borderColor: '#9B9B9B',
  },
  referenceNoteContainer: {
    paddingHorizontal: 0,
  },
  referenceNote: {
    width: '100%',
    height: 23,
    borderColor: '#9B9B9B',
  },
  inputField: {
    fontSize: 16,
  },
  uploadButton: {
    width: 138,
    height: 39,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginRight: '3%',

    justifyContent: 'center',
  },
  uploadSlipText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  celanderIcon: {
    marginLeft: width * 0.02,
  },
  closeText: {
    color: '#4D4D4D',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainCalanderContainer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: height * 0.03,
    justifyContent: 'space-between',
  },
  mainBottomSheetContainer: {
    alignItems: 'center',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    justifyContent: 'space-around',
  },

  mainTitleBottomSheet: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212322',
    fontFamily: 'Poppins',
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.07,
    justifyContent: 'space-between',
  },
  cancelButtonContainer: {
    width: 126,
    height: 52,
    backgroundColor: '#C8C8C8',
    borderRadius: 12,
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
    backgroundColor: '#197B9A',
    borderRadius: 12,
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
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },
});

const mapStateToProps = state => ({
  selectedDueInvoice: state.myDuesState.selectedDueInvoice,
  loggedInUserData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  selectedUnitState: state.apartmentState.selectedUnit,
});

const mapDispatchToProps = dispatch => ({
  getUnitUpdatesProps: payload => dispatch(getUnitUpdatesAction(payload)),
  unitUpdatesChange: (payload, callback) =>
    dispatch(changeUnitUpdatesAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PaymentVerification);
