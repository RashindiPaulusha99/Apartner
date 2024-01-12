import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Text,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplashScreen from './screens/SplashScreen/SplashScreen';
import SignInSingUpChose from './screens/SignIn/SignInSingUpChose';
import SignIn from './screens/SignIn/SignIn';
import SignUpMobileNewUI from './screens/SignUp/SignUpMobileNewUI';
import AppIntro from './screens/Intro/Intro';
import ApartmentSelection from './screens/Apartment/ApartmentSelection';
import Facility from './screens/Facility/Facility';
import FamilyMembers from './screens/FamilyMembers/FamilyMembers';
import UnitTickets from './screens/Apartment/components/unitTickets';
import UnitTicket from './screens/UnitTickets/UnitTicket';
import VisitorManagement from './screens/VisitorManagement/VisitorManagement';
import ParcelManagement from './screens/VisitorManagement/ParcelManagement';
import BookingHistory from './screens/BookingFacility/BookingHistory';
import Notification from './screens/Notifications/Notifications';
import BookingFacility from './screens/BookingFacility/BookingFacility';
import FacilityProfile from './screens/BookingFacility/FacilityProfile';
import FacilityBookingCalendarDate from './screens/BookingFacility/facilityBookingCalendarDate';
import MyCommunity from './screens/BookingFacility/MyCommunity';
import HelpDesk from './screens/LodgeTicket/HelpDesk';
import MyDues from './screens/MyDues/MyDues';
import LodgeComplaint from './screens/LodgeComplaint/LodgeComplaint';
import ConfirmPassword from './screens/SignUp/ConfirmPassword';
import EnterNewPasswordToReset from './screens/SignUp/EnterNewPasswordToReset';
import EnterDigitCodeSignWithPw from './screens/SignUp/EnterDigitCodeSignWithPw';
import Payment_Updates from './screens/Notifications/Payment_Updates';
import PaymentVerification from './screens/PaymentVerification/PaymentVerification';
import ParcelWithdrowReport from './screens/ParcelCollected/ParcelWithdrawReport';
import AddVisitor from './screens/VisitorManager/AddVisitor';
import ExpectedVisitors from './screens/VisitorManager/ExpectedVisitors';
import EmergencyContact from './screens/MyProfile/EmergencyContact';
import MyUnit from './screens/MyUnit/MyUnit';
import CreateAccount from './screens/MemberManagement/CreateAccount';

import HomeActiveIcon from './assets/icons/homeactive-icon.svg';
import HomeInActiveIcon from './assets/icons/homeinactive-icon.svg';
import UnitActiveIcon from './assets/icons/unitactive-icon.svg';
import UnitIconIcon from './assets/icons/unit-icon.svg';
import MoreDetailsActiveIcon from './assets/icons/moredetails-icon.svg';
import MoreIcon from './assets/icons/more-icon.svg';
import MyDuesIcon from './assets/icons/my-dues.svg';
import NoticesIcon from './assets/icons/notices-icon.svg';
import EnterDigitCode from './screens/SignUp/EnterDigitCode';
import WelcomeBack from './screens/SignUp/WelcomeBack';
import EmailSend from './screens/SignUp/EmailSend';
import EnterTheEmail from './screens/SignUp/EnterTheEmail';
import MenuApartner from './screens/Menu/Menu';
import Home from './screens/Home/Home';
import Notification_Subscriptions from './screens/NotificationSubscriptions/Notification_Subscriptions';

import AddMember from './screens/MemberManagement/AddMember';

import AddTenant from './screens/MemberManagement/AddTenant';
import MemberManager from './screens/MemberManagement/MemberManager';
import VisitorManager from './screens/VisitorManager/AddVisitor-LandingUpComingUI';
import VisitorStatus from './screens/VisitorManager/VisitorStatus';
import VisitorStatusGuest from './screens/VisitorManager/VisitorStatus(Guest)';
import ReinviteVisitor from './screens/VisitorManager/ReinviteVisitor';

