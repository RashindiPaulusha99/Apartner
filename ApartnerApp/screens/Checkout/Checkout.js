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
import CrossedPathIcon from '../../assets/icons/crossed-path.svg';
import ArrowBack from '../../assets/icons/arrow-right.svg';


import Content from './components/collapseContent';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import SnackBar from 'react-native-snackbar-component';
import NoticeBoard from '../Apartment/components/noticeBoard';

const {width, height} = Dimensions.get('window');
import {connect} from 'react-redux';

const facilityList = 
  {
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
        <SignInSingUpContainer>
          <KeyboardAvoidingView
            style={styles.subContainer}
            behavior="padding"
            enabled={enableShift}>
            <View>
            <TouchableOpacity >
            {/* //    onPress={() => unitChange(member)}> */}
                <View style={styles.buttonBack}>
              <ArrowBack/>
                </View>
              </TouchableOpacity>
            <Text style={styles.checkoutHeader}>
                  Checkout
                </Text>
                <Text style={styles.checkoutDesc}>
                 Double check the booking summary & proceed.
                </Text>
            </View>
             <View style={styles.summaryContainer}>
                <Text style={styles.textSummaryTitle}>
                  Booking Summary
                </Text>
                <Text style={styles.textSummaryTransaction}>
                  Transaction Type : {facilityList.facilityType}
                </Text>
                <Text style={styles.textButtonCurrent}>
                  {facilityList.facility}
                </Text>
                <Text style={styles.textButtonCurrent}>
                  {facilityList.time}
                </Text>
                <Text style={styles.textButtonCurrent}>
                  {facilityList.headCount}
                </Text>
              </View>
              <CrossedPathIcon style={styles.crossedLine}/>
            <Text style={styles.dateInNotice}>Select your payment method </Text>

              <TouchableOpacity >
                {/* key={member.apartment_unit_row_id}
                onPress={() => unitChange(member)}> */}
                <View style={styles.buttonCredit}>
            
              <CreditIcon/>
                  <Text style={styles.textButton}>
                    Add Credit/Debit Card
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity >
                {/* key={member.apartment_unit_row_id}
                onPress={() => unitChange(member)}> */}
                <View style={styles.buttonCurrent}>
            
              <BankIcon/>
                  <Text style={styles.textButtonCurrent}>
                  Add Current/Savings Account
                  </Text>
                </View>
              </TouchableOpacity>

            {/* <Content
          selectedMemberType={memberType}
          saveMemberInformationHandler={saveMemberInformationHandler}
        /> */}
            {/* </ScrollView> */}
          </KeyboardAvoidingView>
        </SignInSingUpContainer>
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
  checkoutHeader:{
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 'bold' ,
    marginTop:10,
    // fontWeight: 'SemiBold',
    color:'#004F71'
  },
  checkoutDesc:{
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color:'#89B2C4',
    marginBottom:10
  },
  subContainer: {
    height: height * 0.75,
  },
  crossedLine:{
    marginTop:20,
    marginBottom:150
  },
  textButton: {
    fontFamily: 'Poppins',
    fontSize: 14,
    // fontWeight: 'regular',
    color:'white'
  },
  textButtonCurrent: {
    fontFamily: 'Poppins',
    fontSize: 14,
    // fontWeight: 'regular',
    color:'#004F71'
  },
  textSummaryTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold' ,
    marginTop:10,
    // fontWeight: 'SemiBold',
    color:'#004F71'
  },
  textSummaryTransaction:{
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 'bold' ,
    marginTop:16,
    marginBottom:16,
    // fontWeight: 'SemiBold',
    color:'#004F71'
  }
  ,
  UserImage: {
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberType: {
    width: width * 0.85,
    zIndex: 0,
    marginBottom: 30,
  },
  subtitileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#6B7BA2',
  },
  memberTypeBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: height * 0.06,
    marginTop: 10,
  },
  memberTypeBtnOverlay: {marginRight: 10},
  memberTypeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 100,
    borderRadius: 25,
  },
  memberTypeBtnText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: 'white',
  },
  textAreaContainer: {
    borderColor: 'grey',
    padding: 5,
    width: width * 0.85,
  },
  content: {
    width: width * 0.85,
    flexDirection:'row',
    alignItems: 'center',
    marginTop: 30,
  },
  textArea: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderWidth: 0.7,
    borderStyle: 'solid',
    borderColor: '#999999',
    borderRadius: 6,
    padding: 15,
    fontSize: 18,
    fontFamily: 'Lato-Regular',
    color: '#212F3C',
    textAlignVertical: 'top',
    alignSelf: 'center',
    height: height * 0.37,
  },
  buttonCurrent: {
    marginTop:10,
    width: 364,
    height: 66,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row',
    backgroundColor: '#89B2C4',
    borderRadius: 25,
    //marginLeft:10
  },
  buttonBack: {
    marginTop:10,
    //alignItems: 'center',
    //marginLeft:10
  },
  buttonCredit: {
    marginTop: 10,
    width: 364,
    height: 66,
    alignItems: 'center',
    justifyContent:'center',
    flexDirection:'row',
    backgroundColor: '#004F71',
    borderRadius: 25,
  },
  summaryContainer:{
    marginTop: 10,
    width: 364,
    height: 172,
    // alignItems: 'flex-start',
    alignContent:'space-around',
    // justifyContent:'center',
    backgroundColor: '#EEFAFF',
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Montserrat-Light',
    fontWeight: '600',
  },
  buttonContainer: {
    borderRadius: 25,
  },
  RelationshipBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: height * 0.06,
    marginTop: 10,
  },
  RelationshipBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 100,
    borderRadius: 25,
  }, 
  relationshipBtnText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: 'white',
  },
  dateInNotice: {
    fontFamily: 'Roboto-Bold',
  },
  form: {
    width: '100%',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartment: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData[0],
  unitsOfUser: state.apartmentState.apartmentUnits,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),
  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitTicket);
