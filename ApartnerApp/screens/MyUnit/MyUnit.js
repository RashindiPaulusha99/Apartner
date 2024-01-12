import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  StatusBar,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  NativeModules,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
   setMyUnitDataAction
} from './actions/apartment-action';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import MyUnitBg from '../../assets/images/uniBg.png';
import PeopleIocn from '../../assets/images/people-icon.svg';
import TicketIcon from '../../assets/images/Ticket-icon.svg';
import VisitorIcon from '../../assets/images/Visitor-icon.svg';
import PaidIcon from '../../assets/images/paid-icon.svg';


import {
  changeTenantAction,
  changeMemberAction,
} from '../MemberManagement/actions/apartment-action';
import {changeVisitorAction} from '../VisitorManager/actions/apartment-action';
import {getParcelDataAction} from '../VisitorManager/actions/parcel-actions';
import {
  getUserNoticesAction,
} from '../Home/actions/home-action';
import {
  getUnitsSummeryDataApi,
  updateTicketStatus,
} from './services/apartment-service';
import moment from 'moment';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import {MainContainer, TopCardContainer} from '../../components';
import {setTicketListAction} from '../TicketManager/actions/ticketManager-action';
import BookingsIcon from '../../assets/images/book_online_white_36dp';
import ParcelsIcon from '../../assets/images/inventory_2_white_36dp';
import NoticesIcon from '../../assets/images/note_white_36dp';
import {getBookingHistoryChangeDetails} from '../BookingFacility/actions/booking-facility-action';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;
const MyUnit = ({
  navigation,
  apartmentUnitsList,
  initSelectedUnit,
  selectedApartmentData,
  loggedInUserData,
  tenantListChange,
  tenantStatusChange,
  memberListChange,
  memberStatusChange,
  visitorListChange,
  visitorStatusChange,
  parcelDataProps,
  selectedUnitState,
  setSelectedUnitProps,
  ticketStatusChange,
  ticketStatus,
  bookingListChange,
  bookingStatusChange,
  userNoticesList,
  userTicketList,
   setMyUnitDataRedux,
   userNoticesChange,
}) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState(initSelectedUnit);
  const [summeryDataState, setSummeryDataState] = useState({});
  const [ticketBulb, setTicketBulb] = useState(false);
  const [duePaymentsSummeryList, setDuePaymentsSummeryList] = useState([]);
  const [paidPaymentsHistoryList, setPaidPaymentsHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);
  useEffect(() => {
    initPageData();
    refreshNoticeData();
    tenantStatusChange(false);
    memberStatusChange(false);
    visitorStatusChange(false);
    bookingStatusChange(false);
  }, [
    selectedUnits,
    tenantListChange,
    memberListChange,
    visitorListChange,
    selectedUnitState,
    ticketStatus,
    bookingListChange,
    userNoticesList,
    loggedInUserData,
  ]);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const navigateToMemberManager = () => {
    navigation.navigate('MemberManager');
  };
  const navigateToVisitorManager = () => {
    navigation.navigate('VisitorManager');
  };

  const navigateToParcelManager = () => {
    navigation.navigate('VisitorManager', {
      open: 'parcel',
    });
  };
  const refreshNoticeData = async () => {
    const dataparams = {
      complexId: selectedApartmentData.key,
      userId: loggedInUserData.user_id,
    };
    await userNoticesChange(dataparams);
  };
  const navigateToNoticeManager = () => {
    navigation.navigate('NoticeManagement', {fromMyUnit: true});
  };

  const navigateToBookingManager = () => {
    navigation.navigate('BookingFacility', {
      open: 'myBooking',
    });
  };

  const navigateToTicketManager = () => {
    setTicketBulb(false);
    updateTicketData();
    navigation.navigate('TicketManagement');
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const unitHandler = unit => {
    setSelectedUnits(unit);
    setSelectedUnitProps(unit);
  };

  const updateTicketData = () => {
    const dataParams = {
      userID: loggedInUserData.user_id,
    };

    updateTicketStatus(dataParams);
  };

  const initPageData = async () => {
    setIsLoading(true);
    try {
      const summeryData = await getUnitsSummeryDataApi({
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
        unitId: selectedUnits.apartment_unit_id,
      });
      if (
        summeryData.data.body.statusCode != undefined &&
        summeryData.data.body.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        if (summeryData.data.message === 'success') {
          setSummeryDataState(summeryData.data.body);

          setDuePaymentsSummeryList(summeryData.data.body.summeryData);
          setPaidPaymentsHistoryList(summeryData.data.body.paymentHistoryData);
          setIsLoading(false);
        setMyUnitDataRedux(summeryData.data.body);
        }
        ticketStatusChange(false);
        bookingStatusChange(false);

        parcelDataProps({unitId: initSelectedUnit.apartment_unit_id});
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  const openSummary = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={i}
      style={styles.tileListingContainer}>
      <Text style={styles.titleName}>{item.cost_item_name}</Text>
      <Text style={styles.payment}>{item.TotalCost} LKR</Text>
      <Text style={styles.penalty}>* penalty accrued 0 LKR</Text>
    </TouchableOpacity>
  );
  const openHistory = ({item, i}) => (
    <TouchableOpacity key={i} style={styles.tileListingContainer}>
      <View style={styles.historyFirstView}>
        <View>
          <Text style={styles.time}>
            {item.periodFrom ? moment(item.periodFrom).format('YYYY MMM') : ''}-
            {item.periodFrom ? moment(item.periodTo).format('YYYY MMM') : ''}
          </Text>
          <Text style={styles.titleNameHistory}>{item.cost_item_name}</Text>
          <Text style={styles.paymentHistory}>{item.TotalCost} LKR</Text>
        </View>
        <View style={styles.leftCard}>
          {item.invoice_status === 'over-due' ? (
            <Text style={styles.StatusText}>Over-due</Text>
          ) : item.invoice_status === 'paid' ? (
            <PaidIcon />
          ) : item.invoice_status === 'due' ? (
            <Text style={styles.StatusText}>Due</Text>
          ) : null}
          <TouchableOpacity>
            <Text style={styles.viewlink}>{item.viewlink}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="My Unit"
      changeUnitState={false}
      backgroundimage={true}
      setbgImage={MyUnitBg}>
      <TopCardContainer customHeight={height * 0.83 - statusBarHeight}>
        <View style={styles.continueBtn}>
          <View style={styles.topMainCardContainer}>
            <View style={styles.topCardContainer}>
              <TouchableOpacity
                onPress={() => setVisibleBottomSheet(true)}
                style={styles.unitUpdateXBDropDown}>
                <Text style={styles.unitUpdateDropText}>
                  {selectedUnitState.unit_name
                    ? selectedUnitState.unit_name
                    : 'All Units'}
                </Text>
                {visibleBottomSheet ? (
                  <UpIcon height={10} width={10} />
                ) : (
                  <DownIcon height={10} width={10} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.topMainCard}>
              <View style={styles.firstFacilityCardMainView}>
                <TouchableOpacity
                  onPress={navigateToMemberManager}
                  style={styles.membersCardView}>
                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>
                      {summeryDataState.noOfMembers
                        ? summeryDataState.noOfMembers
                        : 0}
                    </Text>
                    <PeopleIocn />
                  </View>
                  <Text style={styles.facilityTextMembersAndVehicles}>
                    Members
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.vehiclesCardView}
                  onPress={navigateToBookingManager}>
                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>
                      {summeryDataState.noOfBookingsData
                        ? summeryDataState.noOfBookingsData
                        : 0}
                    </Text>
                    <BookingsIcon />
                  </View>
                  <Text style={styles.facilityTextMembersAndVehicles}>
                    Bookings
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.documentsCardView}
                  onPress={navigateToNoticeManager}>
                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>{userNoticesList}</Text>
                    <NoticesIcon />
                  </View>
                  <Text style={styles.facilityTextMembersAndVehicles}>
                    Notices
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.twoFacilityCardMainView}>
                <TouchableOpacity
                  style={styles.visitorsCardView}
                  onPress={navigateToVisitorManager}>
                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>
                      {summeryDataState.noOfVisitors
                        ? summeryDataState.noOfVisitors
                        : 0}
                    </Text>
                    <VisitorIcon />
                  </View>
                  <Text style={styles.facilityTextVisitiorsAndHelpers}>
                    Visitors
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.helpersCardView}
                  onPress={navigateToParcelManager}>
                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>
                      {summeryDataState.noOfParcelsData
                        ? summeryDataState.noOfParcelsData
                        : 0}
                    </Text>
                    <ParcelsIcon />
                  </View>
                  <Text style={styles.facilityTextVisitiorsAndHelpers}>
                    Parcels
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ticketsCardView}
                  onPress={navigateToTicketManager}>
                  {summeryDataState.noOfTicketsUnReads === 0 ? (
                    <View />
                  ) : (
                    <View style={styles.circleMainView}>
                      <View style={styles.circle}>
                        <Text style={styles.count}>
                          {summeryDataState.noOfTicketsUnReads > 9
                            ? '9+'
                            : summeryDataState.noOfTicketsUnReads}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.numberAndIconView}>
                    <Text style={styles.numberText}>
                      {summeryDataState.noOfTickets
                        ? summeryDataState.noOfTickets
                        : 0}
                    </Text>
                    <TicketIcon />
                  </View>
                  <Text style={styles.facilityTextVisitiorsAndHelpers}>
                    Tickets
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TopCardContainer>
      <Overlay
        overlayStyle={{
          backgroundColor: 'transparent',
          padding: 0,
          marginTop: 0,
          justifyContent: 'center',
        }}
        fullScreen={true}
        backdropStyle={{backgroundColor: 'transparent'}}
        isVisible={isLoading}>
        <ActivityIndicator size="large" color="#0E9CC9" />
      </Overlay>
      {/* </ImageBackground>
      </View> */}

      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
        />
      )}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  MyUnitBg: {
    resizeMode: 'stretch',
  },

  topRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  BackContainer: {
    marginTop: height * 0.01,
    width: '11%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  titleRightContainer: {
    width: '89%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 25,
    color: '#004F71',
    lineHeight: 32,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#004F71',
  },
  subTitleContentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  subTitleContentText: {
    paddingBottom: 0,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#004F71',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: '100%',
  },
  topMainCardContainer: {
    alignItems: 'center',
    height: height * 0.66,
  },
  topMainCard: {
    width: width * 0.88,
    height: height * 0.64,
    marginBottom: height * 0.01,
    borderRadius: 20,
  },
  firstFacilityCardMainView: {
    flexDirection: 'row',
  },
  numberAndIconView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainCountView: {
    width: '65%',
    alignItems: 'flex-end',
  },
  membersCardView: {
    flex: 1,
    marginTop: height * 0.02,
    backgroundColor: '#004F71',
    width: '100%',
    height: height * 0.15,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityCardMainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5',
    marginRight: width * 0.05,
  },
  facilityTextMembersAndVehicles: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#89B2C4',
  },
  facilityTextVisitiorsAndHelpers: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004F71',
  },
  facilityTextDocumentsAndTickets: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vehiclesCardView: {
    flex: 1,
    marginTop: height * 0.02,
    marginLeft: width * 0.015,
    backgroundColor: '#004F71',
    width: '100%',
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentsCardView: {
    flex: 1,
    marginTop: height * 0.02,
    marginLeft: width * 0.015,
    backgroundColor: '#004F71',
    borderTopRightRadius: 20,
    width: '100%',
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoFacilityCardMainView: {
    flexDirection: 'row',
  },
  visitorsCardView: {
    flex: 1,
    backgroundColor: '#89B2C4',
    width: '100%',
    height: height * 0.15,
    borderBottomLeftRadius: 20,
    marginTop: height * 0.01,
    marginRight: width * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpersCardView: {
    flex: 1,
    marginTop: height * 0.01,
    marginLeft: width * 0.01,
    backgroundColor: '#89B2C4',
    width: '100%',
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketsCardView: {
    flex: 1,
    marginTop: height * 0.01,
    marginLeft: width * 0.015,
    backgroundColor: '#89B2C4',
    borderBottomRightRadius: 20,
    width: '100%',
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.01,
  },
  middleContainerMainView: {
    borderRightWidth: 2,
    borderColor: '#9B9B9B',
    height: 33,
    justifyContent: 'center',
    width: 130,
  },
  totalDuetext: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#239D06',
  },
  accruedPenaltytext: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F23B4E',
  },

  StatusText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#3ADB14',
  },
  totalDuepayment: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#239D06',
  },
  centerView: {
    marginLeft: height * 0.074,
  },
  accruedPenaltypayment: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F23B4E',
  },
  bottomContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  tabBox: {
    backgroundColor: '#ffffff',
    height: height * 0.22,
    marginTop: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
  },
  tabButton: {
    flexDirection: 'row',
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  leftTab: {
    flex: 1,
    backgroundColor: '#C8C8C8',
    height: 40,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTab: {
    flex: 1,
    backgroundColor: '#C8C8C8',
    height: 40,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 4,
    borderBottomColor: '#197B9A',
  },
  selectedTabBtnText: {
    fontSize: 14,
    color: '#212322',
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4D4D',
  },
  tileContainer: {
    height: height * 0.65,
  },
  continueBtn: {
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    paddingHorizontal: width * 0.01,
    paddingTop: height * 0.05,
  },
  buttonContinue: {
    backgroundColor: '#0E9CC9',
    borderColor: '#0E9CC9',
    width: '100%',
    height: height * 0.07,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settleMyDuesBtn: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tileListingContainer: {
    padding: width * 0.03,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    marginVertical: 7.5,
    height: 96,
    justifyContent: 'space-between',
  },
  titleName: {
    color: '#F23B4E',
    fontSize: 16,
  },
  payment: {
    color: '#F23B4E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  penalty: {
    color: '#9B9B9B',
    fontSize: 12,
  },
  historyFirstView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#000000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  titleNameHistory: {
    color: '#197B9A',
    fontSize: 16,
  },
  paymentHistory: {
    color: '#197B9A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewlink: {
    color: '#197B9A',
    fontSize: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.01,
  },
  unitUpdateXBDropDown: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  unitUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  buttonMainContainer: {
    paddingHorizontal: width * 0.03,
    paddingVertical: 5,
  },
  circle: {
    width: 17,
    height: 17,
    borderRadius: 18,
    backgroundColor: 'red',
    alignItems: 'center',
  },

  numberOfCount: {
    color: '#FFF',
    fontSize: 11,
  },
  count: {
    color: '#FFF',
    fontSize: 11,
  },
  circleMainView: {
    width: '70%',
    alignItems: 'flex-end',
  },
});

