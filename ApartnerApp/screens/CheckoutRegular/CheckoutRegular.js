import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import SignInSingUpContainer from '../../components/containers/SignInSingUpContainer';
// import {
//   saveMemberOfUnitApi
// } from "./services/unitTicket-services"

import HomeHeader from './components/homeHeader';
import {Button, Input} from 'react-native-elements';
import UserImage from '../../assets/images/dummy_user.svg';
import BankIcon from '../../assets/icons/bank.svg';
import CreditIcon from '../../assets/icons/credit-card.svg';
import VisaIcon from '../../assets/icons/visa-Icon.svg';
import CrossedPathIcon from '../../assets/icons/crossed-path.svg';
import ArrowBack from '../../assets/icons/arrow-right.svg';

import Content from './components/collapseContent';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import SnackBar from 'react-native-snackbar-component';
import NoticeBoard from '../Apartment/components/noticeBoard';

const {width, height} = Dimensions.get('window');
import {connect} from 'react-redux';

const facilityList = {
  key: '0',
  facilityType: 'Facility Reservation',
  facility: 'Swimming Pool - SP 1',
  time: '06.30 pm - 7.30 pm (60 mins)',
  headCount: '5 heads (2 Adults,3 Kids)',
};

import {saveUnitTicket} from './services/unitTicket-services';
const UnitTicket = ({navigation, loggedInUserData, unitsOfUser}) => {
  const [ticketType, setTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const [enableShift, setEnableShift] = useState(false);
  const [notificationDisplayState, setNotificationDisplayState] = useState(
    false,
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#182850" barStyle="light-content" />
        {/* <HomeHeader /> */}

        <View style={styles.subContainer}>
          <View style={styles.mainTitleContainer}>
            <TouchableOpacity>
              {/* //    onPress={() => unitChange(member)}> */}
              <View style={styles.buttonBack}>
                <ArrowBack />
              </View>
            </TouchableOpacity>
            <Text style={styles.checkoutHeader}>Checkout</Text>
          </View>
          <Text style={styles.checkoutDesc}>Review your booking & proceed</Text>

          <View style={styles.summaryContainer}>
            <Text style={styles.textSummaryTitle}>Booking Summary</Text>
            <Text style={styles.textSummaryTransaction}>
              Transaction Type : {facilityList.facilityType}
            </Text>
            <Text style={styles.textButtonCurrent}>
              {facilityList.facility}
            </Text>
            <Text style={styles.textButtonCurrent}>{facilityList.time}</Text>

            <View style={styles.subTitleContentContainer}>
              <Text style={styles.textButtonCurrent}>
                {facilityList.headCount}
              </Text>
              <Text style={styles.textprice}>
                2, 100 LKR {/* {facilityList.headCount} */}
              </Text>
            </View>
            <Text style={styles.conviniyentFee}>* Convinient Fee (3%)</Text>
          </View>
          <CrossedPathIcon style={styles.crossedLine} />

          <View style={styles.pyamentMethodeContainer}>
            <Text style={styles.dateInNotice}>Select your payment method </Text>
            <View style={styles.cardIdContainer}>
              <VisaIcon />
              <Text style={styles.cardNumber}>**** 4566</Text>
            </View>

            <View style={styles.cardIdContainer}>
              <VisaIcon />
              <Text style={styles.cardNumber}>**** 4566</Text>
            </View>

            <View style={styles.cardIdContainer}>
              <BankIcon style={styles.bankIcon} />
              <Text style={styles.cardNumber}>**** 4566</Text>
            </View>

            <Text style={styles.addPaymentMethod}>Add a payment method</Text>
          </View>
          <TouchableOpacity>
            {/* key={member.apartment_unit_row_id}
                onPress={() => unitChange(member)}> */}
            <View style={styles.buttonCurrent}>
              <Text style={styles.textButtonPayNow}>Pay Now (2,000 LKR)</Text>
            </View>
          </TouchableOpacity>

          {/* <Content
          selectedMemberType={memberType}
          saveMemberInformationHandler={saveMemberInformationHandler}
        /> */}
          {/* </ScrollView> */}
        </View>
        <SnackBar
          visible={notificationDisplayState}
          textMessage={'Saved successfully'}
          backgroundColor="#1e6e12"
          position="bottom"
          autoHidingTime={5000}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
  },
  mainTitleContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  checkoutHeader: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 15,
    color: '#004F71',
    marginTop: height * 0.07,
  },
  checkoutDesc: {
    width: '100%',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#89B2C4',
    marginBottom: height * 0.01,
    marginLeft: height * 0.07,
  },

  crossedLine: {
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  textButtonCurrent: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#004F71',
  },
  textprice: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004F71',
  },

  textButtonPayNow: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#FFFFFF',
  },
  textSummaryTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    color: '#004F71',
  },
  textSummaryTransaction: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    color: '#004F71',
  },

  buttonCurrent: {
    marginTop: height * 0.1,
    width: 364,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#3E872C',
    borderRadius: 15,
  },
  buttonBack: {
    marginTop: height * 0.08,
  },

  summaryContainer: {
    paddingHorizontal: 15,
    marginTop: height * 0.01,
    width: 364,
    height: 200,
    alignContent: 'space-around',
    backgroundColor: '#EEFAFF',
    borderRadius: 25,
  },

  subTitleContentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardIdContainer: {
    marginTop: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bankIcon: {
    marginLeft: 21,
  },

  cardNumber: {
    marginLeft: width * 0.08,
    fontFamily: 'poppins',
    fontSize: 12,
    marginTop: 0,
  },
  addPaymentMethod: {
    color: '#004F71',
    fontSize: 12,
    marginTop: height * 0.012,
  },

  conviniyentFee: {
    color: '#A6DCF2',
    fontSize: 12,
    marginTop: height * 0.012,
  },

  dateInNotice: {
    marginBottom: height * 0.012,
    fontFamily: 'poppins',
    marginTop: 0,
  },

  pyamentMethodeContainer: {
    width: '100%',
    marginBottom: height * 0.012,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartment: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData[0],
  unitsOfUser: state.apartmentState.apartmentUnits,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitTicket);
