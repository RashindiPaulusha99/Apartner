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
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-datepicker';

import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import SignInSingUpContainer from '../../components/containers/SignInSingUpContainer';
// import {
//   saveMemberOfUnitApi
// } from "./services/unitTicket-services"

import HomeHeader from './components/homeHeader';
import {Button, Input} from 'react-native-elements';
import UserImage from '../../assets/images/dummy_user.svg';
import Content from './components/collapseContent';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import SnackBar from 'react-native-snackbar-component';
import NoticeBoard from '../Apartment/components/noticeBoard';

const {width, height} = Dimensions.get('window');
import {connect} from 'react-redux';

import {saveUnitTicket} from './services/unitTicket-services';
const ParcelManagement = ({navigation, loggedInUserData, unitsOfUser}) => {
  const [ticketType, setTicketType] = useState('');
  const [description, setDescription] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [isSelected, setIsSelected] = useState(false);
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [parcelOTP, setParcelOTP] = useState('');
  const [parcelInformation, setParcelInformation] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const [enableShift, setEnableShift] = useState(false);
  const [notificationDisplayState, setNotificationDisplayState] = useState(
    false,
  );
  const _onPressButton = () => {
    alert('You tapped the button!');
  };
  const pressDropDown = e => {
    setTicketType(e);
  };
  const addVisitor = async () => {
    const visitorData = {
      apartmentUnitId: selectedUnit.apartment_unit_id,
      visitorExpectedArrivalTime: birthday,
      visitorHasParcel: 'yes',
      visitorStatus: ticketType,
      visitorParcelInformation: parcelInformation,
      visitorParcelOtp: parcelOTP,
    };
    const addvisit = await saveUnitTicket(visitorData);
    setNotificationDisplayState(true);
    setName('');
    setTicketType('');
    setNic('');
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#182850" barStyle="light-content" />
        <HomeHeader />
        <SignInSingUpContainer>
          <KeyboardAvoidingView
            style={styles.subContainer}
            behavior="padding"
            enabled={enableShift}>
            <View style={styles.memberType}>
              <Text style={styles.subtitileText}>Receiving Date</Text>
              <DatePicker
                style={styles.inputDateContainerField}
                date={birthday}
                mode="date"
                androidMode="spinner"
                showIcon={false}
                format="YYYY-MM-DD"
                minDate="01-01-1900"
                //maxDate={moment(new Date()).format('MM-DD-YYYY')}
                placeholder="YYYY-MM-DD"
                // disabled={editor ? false : true}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateInput: {
                    width: width * 0.9,
                    height: 40,
                    backgroundColor: 'white',
                    borderWidth: 0,
                    borderStyle: 'solid',
                    borderColor: '#999999',
                    borderRadius: 6,
                    alignItems: 'baseline',
                    paddingLeft: 20,
                    fontSize: 18,
                  },
                  datePicker: {
                    backgroundColor: '#d1d3d8',
                    justifyContent: 'center',
                  },
                }}
                onDateChange={date => {
                  setBirthday(date);
                }}
              />
            </View>
            <View style={styles.relationshipContainer}>
              <Text style={styles.subtitileText}>Unit</Text>
              <ScrollView
                style={styles.scrollView}
                showsHorizontalScrollIndicator={false}
                horizontal>
                <View style={styles.RelationshipBtnContainer}>
                  {unitsOfUser.map(member => (
                    <TouchableOpacity
                      key={member.apartment_unit_id}
                      onPress={() => setSelectedUnit(member)}>
                      <View
                        style={[
                          styles.RelationshipBtn,
                          {
                            backgroundColor:
                              selectedUnit.apartment_unit_row_id ===
                              member.apartment_unit_row_id
                                ? '#4C84FF'
                                : 'transparent',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.relationshipBtnText,
                            {
                              color:
                                selectedUnit.apartment_unit_row_id ===
                                member.apartment_unit_row_id
                                  ? '#FFFFFF'
                                  : '#182850',
                            },
                          ]}>
                          {member.unit_name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.memberType}>
              <Text style={styles.subtitileText}>Status</Text>
              <RNPickerSelect
                onValueChange={e => pressDropDown(e)}
                placeholder={{label: 'Status', value: null}}
                value={ticketType}
                // style={{
                //   pickerSelectStyles,
                // }}
                // onPress={e => pressDropDown(e)}
                items={[
                  {label: 'AwaitingArrival', value: 'awaiting_arrival'},
                  {label: 'Arrived', value: 'arrived'},
                ]}
              />
            </View>
            <View>
              <Text style={styles.subtitileText}>Parcel OTP</Text>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                // placeholder="Description"
                onChangeText={text => {
                  setParcelOTP(text != '' ? text : false);
                }}
                placeholderTextColor="grey"
                onFocus={() => setEnableShift(true)}
              />

              <Text style={styles.subtitileText}>Parcel Information</Text>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                // placeholder="Description"
                // numberOfLines={12}
                // multiline={true}
                onChangeText={text => {
                  setParcelInformation(text != '' ? text : false);
                }}
                placeholderTextColor="grey"
                onFocus={() => setEnableShift(true)}
              />
            </View>

            <View style={styles.content}>
              <Button
                rounded
                buttonStyle={styles.button}
                title="Add Parcel"
                onPress={() => addVisitor()}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonText}
              />
            </View>

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
  subContainer: {
    height: height * 0.75,
  },

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
    width: 100,
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
    // width: width * 0.85,
  },
  content: {
    width: width * 0.85,
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
    // height: height * 0.37,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#4C84FF',
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: 'Montserrat-Light',
    fontWeight: '600',
  },
  buttonContainer: {
    borderRadius: 25,
  },
  relationshipContainer: {
    width: '100%',
    height: height * 0.1,
    marginBottom: 20,
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
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartment: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData[0],
  unitsOfUser: state.apartmentState.apartmentUnits,
});

const mapDispatchToProps = dispatch => ({
  // setSelectedApartmentData: payload =>
  //   dispatch(setSelectedApartmentAction(payload)),
  // getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParcelManagement);
