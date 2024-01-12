import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Plathform,
  NativeModules,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import {setSelectedDueInvoiceAction} from '../MyDues/actions/myDues-action';
import {connect} from 'react-redux';
import {
  getUserNoticesAction,
  changeUnitUpdatesAction,
  getUserTicketAction,
} from './actions/home-action';
import {getUserProfileData} from '../MyProfile/services/myProfile-service';
import HeaderIcon from '../../assets/icons/logo/Logo-with-Tagline.svg';
import QuickLinks from './components/quickLinks';
import GateUpdate from './components/gateUpdate';
import UnitUpdate from './components/uniteUpdate';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import missingImage from '../../assets/images/Missing_avatar.svg';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import {
  getVisitersParcelApi,
  getApartmentUpdatesPanelData,
} from './services/apartmentLandingHome-services';

import Icon from 'react-native-vector-icons/MaterialIcons';
import SignUpBg from '../../assets/images/HomeBackgorund/Home-backgorund.png';
import {BlurView} from '@react-native-community/blur';
import blurQuickLinksReactangle from '../../assets/images/new_images/Quick-Links.png';
import blurGateUpdatesReactangle from '../../assets/images/new_images/blur-image-gate-updates.png';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { setVisitorDataListAction } from '../VisitorManager/actions/visitor-actions';
const {width, height} = Dimensions.get('window');