const mapStateToProps = state => ({
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  loggedInUserData: state.signInState.userData,
  initSelectedUnit: state.apartmentState.selectedUnit,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  tenantListChange: state.memberDetailsState.getTenantChangeDetails,
  memberListChange: state.memberDetailsState.getMemberDetailsChange,
  visitorListChange: state.visitorState.getVisitorChangeDetails,
  selectedUnitState: state.apartmentState.selectedUnit,
  ticketStatus: state.ticketState.getTicketStatusChange,
  bookingListChange: state.bookingFacilityState.getBookingHistoryChangeDetails,
  userNoticesList: state.homeState.userNoticesList,
  userTicketList: state.homeState.userTicketList,
});

const mapDispatchToProps = dispatch => ({
  visitorStatusChange: payload => dispatch(changeVisitorAction(payload)),
  tenantStatusChange: payload => dispatch(changeTenantAction(payload)),
  memberStatusChange: payload => dispatch(changeMemberAction(payload)),
  parcelDataProps: payload => dispatch(getParcelDataAction(payload)),
  setSelectedUnitProps: payload => dispatch(setSelectedUnitAction(payload)),
  ticketStatusChange: payload => dispatch(setTicketListAction(payload)),
  bookingStatusChange: payload =>
    dispatch(getBookingHistoryChangeDetails(payload)),
   setMyUnitDataRedux : payload => dispatch(setMyUnitDataAction(payload)),
   userNoticesChange: payload => dispatch(getUserNoticesAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyUnit);