import ToBeCollected from './screens/ParcelCollected/ToBeCollected';
import ParcelCollected from './screens/ParcelCollected/ParcelCollected';
import ParcelRejected from './screens/ParcelCollected/ParcelRejected';
import NewCircular from './screens/Notifications/New-Circular';

import MyProfile from './screens/MyProfile/MyProfile';
import AccInfo from './screens/MyProfile/AccInfo';
import UnitInformation from './screens/MyProfile/UnitInformation';
import UnderDev from './screens/UnderDevPage/UnderDev';
import ProfileChangePassword from './screens/MyProfile/ProfileChangePassword';
import UpdateEmailAddress from './screens/MyProfile/UpdateEmailAddress';
import UpdateEmail from './screens/MyProfile/UpdateEmail';
import PersonalInfo from './screens/MyProfile/PersonalInfo';
import EditMember from './screens/MemberManagement/EditMember';
import EditTenants from './screens/MemberManagement/EditTenants';
import Directory from './screens/BookingFacility/Directory';
import ManagementCouncil from './screens/BookingFacility/ManagementCouncil';
import PendingRequest from './screens/Notifications/PendingRequest';
import PaymentGateway from './screens/PaymentGateway/PaymentGateway';
import TicketManagement from './screens/TicketManager/TicketsManager';
import NoticeManagement from './screens/NoticeManager/NoticeManager';
import ViewLodgeComplaint from './screens/ViewLodgeComplaint/ViewLodgeComplaint';
import PrivacyAndPolicy from './screens/PrivacyAndPolicy/PrivacyAndPolicy';
import FacilitiesMoreDetails from './screens/BookingFacility/FacilitiesMoreDetails';
import PrivacyAndPolicyMenu from './screens/PrivacyAndPolicy/PrivacyAndPolicyMenu';
import {connect} from 'react-redux';
import MyUnitButton from './components/navButtons/myUnitButton';
import linking from './linking';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabs = ({unreadNotification, unreadTicket}) => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          height: Platform.OS === 'ios' ? 70 : 61,
        },
        tabStyle: {
          height: 60,
          paddingBottom: 5,
        },

        activeTintColor: '#087395',
        inactiveTintColor: '#969696',
      }}
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'Home') {
            if (focused) {
              return <CIcon name="home-outline" size={30} color="#087395" />;
            } else {
              return <CIcon name="home-outline" size={30} color="#969696" />;
            }
          }

          if (route.name === 'My Unit') {
            if (focused) {
              return (
                <CIcon name="bed-king-outline" size={30} color="#087395" />
              );
            } else {
              // return (
              //   <MyUnitButton/>
              // );
              return unreadTicket > 0 ? (
                <View style={styles.noticesMainView}>
                  <CIcon name="bed-king-outline" size={30} color="#969696" />

                  <View style={styles.circle}>
                    <Text style={styles.count}>
                      {unreadTicket > 9 ? '9+' : unreadTicket}
                    </Text>
                  </View>
                </View>
              ) : (
                <CIcon name="bed-king-outline" size={30} color="#969696" />
              );
            }
          }

          if (route.name === 'My Dues') {
            if (focused) {
              return <Icon name="receipt-long" size={30} color="#087395" />;
            } else {
              return <Icon name="receipt-long" size={30} color="#969696" />;
            }
          }

          if (route.name === 'Notices') {
            if (focused) {
              return (
                <Icon name="notifications-none" size={30} color="#087395" />
              );
            } else {
              return unreadNotification > 0 ? (
                <View style={styles.noticesMainView}>
                  <Icon name="notifications-none" size={30} color="#969696" />

                  <View style={styles.circle}>
                    <Text style={styles.count}>
                      {unreadNotification > 9 ? '9+' : unreadNotification}
                    </Text>
                  </View>
                </View>
              ) : (
                <Icon name="notifications-none" size={30} color="#969696" />
              );
            }
          }

          if (route.name === 'More') {
            if (focused) {
              return <Icon name="more-horiz" size={30} color="#087395" />;
            } else {
              return <Icon name="more-horiz" size={30} color="#969696" />;
            }
          }
        },
      })}>
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="My Unit"
        component={MyUnit}
      />
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="Notices"
        component={NoticeManagement}
      />
      {/* <Tab.Screen name="Mydues" component={MyDues} /> */}
      <Tab.Screen
        options={{unmountOnBlur: true}}
        name="My Dues"
        component={MyDues}
      />
      <Tab.Screen
        name="More"
        component={MenuApartner}
        options={{
          unmountOnBlur: true,
        }}
      />

      {/* <Tab.Screen name="Checkout" component={CheckoutRegular} /> */}
      {/* <Tab.Screen name="LodgeComplaint" component={LodgeComplaint} /> */}
    </Tab.Navigator>
  );
};

const VisitorTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Visitor"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'Visitor') {
            if (focused) {
              return <UnitActiveIcon />;
            } else {
              return <UnitActiveIcon />;
            }
          }
          if (route.name === 'Parcel') {
            if (focused) {
              return <MoreDetailsActiveIcon />;
            } else {
              return <MoreDetailsActiveIcon />;
            }
          }
        },
      })}>
      <Tab.Screen name="Visitor" component={VisitorManagement} />
      <Tab.Screen name="Parcel" component={ParcelManagement} />
    </Tab.Navigator>
  );
};

const App = ({userNoticesList, userTicketList}) => {
  const [unreadNotification, setUnreadNotification] = useState({});
  const [unreadTicket, setUnreadTicket] = useState({});
  useEffect(() => {
    setUnreadNotification(userNoticesList);
  }, [userNoticesList]);
  useEffect(() => {
    setUnreadTicket(userTicketList);
  }, [userTicketList]);

  useEffect(() => {
    const getUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl === null) {
        return;
      }
      if (initialUrl.includes('EnterNewPasswordToReset')) {
         Alert.alert(initialUrl);
        RootNavigation.navigate('EnterNewPasswordToReset');
      }
    };
    getUrl();
  });

  Text.defaultProps = {};
  Text.defaultProps.maxFontSizeMultiplier = 1;

  TextInput.defaultProps = {};
  TextInput.defaultProps.maxFontSizeMultiplier = 1;

  const CreateSignInSignUpStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false,}}>    
      <Stack.Screen name="SpalshScreen" component={SplashScreen} />
      <Stack.Screen name="EnterNewPasswordToReset"component={EnterNewPasswordToReset}/>
      <Stack.Screen name="SignInSingUpChose" component={SignInSingUpChose} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUpMobileNew" component={SignUpMobileNewUI} />
      <Stack.Screen name="ApartmentSelection" component={ApartmentSelection} />
      <Stack.Screen name="ApartmentHome" component={AppIntro} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContact} />
      <Stack.Screen name="VisitorManagement" component={VisitorTabs} />
      <Stack.Screen name="FamilyMembers" component={FamilyMembers} />
      <Stack.Screen name="Facility" component={Facility} />
      <Stack.Screen name="UnitTickets" component={UnitTickets} />
      <Stack.Screen name="UnitTicket" component={UnitTicket} />
      <Stack.Screen name="BookingFacility" component={BookingFacility} />
      <Stack.Screen name="FacilityProfile" component={FacilityProfile} />
      <Stack.Screen name="BookingHistory" component={BookingHistory} />
      <Stack.Screen
        name="FacilityBookingCalendar"
        component={FacilityBookingCalendarDate}
      />
      <Stack.Screen name="EnterDigitCode" component={EnterDigitCode} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="LodgeComplaint" component={LodgeComplaint} />
      <Stack.Screen name="HelpDesk" component={HelpDesk} />
      <Stack.Screen name="WelcomeBack" component={WelcomeBack} />
      <Stack.Screen name="EnterTheEmail" component={EnterTheEmail} />
      <Stack.Screen name="EmailSend" component={EmailSend} />
      <Stack.Screen name="MenuApartner" component={MenuApartner} />
      <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
      <Stack.Screen name="Payment_Updates" component={Payment_Updates} />
      <Stack.Screen
        name="Home"
        component={() => (
          <HomeTabs
            unreadNotification={unreadNotification}
            unreadTicket={unreadTicket}
          />
        )}
      />
      <Stack.Screen name="NoticeManagement" component={NoticeManagement} />
      <Stack.Screen name="NewCircular" component={NewCircular} />
      <Stack.Screen name="MemberManager" component={MemberManager} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="ParcelCollected" component={ParcelCollected} />
      <Stack.Screen name="VisitorManager" component={VisitorManager} />
      <Stack.Screen name="AddVisitor" component={AddVisitor} />
      <Stack.Screen name="ExpectedVisitors" component={ExpectedVisitors} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="MyUnit" component={MyUnit} />
      <Stack.Screen name="UnitInformation" component={UnitInformation} />
      <Stack.Screen
        name="ParcelWithdrowReport"
        component={ParcelWithdrowReport}
      />
      <Stack.Screen name="AccInfo" component={AccInfo} />
      <Stack.Screen name="ToBeCollected" component={ToBeCollected} />
      <Stack.Screen
        name="Notification_Subscriptions"
        component={Notification_Subscriptions}
      />
      <Stack.Screen
        name="PaymentVerification"
        component={PaymentVerification}
      />
      <Stack.Screen name="MyDues" component={MyDues} />
      <Stack.Screen
        name="EnterDigitCodeSignWithPw"
        component={EnterDigitCodeSignWithPw}
      />
      <Stack.Screen name="UnderDev" component={UnderDev} />
      <Stack.Screen
        name="ProfileChangePassword"
        component={ProfileChangePassword}
      />
      <Stack.Screen name="UpdateEmailAddress" component={UpdateEmailAddress} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
      <Stack.Screen name="UpdateEmail" component={UpdateEmail} />
      <Stack.Screen name="AddMember" component={AddMember} />
      <Stack.Screen name="AddTenant" component={AddTenant} />
      <Stack.Screen name="VisitorStatus" component={VisitorStatus} />
      <Stack.Screen name="VisitorStatusGuest" component={VisitorStatusGuest} />
      <Stack.Screen name="EditMember" component={EditMember} />
      <Stack.Screen name="ReinviteVisitor" component={ReinviteVisitor} />
      <Stack.Screen name="EditTenants" component={EditTenants} />
      <Stack.Screen name="ParcelRejected" component={ParcelRejected} />
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="Directory" component={Directory} />
      <Stack.Screen name="ManagementCouncil" component={ManagementCouncil} />
      <Stack.Screen name="PendingRequest" component={PendingRequest} />
      <Stack.Screen name="PaymentGateway" component={PaymentGateway} />
      <Stack.Screen name="TicketManagement" component={TicketManagement} />
      <Stack.Screen name="ViewLodgeComplaint" component={ViewLodgeComplaint} />
      <Stack.Screen name="PrivacyAndPolicy" component={PrivacyAndPolicy} />
      <Stack.Screen
        name="FacilitiesMoreDetails"
        component={FacilitiesMoreDetails}
      />
      <Stack.Screen
        name="PrivacyAndPolicyMenu"
        component={PrivacyAndPolicyMenu}
      />
    </Stack.Navigator>
  );
  return (
    <NavigationContainer linking={linking}>
      <View style={styles.container}>
        <CreateSignInSignUpStack />
      </View>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  badgeIconMain: {
    height: 30,
    alignItems: 'flex-end',
  },

  NoticesIconMain: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  noticesMainView: {
    flexDirection: 'row',
  },

  circle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#DD1C3A',
    alignItems: 'center',
    position: 'absolute',
    top: -1,
    right: -5,
  },

  count: {
    color: '#FFF',
    fontSize: 11,
  },
});

const mapStateToProps = state => ({
  userNoticesList: state.homeState.userNoticesList,
  userTicketList: state.homeState.userTicketList,
});

export default connect(mapStateToProps)(App);
