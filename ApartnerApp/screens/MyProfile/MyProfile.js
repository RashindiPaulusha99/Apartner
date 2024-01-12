import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import missingImage from '../../assets/images/Missing_avatar.svg';
import {getUserProfileData} from '../MyProfile/services/myProfile-service';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import ArrowIcon from '../../assets/icons/new_ui/arrow.png';
import {MainContainer} from '../../components/';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

const MyProfile = ({
  navigation,
  apartmentFacilityDataItems,
  userData,
  signUpState,
  loggedInUserData,
  selectedApartmentData,
}) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [selectedUnit, setSelectedUnit] = useState();
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigateToBack = () => {
    navigation.navigate('Home');
  };

  const navigateToHome = () => {
    navigation.goBack();
  };
  const navigateToUnit = () => {
    navigation.navigate('UnitInformation');
  };
  const navigateToEmergencyContact = () => {
    navigation.navigate('EmergencyContact');
  };
  const navigateToAccountInfo = () => {
    navigation.navigate('AccInfo');
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const navigateToAccount = () => {
    navigation.navigate('AccInfo');
  };
  const navigateToPersonalInfo = () => {
    navigation.navigate('PersonalInfo');
  };
  const unitHandler = unit => {
    setSelectedUnit(unit);
  };
  const myProfileTile = [
    {
      key: 1,
      title: 'Account Information',
      url: '',
      navHandler: navigateToAccountInfo,
    },
    {
      key: 2,
      title: 'Personal Information',
      url: '',
      navHandler: navigateToPersonalInfo,
    },
    {
      key: 3,
      title: 'Unit Information',
      url: '',
      navHandler: navigateToUnit,
    },
    {
      key: 4,
      title: 'Emergency Contact',
      url: '',
      navHandler: navigateToEmergencyContact,
    },
  ];
  useEffect(() => {
    initDataInPage();
  }, [loggedInUserData]);
  const initDataInPage = async () => {
    try {
      setIsLoading(true);
      const dataParam = {
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
      };
      const getProfileData = await getUserProfileData(dataParam);
      if (
        getProfileData.data.body.statusCode != undefined &&
        getProfileData.data.body.statusCode === 401
      ) {
        setIsLoading(false);
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        setUserEmail(getProfileData.data.body.dataList[0].email);
        setUserFirstName(getProfileData.data.body.dataList[0].first_name);
        setUserLastName(getProfileData.data.body.dataList[0].last_name);

        if (getProfileData.data.body.dataList[0].profile_pic) {
          setProfilePictureToDisplay(
            getProfileData.data.body.dataList[0].imageUrl,
          );
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="My Profile"
      subTitle="Add frequent or one-time visitors"
      changeUnitState={false}
      // keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={false}>
      <View style={styles.tabBox}>
        <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
          <View style={styles.tileContainer}>
            <View style={styles.detailContainer}>
              <View style={styles.topDetailContainer}>
                <LoadingDialogue visible={isLoading} />
                {profilePictureToDisplay != false ? (
                  <Image
                    style={styles.profilePicture}
                    source={{uri: profilePictureToDisplay}}
                  />
                ) : (
                  <Image style={styles.profilePicture} source={missingImage} />
                )}
              </View>
              <View style={styles.bottomDetailContainer}>
                <Text style={styles.nameText}>
                  {userFirstName} {userLastName}
                </Text>
                <Text style={styles.subText}>{signUpState.phoneNumber}</Text>
                <Text style={styles.subText}>{userEmail}</Text>
              </View>
            </View>
            <ScrollView>
              <View style={styles.informationView}>
                {myProfileTile.map((item, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={item.navHandler}
                      // onPress={() => selectedFacilityHandler(item)}
                      key={i}
                      // onPress={() => setSelectedApartmentComplex(item)}
                      style={styles.tileListingContainer}>
                      <Text style={styles.tileNameText}>{item.title}</Text>
                      <Image source={ArrowIcon} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  tabBox: {
    width: '95%',
    flex: 1,
    backgroundColor: '#FFFFFFDD',
    marginHorizontal: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 10,
  },
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
  tileContainer: {
    paddingTop: 20,
    height: '100%',
  },
  informationView: {
    marginTop: height * 0.01,
    height: '100%',
  },
  bottomDetailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
    lineHeight: 24,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#4D4D4D',
    lineHeight: 24,
  },
  topDetailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tileListingContainer: {
    marginHorizontal: width * 0.05,
    padding: width * 0.03,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: 'rgba(33,35,34,0.3)',
    shadowOffset: {height: 6, width: 3},
    elevation: 4,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    height: 68,
    paddingHorizontal: 20,
  },
  tileNameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    lineHeight: 18,
    color: '#235464',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  userData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  signUpState: state.signUpState,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyProfile);
