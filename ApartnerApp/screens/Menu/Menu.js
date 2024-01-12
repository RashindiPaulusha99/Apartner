import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import DirectoryIcon from '../../assets/icons/new_ui/directory.svg';
import WalletIcon from '../../assets/icons/new_ui/feather-credit-card.svg';
import NotificationIcon from '../../assets/icons/new_ui/feather-settings.svg';
import AboutIcon from '../../assets/icons/new_ui/Group.svg';
import AboutLightIcon from '../../assets/icons/new_ui/aboutLight.svg';
import EvoteIcon from '../../assets/icons/new_ui/how_to_vote_black_24dp.svg';
import {
  default as GateIcon,
  default as TwoPepoleIcon,
} from '../../assets/icons/new_ui/ic_people_outline_24px.svg';
import InboxIcon from '../../assets/icons/new_ui/person_add_alt_black_24dp.svg';
import FindIcon from '../../assets/icons/new_ui/person_search_black_24dp.svg';
import PoolIcon from '../../assets/icons/new_ui/pool_black_24dp.svg';
import HelpSupportIcon from '../../assets/icons/new_ui/support.svg';
import HelpIcon from '../../assets/icons/new_ui/support_black_24dp.svg';
import SwitchIcon from '../../assets/icons/new_ui/building.svg';
import LogOUtIcon from '../../assets/icons/new_ui/logout_small.svg';
import SignUpBg from '../../assets/images/menu-bg.png';
import missingImage from '../../assets/images/Missing_avatar.svg';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {Overlay} from 'react-native-elements';
import {getUserProfileData} from '../MyProfile/services/myProfile-service';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import BottomSheet from '../../components/containers/bottomSheetV2';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import ExitIcon from '../../assets/icons/new_ui/logout_black_24dp.svg';
import {DefaultButtonPlain, DefaultButtonPlainOutlined} from '../../components';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
//import CancelIcon from '../../assets/icons/new_ui/close-Icon.svg';
import CancelIcon from '../../assets/icons/new_ui/close_black.png';
import {addComplexLastVisitTimeOfUserApi} from './../Apartment/services/apartment-service';
import PrivacyAndPolicyIcon from '../../assets/icons/security-black-icon.svg';
import {MainContainer} from '../../components/';
import {
  setApartmentSelectionPendingState,
  setSelectedApartmentAction,
  getApartmentFacilityAction,
  setSelectedUnitAction,
  setApartmentUnitAction,
} from './../Apartment/actions/apartment-action';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');

