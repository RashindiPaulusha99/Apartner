import React, {useState, useEffect} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import UpArrow from '../../../assets/icons/arrow-up.svg';
import DownArrow from '../../../assets/icons/arrow-down.svg';
import CalendarIcon from '../../../assets/icons/calendar-icon.svg';

import {connect} from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
const {width, height} = Dimensions.get('window');
const relations = [
  {id: 1, name: 'Daughter', value: 'daughter'},
  {id: 2, name: 'Son', value: 'son'},
  {id: 3, name: 'Father', value: 'father'},
  {id: 4, name: 'Mother', value: 'mother'},
];

function CollapseContent({
  selectedMemberType,
  saveMemberInformationHandler,
  unitsOfUser,
  selectedApartment,
}) {
  const [activeSections, setActiveSections] = useState([]);
  const [familyRelation, setFamilyRelation] = useState('daughter');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [nicNumber, setNicNumber] = useState('');
  const [enableShift, setEnableShift] = useState(false);

  const setSections = sections => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const saveMemberInformation = () => {
    const data = {
      firstName: firstName,
      lastName: lastname,
      relationShip: familyRelation,
      dob: birthday,
      nic: nicNumber,
      unitId: selectedUnit.id,
      unitRowId: selectedUnit.id,
      email: userEmail,
      apartmentComplexId: selectedApartment.apartment_complex_id,
      apartmentComplexRowId: selectedApartment.apartment_complex_row_id,
    };
    saveMemberInformationHandler(data);
  };

  const PersonalInformationContent = () => (
    <View style={styles.form}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => height * 0.1,
        })()}>
        <View style={styles.innerContainer}>
          <View style={styles.innerInputContainer}>
            <Text style={styles.subtitileText}>First Name</Text>
            <Input
              inputContainerStyle={styles.inputContainerField}
              inputStyle={styles.inputField}
            
              placeholderTextColor={'gray'}
              lable={'First Name'}
              containerStyle={styles.inputContainerOverlayStyle}
              onChangeText={text => {
                setFirstName(text);
              }}
              value={firstName}
              onFocus={() => setEnableShift(true)}
            />
          </View>
          <View style={styles.innerInputContainer}>
            <Text style={styles.subtitileText}>Last Name</Text>
            <Input
              inputContainerStyle={styles.inputContainerField}
              inputStyle={styles.inputField}
              // onFocus={() => setEnableShift(false)}
              placeholderTextColor={'gray'}
              lable={'Last Name'}
              containerStyle={styles.inputContainerOverlayStyle}
              onChangeText={text => {
                setLastname(text);
              }}
              value={lastname}
              onFocus={() => setEnableShift(true)}
            />
          </View>
        </View>
        <View style={styles.relationshipContainer}>
          <Text style={styles.subtitileText}>Relationship</Text>
          <ScrollView
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
            horizontal>
            <View style={styles.RelationshipBtnContainer}>
              {relations.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => setFamilyRelation(member.value)}>
                  <View
                    style={[
                      styles.RelationshipBtn,
                      {
                        backgroundColor:
                          familyRelation === member.value
                            ? '#4C84FF'
                            : 'transparent',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.relationshipBtnText,
                        {
                          color:
                            familyRelation === member.value
                              ? '#FFFFFF'
                              : '#182850',
                        },
                      ]}>
                      {member.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.innerInputContainer}>
            <View style={styles.innerInputContainerBirthday}>
              <Text style={styles.subtitileTextBirthday}>Birthday</Text>
              <CalendarIcon width={20} height={20} />
            </View>
            <DatePicker
              style={styles.inputDateContainerField}
              date={birthday}
              mode="date"
              androidMode="spinner"
              showIcon={false}
              format="MM-DD-YYYY"
              minDate="01-01-1900"
              maxDate={moment(new Date()).format('MM-DD-YYYY')}
              placeholder="MM-DD-YYYY"
             
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
          <View style={styles.innerInputContainer}>
            <Text style={styles.subtitileText}>NIC Number</Text>
            <Input
              inputContainerStyle={styles.inputContainerField}
              inputStyle={styles.inputField}
             
              placeholderTextColor={'gray'}
              lable={'Last Name'}
              containerStyle={styles.inputContainerOverlayStyle}
              onChangeText={text => {
                setNicNumber(text);
              }}
              value={nicNumber}
              onFocus={() => setEnableShift(true)}
            />
          </View>
        </View>

        <View style={styles.relationshipContainer}>
          <Text style={styles.subtitileText}>Email</Text>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
           
            placeholderTextColor={'gray'}
            lable={'Email'}
            containerStyle={styles.inputContainerOverlayStyle}
            onChangeText={text => {
              setUserEmail(text);
            }}
            value={userEmail}
            onFocus={() => setEnableShift(true)}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );

  const ApartmentAndUnitInformationContent = () => (
    <View style={styles.form}>
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
    </View>
  );



  const OtherInformationContent = () => (
    <View style={styles.form}>
      <View style={styles.relationshipContainer} />
    </View>
  );


  const CONTENT = [
    {
      id: 0,
      title: [{name: 'Personal Information'}],
      content: [{component: PersonalInformationContent()}],
    },
    {
      id: 2,
      title: [{name: 'Apartment & Unit Information'}],
      content: [{component: <ApartmentAndUnitInformationContent />}],
    },
    {
      id: 3,
      title: [{name: 'Other Information'}],
      content: [{component: <OtherInformationContent />}],
    },
  ];
  const renderHeader = (section, _, isActive) => (
    <View style={styles.collapseHeader}>
      {section.title.map((item, id) => (
        <Text key={item.id} style={styles.contentHeaderText}>
          {item.name}
        </Text>
      ))}

      {isActive ? (
        <DownArrow width={20} height={20} />
      ) : (
        <UpArrow width={20} height={20} />
      )}
    </View>
  );
  const renderContent = (section, _, isActive) => (
    <View style={styles.collapseContent}>
      {section.content.map((item, id) => (
        <View key={item.key} style={styles.collapseSortContentSection}>
          <View style={styles.collapseSortTextRow}>{item.component}</View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.bottomContiner}>
        <ScrollView>
          <View style={styles.page}>
            <View style={styles.section}>
              <Accordion
                activeSections={activeSections}
                sections={CONTENT}
                touchableComponent={TouchableOpacity}
                touchableProps={{activeOpacity: 1}}
                expandMultiple={false}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={400}
                onChange={setSections}
              />
            </View>
            <View style={styles.confirmBtnContainer}>
              <TouchableOpacity
                style={styles.confirmBtnOverlay}
            
              >
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
           
              >
                <View style={styles.confirmBtn}>
                  <Button
                    onPress={saveMemberInformation}
                    title="Confirm"
                    style={styles.confirmBtnText}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  section: {
    width: '100%',
  },

  collapseHeader: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: '8%',
    marginBottom: 10,
  },

  contentHeaderText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#23366A',
  },

  collapseSortTextRow: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  collapseSort: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#212F3C',
  },
  collapseSortText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#212F3C',
  },
  collapseContent: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: '8%',
  },
  collapseContentTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: '#212F3C',
    marginBottom: 20,
  },
  confirmBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '8%',
    marginBottom: 30,
  },
  confirmBtnOverlay: {marginLeft: 10},
  cancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 100,
  },
  confirmBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 110,
    borderRadius: 30,
    backgroundColor: '#4C84FF',
  },
  cancelBtnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#182850',
    borderBottomWidth: 1,
    borderBottomColor: '#182850',
  },
  confirmBtnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'white',
  },
  form: {
    width: '100%',
  },

  innerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerInputContainer: {
    width: '45%',
  },
  innerInputContainerBirthday: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  inputContainerField: {
    width: '100%',
    height: 45,
  },
  inputContainerOverlayStyle: {
    paddingHorizontal: 0,
  },
  subtitileTextBirthday: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#6B7BA2',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 12,
    color: '#6B7BA2',
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
  relationshipBtnText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: 'white',
  },
  inputDateContainerField: {
    width: width * 0.9,
    height: 45,
  },
});

const mapStateToProps = state => ({
  unitsOfUser: state.apartmentState.apartmentUnits,
  selectedApartment: state.apartmentState.seleletedApatment,
});

export default connect(mapStateToProps)(CollapseContent);