const {StatusBarManager} = NativeModules;
const Home = ({
  navigation,
  loggedInUserData,
  selectedApartmentData,
  apartmentUnitsList,
  setSelectedUnit,
  selectedUnit,
  selectedComplex,
  userNoticesChange,
  userTicketChange,
  setSelectedDueInvoice,
  userNoticesList,
  unitUpdatesChange,
  unitChangesStatus,
  userTicketList,
  setVisitorDataList
}) => {
  const {height, width} = useWindowDimensions();

  const [units, setUnits] = useState([]);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [firstBlurView, setFirstBlurView] = useState(React.createRef());
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [gateUpdateSpinner, setGateUpdateSpinner] = useState(false);
  const [allVisiterParcelList, setAllVisiterParcelList] = useState([]);

  const [unitUpdateSpinner, setUnitUpdateSpinner] = useState(false);
  const [apartmentFacilities, setApartmentFacilities] = useState([
    {
      id: 1,
      header: 'OVERDUE',
      catagory: '',
      sub: '',
      type: 'Pay Now',
      bgColorred: '#F23B4E',
      textredColor: '#F23B4E',
      navHandler: payNowHandler,
    },
    {
      id: 2,
      header: 'You have',
      catagory: '',
      sub: '',
      type: 'View All',
      bgColorred: '#89B2C4',
      textredColor: '#F23B4E',
      navHandler: navigationToNotice,
    },
  ]);
  const [profilePictureToDisplay, setProfilePictureToDisplay] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
    initDataInNotice();
  }, []);

  useEffect(() => {
    initializePage();
  }, [selectedUnit]);
  useEffect(() => {
    refreshNoticeData();
  }, []);

  useEffect(() => {
    initializeGateUpdatePage();
    initializeUnitUpdatePage();
  }, [selectedUnit, selectedComplex, loggedInUserData]);

  useEffect(() => {
    initializeUnitUpdatePage(false);
  }, [userNoticesList, userTicketList]);

  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const navigateToBack = () => {
    navigation.navigate('ApartmentSelection');
  };
  const refreshNoticeData = async () => {
    const dataparams = {
      complexId: selectedApartmentData.key,
      userId: loggedInUserData.user_id,
    };
    await userNoticesChange(dataparams);
  };

  const initializePage = async () => {
    setUnits(apartmentUnitsList);
  };
  const initDataInNotice = async () => {
    let dataparams = {
      userId: loggedInUserData.user_id,
      complexId: selectedApartmentData.key,
      unitId: selectedUnit.apartment_unit_id,
    };

    await userTicketChange(dataparams);

    const getProfileData = await getUserProfileData(dataparams);
    if (
      getProfileData.data.body.statusCode != undefined &&
      getProfileData.data.body.statusCode === 401
    ) {
      AsyncStorage.clear();
      navigation.navigate('SpalshScreen');
    } else {
      if (getProfileData.data.body.dataList[0].profile_pic) {
        setProfilePictureToDisplay(
          getProfileData.data.body.dataList[0].imageUrl,
        );
      }
    }
  };

  const unitHandler = unit => {
    setSelectedUnit(unit);
  };
  const onClose = () => {
    onCloseWithButtonClick();
    visibilityHandler();
  };

  const onCloseWithButtonClick = () => {
    return false;
  };

  const weeklyVisitorCheck = visitorList => {
    const todayDay = moment().format('dddd');

    let weeklyVisitorList = [];

    if (
      visitorList.length > 0 &&
      visitorList !== undefined &&
      visitorList != null
    ) {
      weeklyVisitorList = visitorList.filter(item => {
        let weekdays = item.visiting_week_days;
        if (
          item.visiting_week_days != null &&
          item.visiting_frequency === 'weekly' &&
          weekdays.includes(`${todayDay}`)
        ) {
          return item;
        }
      });
    }
    return weeklyVisitorList;
  };

  const initializeGateUpdatePage = async () => {
    try {
      setRefreshing(true);
      setGateUpdateSpinner(true);
      let relatedData = {
        unitId: selectedUnit.apartment_unit_id,
        complexId: selectedUnit === 0 ? selectedComplex.key : null,
        checkComplexId: selectedComplex.key,
        userId: loggedInUserData.user_id,
        gateUpdate: true,
      };

      const visiterParcelList = await getVisitersParcelApi(relatedData);
      if (
        visiterParcelList.data.body.statusCode != undefined &&
        visiterParcelList.data.body.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        if (
          visiterParcelList.data.body.dataList.gateUpdateTotalVisitors.length ==
          0
        ) {
          setRefreshing(false);
          setGateUpdateSpinner(false);
        }
        const parcels = visiterParcelList.data.body.dataList.parcels;

        let visitors =
          visiterParcelList.data.body.dataList.gateUpdateTotalVisitors;

        const visitorsForDateAndDaily = visitors.filter(
          item => item.visiting_frequency !== 'weekly',
        );

        const weeklyVisitorList = await weeklyVisitorCheck(visitors);

        const totalVisitorList =
          visitorsForDateAndDaily.length > 0
            ? weeklyVisitorList.concat(visitorsForDateAndDaily)
            : weeklyVisitorList;

        const fullArray = [...parcels, ...totalVisitorList];

        setAllVisiterParcelList(fullArray);
        setVisitorDataList(fullArray);
        setRefreshing(false);
        setGateUpdateSpinner(false);
      }
    } catch (error) {}
  };

  const navigationToNotice = () => {
    navigation.navigate('NoticeManagement');
  };

  const payNowHandler = unitUpdateData => {
    setSelectedDueInvoice({
      amount: unitUpdateData.data.body.totalOverdue
        ? unitUpdateData.data.body.totalOverdue
        : 0,
      type:
        typeof selectedUnit.apartment_unit_id !== 'undefined'
          ? 'overdue-all-single-unit'
          : 'overdue-all-units',
      unitName: selectedUnit.unit_name,
      invoiceDueDate: unitUpdateData.invoiceDueDate,
      unitId: selectedUnit.apartment_unit_id,
    });
    navigation.navigate('PaymentVerification');
  };
  const getOverDuePeriod = invoiceDueDate => {
    const invoiceDueDateMoment = moment(invoiceDueDate);
    const todayMoment = moment();
    return todayMoment.diff(invoiceDueDateMoment, 'days');
  };

  const initializeUnitUpdatePage = async () => {
    try {
      setRefreshing(true);
      setUnitUpdateSpinner(true);
      const unitUpdateData = await getApartmentUpdatesPanelData({
        unitId: selectedUnit.apartment_unit_id,
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
      });
      if (
        unitUpdateData.data.body.statusCode != undefined &&
        unitUpdateData.data.body.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        let currentApartmentFacilities = apartmentFacilities;
        const overDueDays = getOverDuePeriod(
          unitUpdateData.data.body.invoiceDueDate,
        );
        currentApartmentFacilities[0] = {
          ...currentApartmentFacilities[0],
          catagory: `${
            unitUpdateData.data.body.totalOverdue
              ? unitUpdateData.data.body.totalOverdue
              : 0
          } LKR`,
          sub: unitUpdateData.data.body.invoiceDueDate
            ? `Overdue for ${overDueDays} days`
            : '',
          navHandler: () => {
            payNowHandler(unitUpdateData);
          },
        };
        currentApartmentFacilities[1] = {
          ...currentApartmentFacilities[1],
          navHandler: () => {
            navigationToNotice();
          },
          catagory:
            userNoticesList != 0
              ? `${userNoticesList} New Admin Notices`
              : 'No New Admin Notices',
        };
        setRefreshing(false);
        setUnitUpdateSpinner(false);
        setApartmentFacilities(currentApartmentFacilities);
      }
    } catch (error) {
      setRefreshing(false);
      setUnitUpdateSpinner(false);
    }
  };

  const MainViewComponent = () => (
    <View
      style={[
        styles.middleScrollerContainer,
        {
          height:
            Platform.OS === 'ios'
              ? height - (statusBarHeight + 78 + height * 0.12)
              : 'auto',
        },
      ]}>
      <View style={styles.gateCardContainer}>
        {Platform.OS === 'android' && (
          <Image
            source={blurGateUpdatesReactangle}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'transparent',
              position: 'absolute',
              resizeMode: 'cover',
              borderRadius: 20,
            }}
            blurRadius={90}
          />
        )}
        {Platform.OS === 'ios' && (
          <BlurView
            style={styles.blurViewStyle}
            viewRef={firstBlurView}
            blurType="light"
            blurRadius="90"
            blurAmount={5}
            overlayColor="transparent"
          />
        )}
        <View style={styles.gateCardContainerGate}>
          <Text style={styles.gateUpdateText}>Gate Updates</Text>
        </View>

        <GateUpdate
          selectedUnit={selectedUnit}
          selectedComplex={selectedComplex}
          navigation={navigation}
          spinner={gateUpdateSpinner}
          allVisiterParcelList={allVisiterParcelList}
        />
      </View>
      <View style={styles.unitUpdatesContainer}>
        <Text style={styles.unitText}>Unit Updates</Text>
        <UnitUpdate
          navigation={navigation}
          spinner={unitUpdateSpinner}
          apartmentFacilities={apartmentFacilities}
        />
      </View>
      <View style={styles.quickCardContainer}>
        {Platform.OS === 'android' && (
          <Image
            source={blurQuickLinksReactangle}
            style={{
              width: width,
              backgroundColor: 'transparent',
              position: 'absolute',
              resizeMode: 'cover',
            }}
            blurRadius={90}
          />
        )}

        {Platform.OS === 'ios' && (
          <BlurView
            style={styles.blurViewQuickCardStyle}
            blurRadius={1}
            blurType="light"
            downsampleFactor={10}
            blurAmount={5}
            overlayColor={'transparent'}
          />
        )}

        <Text style={styles.quickText}>Quick Links</Text>
        <View style={styles.quickScroll}>
          <QuickLinks navigation={navigation} />
        </View>
      </View>
    </View>
  );

  const refreshControlHandler = () => {
    initializeGateUpdatePage();
    initializeUnitUpdatePage();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ImageBackground source={SignUpBg} style={styles.image}>
        <LinearGradientContainer
          colors={['#003471', 'rgba(3,40,82,0.57)', 'rgba(128,128,128,0)']}
          styles={styles.container}>
          <View
            style={{
              flex: 1,
              marginTop: statusBarHeight,
              height: height - (statusBarHeight + 78),
            }}>
            <TouchableWithoutFeedback
              onPress={() => {
                onClose();
              }}>
              <ScrollView
                keyboardDismissMode="on-drag"
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshControlHandler}
                    colors={['white']}
                    progressBackgroundColor="transparent"
                    tintColor="#ffffff"
                    progressViewOffset={Platform.OS === 'android' ? -50 : 0}
                  />
                }
                style={{
                  flex: 1,
                }}>
                <View
                  style={[
                    styles.overlay,
                    {
                      marginBottom:
                        Platform.OS === 'ios' && height <= 568
                          ? height * 0.23
                          : Platform.OS === 'ios' && height < 700
                          ? height * 0.11
                          : Platform.OS === 'ios' && height === 736
                          ? height * 0.048
                          : 0,
                    },
                  ]}>
                  <View style={styles.mainContainer}>
                    <View style={styles.topContainer}>
                      <HeaderIcon width={170} height={50} />
                      <View style={styles.profileContainer}>
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
                        <TouchableOpacity onPress={() => navigateToBack()}>
                          <Icon name="apartment" size={30} color="#ffffff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.topHeaderContainer}>
                      <View style={styles.apartmentContainer}>
                        <Text style={styles.apartnmentName}>
                          {selectedApartmentData.label}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setVisibleBottomSheet(true)}
                        style={styles.gateUpdateXBDropDown}>
                        <Text style={styles.gateUpdateDropText}>
                          {selectedUnit && selectedUnit.unit_name !== null
                            ? selectedUnit.unit_name
                            : 'All Units'}
                        </Text>
                        <Icon
                          name="keyboard-arrow-down"
                          size={23}
                          color="#000000"
                        />
                      </TouchableOpacity>
                    </View>
                    {Platform.OS === 'android' ? (
                      <ScrollView>
                        <MainViewComponent />
                      </ScrollView>
                    ) : (
                      <MainViewComponent />
                    )}
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </LinearGradientContainer>
      </ImageBackground>

      <ChangeUnitBottomSheet
        onVisible={visibleBottomSheet}
        visibilityHandler={visibilityHandler}
        unitHandler={unitHandler}
        unitList={units}
        onCloseClick={onClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
  },

  topContainer: {
    paddingHorizontal: width * 0.03,
    height:
      Platform.OS === 'android'
        ? height * 0.05 + StatusBar.currentHeight
        : height * 0.1,
    backgroundColor: '#FFFFFF1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    backgroundColor: 'red',
  },
  mainContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  middleScrollerContainer: {
    justifyContent: 'space-between',
  },

  apartnmentName: {
    fontSize: 16,
    color: '#84C7DD',
    fontFamily: 'Roboto-Regular',
  },
  gateCardContainer: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },

  blurViewStyle: {
    position: 'absolute',
    borderRadius: 20,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  blurViewQuickCardStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },

  gateUpdateText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  unitUpdatesContainer: {
    width: '100%',
    paddingLeft: width * 0.03,
  },
  quickCardContainer: {
    paddingTop: height * 0.025,
    paddingBottom: 10 + height * 0.025,
    width: '100%',
    paddingLeft: width * 0.03,
  },

  quickText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
    justifyContent: 'center',
    marginVertical: 10,
  },
  unitText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
    lineHeight: 24,
    paddingTop: 10,
  },
  gateCardContainerGate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  gateUpdateTextView: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textDecorationLine: 'underline',
  },
  gateUpdateXBDropDown: {
    width: width * 0.5,
    height: Platform.OS === 'ios' ? height * 0.04 : height * 0.05,
    backgroundColor: '#F5F7FD',
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 7,
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  gateUpdateDropText: {
    fontSize: 14,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },
  apartmentContainer: {
    width: '40%',
  },
  topHeaderContainer: {
    paddingHorizontal: width * 0.03,
    height: height * 0.08,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topHeaderContainerHavlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickLink: {
    resizeMode: 'cover',
    justifyContent: 'center',
    height: height * 0.3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 20,
  },
});
const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnit: state.apartmentState.selectedUnit,
  selectedComplex: state.apartmentState.seleletedApatment,
  userNoticesList: state.homeState.userNoticesList,
  unitChangesStatus: state.homeState.unitChangesStatus,
  userTicketList: state.homeState.userTicketList,
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  setSelectedDueInvoiceProps: payload =>
    dispatch(setSelectedDueInvoiceAction(payload)),
  setSelectedDueInvoice: data => dispatch(setSelectedDueInvoiceAction(data)),
  userNoticesChange: (payload, callback) =>
    dispatch(getUserNoticesAction(payload, callback)),
  userTicketChange: (payload, callback) =>
    dispatch(getUserTicketAction(payload, callback)),
  unitUpdatesChange: (payload, callback) =>
    dispatch(changeUnitUpdatesAction(payload, callback)),
    setVisitorDataList: (payload, callback) =>
    dispatch(setVisitorDataListAction(payload, callback)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