const MenuApartner = ({
  navigation,
  userData,
  setSelectedApartmentData,
  selectedApartmentData,
  userApartments,
  setApartmentSelectionPendingReduxState,
  getApartmentFacilities,
  loggedInUserData,
  setSelectedUnit,
  getApartmentUnitsOfUser,
}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [
    openBottomSheetSelectApartment,
    setOpenBottomSheetSelectApartment,
  ] = useState(false);

  const navigateToBack = () => {
    setOpenBottomSheet(false);
    setOpenBottomSheetSelectApartment(false);
    navigation.goBack();
  };

  const navigateToMyProfile = () => {
    navigation.navigate('MyProfile');
  };
  const navigateToMyMyCommunity = () => {
    navigation.navigate('MyCommunity');
  };
  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const navigateToBookingFacility = () => {
    navigation.navigate('BookingFacility');
  };
  const navigateMember = () => {
    navigation.navigate('MemberManager');
  };
  const navigateToDirectory = () => {
    navigation.navigate('Directory');
  };
  const navigateToPrivacyAndPolicy = () => {
    navigation.navigate('PrivacyAndPolicyMenu');
  };

  const navigateToWelcomeBack = async () => {
    setOpenBottomSheet(false);
    setOpenBottomSheetSelectApartment(false);
    await AsyncStorage.clear();
    navigation.navigate('SpalshScreen');
  };
  useEffect(() => {
    initDataInPage();
  }, [userData]);

  const initDataInPage = async () => {
    setIsLoading(true);
    const dataParam = {
      userId: userData.user_id,
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
      setUserFirstName(getProfileData.data.body.dataList[0].first_name);
      setUserLastName(getProfileData.data.body.dataList[0].last_name);
      if (getProfileData.data.body.dataList[0].profile_pic) {
        setProfilePictureToDisplay(
          getProfileData.data.body.dataList[0].imageUrl,
        );
      }
      setIsLoading(false);
    }
  };

  const visibilityHandler = status => {
    setOpenBottomSheet(status);
  };

  const logOut = () => {
    setOpenBottomSheet(true);
  };

  const renderInner = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.topCardGreen}>
        <View style={styles.rightImageview}>
          <ExitIcon />
        </View>
        <View style={styles.emailText}>
          <Text style={styles.emailTextSent}>Confirm Log Out</Text>
        </View>
        <View style={styles.checkTextview}>
          <Text style={styles.checkTextYour}>Are you sure want to</Text>
          <Text style={styles.checkTextYour}>Log out?</Text>
        </View>
        <View style={styles.ButtonView}>
          <DefaultButtonPlainOutlined submit={emailsend} title="Cancel" />
          <DefaultButtonPlain submit={navigateToWelcomeBack} title="Confirm" />
        </View>
      </View>
    </View>
  );

  //Select Apartment BottomSheet
  const visibilityHandlerSelectApartment = status => {
    setOpenBottomSheetSelectApartment(status);
  };

  const selectApartment = () => {
    setOpenBottomSheetSelectApartment(true);
  };
  const closeSelectApartmentForm = () => {
    setOpenBottomSheetSelectApartment(false);
  };
  const setSelectedApartmentComplex = apartment => {
    setApartmentHandler(apartment);
    addComplexLastVisitTimeOfUserApi({
      visitedBy: userData.user_id,
      complexId: apartment.key,
    });
    navigateToHome(apartment);
    setOpenBottomSheetSelectApartment(false);
    getApartmentUnitsOfUser(
      {
        userId: userData.user_id,
        complexId: apartment.key,
      },
      firstUnitData => {
        setSelectedUnit(firstUnitData);
      },
    );
  };

  const setApartmentHandler = selectedApartmentdata => {
    setApartmentSelectionPendingReduxState(true);
    getApartmentFacilities({
      selectedComplexId: selectedApartmentdata.key,
    });
    setSelectedApartmentData(selectedApartmentdata);
  };

  const swichApartment = () => (
    <View style={styles.mainCardContriner}>
      <View style={styles.topCard}>
        <View style={styles.titleMainViewContainer}>
          <View style={styles.containerView} />
          <View style={styles.titleMainView}>
            <Text style={styles.titleText}>Change Apartment</Text>
          </View>
          <View style={styles.titleView}>
            <TouchableOpacity
              onPress={() => {
                closeSelectApartmentForm();
              }}>
              <Image source={CancelIcon} style={styles.cancelImage} />
            </TouchableOpacity>
          </View>
        </View>

        {userApartments &&
          userApartments.length > 0 &&
          userApartments.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedApartmentComplex(item)}>
                <View style={styles.apartmentView}>
                  <View
                    style={
                      userApartments.length - 1 !== index
                        ? styles.apartmentTextContainer
                        : styles.apartmentTextContainerLast
                    }>
                    <Text style={styles.apartmentText}>
                      {item.label.length > 24
                        ? item.label.substring(0, 20) + '...'
                        : item.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    </View>
  );

  const emailsend = async () => {
    setOpenBottomSheet(false);
  };

  const TopRowContainer = () => {
    return <ScreenHeader headerName="Menu" navigateToBack={navigateToBack} />;
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Menu"
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={true}
      backgroundimage={true}
      setbgImage={SignUpBg}>
      <>
        <View style={styles.scrollableContainer}>
          <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
            <View style={styles.mainTopCardView}>
              <TouchableOpacity
                onPress={navigateToMyProfile}
                style={styles.mainTopCard}>
                <View style={styles.mainTopcontainer}>
                  <LoadingDialogue visible={isLoading} />
                  <View>
                    {profilePictureToDisplay != false ? (
                      <Image
                        style={styles.profilePicture}
                        source={{uri: profilePictureToDisplay}}
                      />
                    ) : (
                      <Image
                        style={styles.profilePicture}
                        source={missingImage}
                      />
                    )}
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.uploadCameraContainer}>
                      <AboutLightIcon />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Text style={styles.nameText}>{userFirstName}</Text>
                      <Text style={styles.lastnameText}>{userLastName}</Text>
                    </View>
                    <View>
                      <Text style={styles.TextSeeProfile}>
                        See your Profile{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={navigateToMyMyCommunity}
                style={styles.mainTopCard}>
                <View style={styles.mainTopcontainer}>
                  <LoadingDialogue visible={isLoading} />
                  <View>
                    {selectedApartmentData.img != false ? (
                      <Image
                        style={styles.profilePicture}
                        source={{uri: selectedApartmentData.img}}
                      />
                    ) : (
                      <Image
                        style={styles.profilePicture}
                        source={missingImage}
                      />
                    )}
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.uploadCameraContainer}>
                      <AboutLightIcon />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={styles.nameText}>
                      {selectedApartmentData.label}
                    </Text>
                    <View>
                      <Text style={styles.TextSeeProfile}>See Community </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.facilityMainCard}>
              <View style={styles.gateCardViewContainer}>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <GateIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Gate Master</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <FindIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Find Vendors</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.gateCardViewContainer}>
                <TouchableOpacity
                  style={styles.gateCardView}
                  onPress={navigateToBookingFacility}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <PoolIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Book Facility</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <EvoteIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Cast Your eVote</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.gateCardViewContainer}>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <TwoPepoleIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Manage Helpers</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <InboxIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Add Care Taker</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.gateCardViewSingleContainer}>
                <TouchableOpacity style={styles.gateCardView}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <HelpIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Help Desk</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.gateCardView}
                  onPress={navigateMember}>
                  <View style={styles.gateCardIcon}>
                    <View style={styles.containAllMainIcon}>
                      <InboxIcon />
                    </View>
                    <Text style={styles.gateMasterText}>Members</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottoTxtMainContainer}>
              {/* commented code for future development        
              <View style={styles.bottomTextContainer}>
                <TouchableOpacity style={styles.bottomTextMain}>
                  <View style={styles.bottomIconMain}>
                    <WalletIcon />
                  </View>

                  <Text style={styles.bottomTextWallet}>Wallet</Text>
                </TouchableOpacity>
              </View> */}

              <View style={styles.bottomTextContainer}>
                <TouchableOpacity
                  style={styles.bottomTextMain}
                  onPress={navigateToDirectory}>
                  <View style={styles.bottomIconMain}>
                    <DirectoryIcon />
                  </View>
                  <Text style={styles.bottomTextWallet}>Directory</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottomTextContainer}>
                <TouchableOpacity style={styles.bottomTextMain}>
                  <View style={styles.bottomIconMain}>
                    <HelpSupportIcon />
                  </View>

                  <Text style={styles.bottomTextWallet}>Help & Support</Text>
                </TouchableOpacity>
              </View>
              {/* commented code for future development 

              <View style={styles.bottomTextContainer}>
                <TouchableOpacity
                  style={styles.bottomTextMain}
                  onPress={navigateToNotificationSettings}>
                  <View>
                    <NotificationIcon />
                  </View>

                  <Text style={styles.bottomTextWallet}>
                    Notification Settings
                  </Text>
                </TouchableOpacity>
              </View> */}
              <View style={styles.bottomTextContainer}>
                <TouchableOpacity
                  style={styles.bottomTextMain}
                  onPress={selectApartment}>
                  <View>
                    <SwitchIcon />
                  </View>

                  <Text style={styles.bottomTextWallet}>
                    Switch Communities
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.bottomTextContainer}>
                <TouchableOpacity
                  style={styles.bottomTextMain}
                  onPress={navigateToPrivacyAndPolicy}>
                  <View style={styles.bottomIconMain}>
                    <PrivacyAndPolicyIcon />
                  </View>
                  <Text style={styles.bottomTextWallet}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>

              {/* commented code for future development 

              <View style={styles.bottomTextContainer}>
                <TouchableOpacity style={styles.bottomTextMain}>
                  <View style={styles.bottomIconMainaAbout}>
                    <AboutIcon />
                  </View>

                  <Text style={styles.bottomTextWallet}>About Us</Text>
                </TouchableOpacity>
              </View> */}

              <View style={styles.bottomTextContainer}>
                <TouchableOpacity
                  style={styles.bottomTextMain}
                  onPress={logOut}>
                  <View style={styles.bottomIconMain}>
                    <LogOUtIcon />
                  </View>
                  <Text style={styles.bottomTextLogOut}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        {openBottomSheet ? (
          <Overlay
            overlayStyle={{
              backgroundColor: 'rgba(226, 226, 226, 0.8)',
              padding: 0,
              marginTop: 0,
            }}
            fullScreen={true}
            isVisible={openBottomSheet}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              }}>
              <TopRowContainer />
            </View>
            <BottomSheet
              onVisible={openBottomSheet}
              visibilityHandler={visibilityHandler}
              children={renderInner}
              height={273}
            />
          </Overlay>
        ) : null}

        {openBottomSheetSelectApartment ? (
          <Overlay
            overlayStyle={{
              backgroundColor: 'rgba(226, 226, 226, 0.8)',
              padding: 0,
              margin: 0,
            }}
            fullScreen={true}
            isVisible={openBottomSheetSelectApartment}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
              }}>
              <TopRowContainer />
            </View>
            <BottomSheet
              onVisible={openBottomSheetSelectApartment}
              visibilityHandler={visibilityHandlerSelectApartment}
              children={swichApartment}
              height={273}
            />
          </Overlay>
        ) : null}
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  backBtnContainer: {
    marginTop: height * 0.002,
    marginLeft: width * 0.05,
    width: 20,
  },
  mainTitle: {
    fontFamily: 'Roboto',
    fontSize: 21,
    color: '#26272C',
    paddingLeft: '34%',
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
    marginTop: height * 0.005,
  },
  mainTitleExplore: {
    fontSize: 12,
    color: '#89B2C4',
    fontFamily: 'Roboto-Bold',
  },
  mainTopCard: {
    flex: 1,
    width: width * 0.85,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderColor: '#FFFFFF',
    borderWidth: 0.06,
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  mainTopCardView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'space-between',
  },
  gateCardView: {
    width: width * 0.41,
    height: 59,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: height * 0.01,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  },
  facilityMainCard: {
    alignItems: 'center',
  },
  gateCardViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
  },
  gateCardViewSingleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    justifyContent: 'space-between',
  },
  gateMasterText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
    width: '50%',
    marginLeft: height * 0.01,
  },
  gateCardIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
    marginLeft: height * 0.01,
  },
  lastnameText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#004F71',
    marginLeft: height * 0.01,
  },
  mainTopcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  TextSeeProfile: {
    fontFamily: 'Roboto-Regular',
    fontSize: 11,
    color: '#9B9B9B',
    marginLeft: height * 0.01,
  },
  bottomTextContainer: {
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    borderBottomWidth: 1,
    width: '90%',
    height: 35,
    paddingVertical: 5,
  },
  bottomTextWallet: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
    marginLeft: height * 0.015,
    paddingVertical: height * 0.002,
  },
  bottomTextMain: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  bottoTxtMainContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  bottomIconMain: {
    marginTop: height * 0.001,
  },
  bottomIconMainaAbout: {
    marginTop: height * 0.01,
  },
  bottomTextLogcontainer: {
    width: width * 0.78,
  },
  bottomTextLogOut: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#F23B4E',
    marginLeft: width * 0.035,
  },
  gateMasterTextHelp: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
    width: '40%',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  apartnerTextContainer: {
    width: '100%',
    zIndex: 0,
  },
  scrollableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFFDD',
    marginHorizontal: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 10,
  },
  containAllMainIcon: {
    paddingRight: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  rejectPopop: {
    backgroundColor: '#FFFFFF',
    height: 273,
    width: width,
  },
  topCardGreen: {
    flex: 1,
  },
  rightImageview: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },

  emailText: {
    alignItems: 'center',
    marginTop: height * 0.001,
  },
  emailTextSent: {
    fontFamily: 'Roboto-Black',
    fontSize: 28,
    color: '#26272C',
  },
  checkTextview: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  checkTextYour: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
  },
  ButtonView: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    justifyContent: 'center',
    marginLeft: width * 0.07,
    justifyContent: 'space-around',
  },
  uploadCameraContainer: {
    backgroundColor: '#004F71',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 25,
    height: 17,
    width: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  // Apartment Selection Style
  mainCardContriner: {
    backgroundColor: '#FFFFFF',
    height: 273,
    width: width,
  },

  topCard: {
    flex: 1,
  },
  titleMainViewContainer: {
    padding: 15,
    flexDirection: 'row',
  },
  containerView: {
    flex: 1,
  },
  titleMainView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
  },
  titleView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cancelImage: {
    width: 25,
    height: 25,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
  },
  apartmentView: {
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apartmentTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
    width: '100%',
    height: 35,
  },
  apartmentTextContainerLast: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 35,
  },
  apartmentText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#087395',
    fontFamily: 'Roboto-Regular',
  },
});

const mapStateToProps = state => ({
  userData: state.signInState.userData,
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),
  setApartmentSelectionPendingReduxState: payload =>
    dispatch(setApartmentSelectionPendingState(payload)),
  getApartmentFacilities: payload =>
    dispatch(getApartmentFacilityAction(payload)),
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  getApartmentUnitsOfUser: (payload, successCallback) =>
    dispatch(setApartmentUnitAction(payload, successCallback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MenuApartner);

// export default MenuApartner;
