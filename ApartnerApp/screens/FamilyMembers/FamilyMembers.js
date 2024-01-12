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
} from 'react-native';
import moment from 'moment';

import {
  saveMemberOfUnitApi,
  getUnitMembersData
} from "./services/apartmentHome-services"
import {connect} from 'react-redux';


import HomeHeader from './components/homeHeader';
import {Button, Input} from 'react-native-elements';
import UserImage from '../../assets/images/dummy_user.svg';
import Content from './components/collapseContent';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import SnackBar from 'react-native-snackbar-component';

const {width, height} = Dimensions.get('window');

const ApartmentHome = ({navigation,unitSelected}) => {
  const [memberType, setMemberType] = useState('Family');
  const [familyRelation, setFamilyRelation] = useState('daughter');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [relations, setRelations] = useState([]);
  const [notificationDisplayState, setNotificationDisplayState] = useState(false);

  useEffect(() => {
    loadUnitData();
  }, [memberType]);


  const saveMemberInformationHandler = (data) => {
      const familyMemberData = {
        ...data,
        createdBy :1,
        memberType : memberType,
        userRoleId : memberType == 'Family'? '4' : '5'
      }
      // console.log(familyMemberData,"familyMemberDatafamilyMemberData")
     saveMemberOfUnitApi(familyMemberData);
      setNotificationDisplayState(true);
  }

  const loadUnitData = async() => {
    let formdata = {
      unitId :unitSelected.apartment_unit_id ,
      roleId:  memberType == 'Family'? '4' : '5'
    }
    const memberss = await getUnitMembersData(formdata);
    setRelations(memberss.data.dataList);
      // setNotificationDisplayState(true);
  }

  const ApartmentAndUnitInformationContent = () => (
    <View style={styles.form}>
      <View style={styles.relationshipContainer}>
      {/* <Text style={styles.dateInNotice}>My Units </Text> */}

        <ScrollView
          style={styles.scrollView}
          showsHorizontalScrollIndicator={false}
          horizontal>
          <View style={styles.RelationshipBtnContainer}>
            {relations && relations.map(member => (
              <TouchableOpacity
                key={member.apartment_unit_row_id}

                onPress={() => setFamilyRelation(member.value)}>
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
                    Name : {member.first_name} , Relationship : {member.relationship_name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#182850" barStyle="light-content" />
      <HomeHeader
        navigation={navigation}
        navPage="Unit"
        title="Add Members"
        backBtn={true}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.UserImageContainer}>
          <TouchableOpacity style={styles.UserImage}>
            <UserImage />
          </TouchableOpacity>
        </View>
        <View style={styles.memberType}>
          <Text style={styles.subtitileText}>Member Type</Text>
          <View style={styles.memberTypeBtnContainer}>
            <TouchableOpacity
              style={styles.memberTypeBtnOverlay}
              onPress={() => setMemberType('Family')}>
              <View
                style={[
                  styles.memberTypeBtn,
                  {
                    backgroundColor:
                      memberType === 'Family' ? '#4C84FF' : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.memberTypeBtnText,
                    {
                      color: memberType === 'Family' ? '#FFFFFF' : '#182850',
                    },
                  ]}>
                  Family
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMemberType('Tenant')}>
              <View
                style={[
                  styles.memberTypeBtn,
                  {
                    backgroundColor:
                      memberType === 'Tenant' ? '#4C84FF' : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.memberTypeBtnText,
                    {
                      color: memberType === 'Tenant' ? '#FFFFFF' : '#182850',
                    },
                  ]}>
                  Tenant
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ApartmentAndUnitInformationContent />
        <Content
            selectedMemberType={memberType}
            saveMemberInformationHandler={saveMemberInformationHandler}
         />
      </ScrollView>
      <SnackBar
        visible={notificationDisplayState}
        textMessage={"Saved successfully"}
        backgroundColor="#1e6e12"
        position="bottom"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  UserImageContainer: {
    width: '100%',
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  UserImage: {
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberType: {
    width: '100%',
    height: height * 0.13,
    paddingHorizontal: '8%',
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
  dateInNotice: {
    fontFamily: 'Roboto-Bold',
  },
  form: {
    width: '100%',
  },
});

const mapStateToProps = state => ({
  unitSelected : state.apartmentState.selectedUnit
});

export default connect(mapStateToProps)(ApartmentHome);
