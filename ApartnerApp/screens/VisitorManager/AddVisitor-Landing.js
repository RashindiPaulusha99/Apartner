import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
  setSelectedParcelAction,
} from './actions/apartment-action';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import {getParcelDataAction} from './actions/parcel-actions';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import PersonImage from '../../assets/images/Person.png';
import GreenINIcon from '../../assets/images/greemIN.svg';
import GreenBoxIN from '../../assets/images/OTP-IN.svg';
import GreenRightIcon from '../../assets/images/greenRight.svg';
import RedReprotedIcon from '../../assets/images/red-reported-icon.svg';
import {getVisitersParcelApi} from './services/apartment-service';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import moment from 'moment';
import member from '../../assets/images/member.png';
import bgImage from '../../assets/images/bg-img.png';
import TagParcel from '../../assets/images/tag-Parcel.svg';
import AddBtn from '../../assets/images/AddButton.svg';
import Star from '../../assets/icons/feather-star.svg';
import PersonIcons from '../../assets/images/Icon-Person.svg';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';

import TodayUpdate from './Today-update';
import ToBeCollected from './components/toBeCollected';

import {MainContainer, DefaultButtonPlain} from '../../components/';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {changeVisitorAction} from '../VisitorManager/actions/apartment-action';

const {width, height} = Dimensions.get('window');
const VisitorManager = ({
  navigation,
  apartmentFacilityDataItems,
  apartmentUnitsList,
  setSelectedParcelData,
  selectedUnit,
  parcelDataList,
  parcelDataProps,
  setSelectedUnit,
  selectedApartmentData,
  loggedInUserData,
  route,
  visitorStatusChange,
  getVisitorChangeDetails,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [allVisiterParcelList, setAllVisiterParcelList] = useState([]);
  const [pastVisitorsList, setPastVisitorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window').height);
  useEffect(() => {
    initDataInPage();
    initializePage();
  }, [selectedUnit, getVisitorChangeDetails]);

  useEffect(() => {
    if (
      typeof route.params !== 'undefined' &&
      typeof route.params.open !== 'undefined' &&
      route.params.open == 'parcel'
    ) {
      setSelectedTab(2);
    }

    if (
      typeof route.params !== 'undefined' &&
      typeof route.params.open !== 'undefined' &&
      route.params.open == 'visitor'
    ) {
      initializePage();
      visitorStatusChange(false);
    }
  }, [route, getVisitorChangeDetails]);

  const initializePage = async () => {
    try {
      setIsLoading(true);
      setAllVisiterParcelList([]);
      setPastVisitorsList([]);
      const visiterParcelList = await getVisitersParcelApi({
        unitId: selectedUnit.apartment_unit_id,
        complexId: selectedApartmentData.key,
        userId: loggedInUserData.user_id,
      });
      const leftvisitors = visiterParcelList.data.body.dataList.visitors;
      const dailyweeklyArrivedVisitors =
        visiterParcelList.data.body.dataList.weeklydailyarrivedVisitors;
      const fullArray = [...leftvisitors];
      setAllVisiterParcelList(fullArray);

      const todate = new Date();
      const pastVisitors = fullArray
        .filter(item => {
          if (item.visitors_status == 'arrived') {
            return item;
          }
        })
        .map(item => {
          return item;
        });
      setPastVisitorsList(
        dailyweeklyArrivedVisitors.length > 0
          ? pastVisitors.concat(dailyweeklyArrivedVisitors)
          : pastVisitors,
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const initDataInPage = async () => {
    parcelDataProps({
      unitId: selectedUnit.apartment_unit_id,
      complexId: selectedApartmentData.key,
      userId: loggedInUserData.user_id,
    });
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const navigateToAddVisitor = () => {
    navigation.navigate('AddVisitor');
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };

  const ButtonPressable = props => {
    return (
      <View>
        <View>{props.svg ? <props.svg /> : null}</View>
      </View>
    );
  };

  const unitHandler = unit => {
    setSelectedUnit(unit);
  };

  const selectedVisitorHandler = async value => {
    visibilityHandler(false);
    await AsyncStorage.setItem(
      'selectedVisiorId',
      value.apartment_visitors_id.toString(),
    );

    navigation.navigate('ReinviteVisitor');
  };

  const visitorTicketItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.tileListingContainerVisitor}>
      <View style={styles.pastVisitorsCard}>
        <View style={styles.tileLeftSideView}>
          <View style={styles.imageContainerView}>
            <View style={styles.imageContainer}>
              <PersonIcons />
              <Text style={styles.tileBoldNameTextVisitor}>
                {item.visiter_first_name && item.visiter_first_name.length > 15
                  ? item.visiter_first_name.substring(0, 15) + '...'
                  : item.visiter_first_name}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <View style={styles.ContainerView}>
                {/* ----BUG Bash---- */}
                {/* <GreenINIcon /> */}
              </View>
              {item.visiting_frequency == 'none' ? (
                <View>
                  <Text style={styles.bottomtimeContainerTextDateTime}>
                    {item.visitors_status == 'awaiting_arrival'
                      ? moment(item.visitors_expected_arrival_time).format(
                          'hh:mm a',
                        )
                      : moment(item.recorded_date).format('hh:mm a')}
                  </Text>
                  <Text style={styles.bottomtimeContainerTextDateTime}>
                    {item.visitors_status == 'awaiting_arrival'
                      ? moment(item.visitors_expected_arrival_time).format(
                          'YYYY-MM-DD',
                        )
                      : moment(item.recorded_date).format('YYYY-MM-DD')}
                  </Text>
                </View>
              ) : (
                <View style={styles.bottomtimeContainerViewNew}>
                  <Text style={styles.bottomtimeContainerTextNew}>
                    {item.visiting_frequency}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.imageContainerBottom}>
              <GreenRightIcon />
              <Text style={styles.bottomtimeContainerText}>
                {item.visitors_status == 'awaiting_arrival'
                  ? 'awaiting'
                  : "Arrived"}
              </Text>
            </View>
            <View style={styles.reinviteBtnView} />
          </View>
        </View>
        <View style={styles.reinviteBtnContainer}>
          <DefaultButtonPlain
            submit={() => selectedVisitorHandler(item)}
            title="Reinvite"
            customStyle={styles.reinviteBtn}
            customTextStyle={styles.reinviteText}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
  const setSelectedParcelHander = parcel => {
    visibilityHandler(false);
    setSelectedParcelData(parcel);
    navigation.navigate('ParcelCollected');
  };
  const parcelTicketItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setSelectedParcelHander(item)}
      key={i}
      style={styles.tileListingContainer}>
      <View style={styles.tileLeftSide}>
        <View style={styles.iconTopContainer}>
          <View style={styles.personImageField}>
            <Image style={styles.userImg} source={PersonImage} />
            {/* --- Bug Bash --- */}
            {/* <View style={styles.backIcon}>
            <ButtonPressable svg={GreenINIcon} />
          </View> */}
          </View>
          <View style={styles.courierTextField}>
            <Text style={[styles.tileNameText, styles.tileBoldNameText]}>
              {item.courier_name && item.courier_name.length > 15
                ? item.courier_name.substring(0, 15) + '...'
                : item.courier_name}
            </Text>
          </View>
        </View>
        <View style={styles.dateTime}>
          <Text style={styles.bottomDate}>
            {item.datetime_collected
              ? moment(item.datetime_collected).format('YYYY MMM DD')
              : ''}
          </Text>
          <Text style={styles.bottomtime}>
            {item.datetime_collected
              ? moment(item.datetime_collected).format('h:mm a')
              : ''}
          </Text>
        </View>
      </View>
      <View style={styles.tileRightSide}>
        {/* <View style={styles.rightanwronicon}> */}
        {/* IN BUG BASH {For future development}*/}
        {/* <ButtonPressable
            svg={
              item.flag === 'reported'
                ? RedReprotedIcon
                : item.flag === 'collected' && GreenRightIcon
            }
          /> */}
        {/* </View> */}
        <View style={styles.rightSideTextContent}>
          <View style={styles.approvedNameView}>
            {/* IN BUG BASH {For future development}*/}
            {/* <Text style={styles.rightSideText}>
              {item.flag === 'reported'
                ? 'Reported by'
                : item.flag === 'collected' && 'Approved by'}
            </Text> */}
            <View>
              <Text style={styles.collectedByText}> Collected by:</Text>
            </View>
            <Text style={styles.rightSideText}>
              {item.flag === 'reported'
                ? item.recorded_by
                : item.collected_by && item.collected_by.length > 8
                ? item.collected_by.substring(0, 8) + '...'
                : item.collected_by}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const VisitorContent = () => (
    <>
      <View style={styles.tileContainer}>
        <Text style={styles.TodayText}>Expected visitors</Text>
        <TodayUpdate
          visibilityHandler={visibilityHandler}
          navigation={navigation}
        />

        <Text style={styles.PastVisitorsText}>Past Visitors</Text>
        <LoadingDialogue visible={isLoading} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pastVisitorsList}
          renderItem={visitorTicketItem}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>

      <View style={styles.addBtnContainer}>
        <TouchableOpacity style={styles.addBtn} onPress={navigateToAddVisitor}>
          <AddBtn width={66} height={66} />
        </TouchableOpacity>
      </View>
    </>
  );

  const ParcelContent = () => (
    <View style={styles.tileContainer}>
      <ToBeCollected
        visibilityHandler={visibilityHandler}
        selectedTab={selectedTab}
        navigation={navigation}
      />
      <LoadingDialogue visible={isLoading} />
      <Text style={styles.PastVisitorsText}>Collected</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={parcelDataList.parcelsCollected}
        renderItem={parcelTicketItem}
        keyExtractor={item => item.recreational_location_id}
      />
    </View>
  );
  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title="Gate Manager"
        subTitle="Add frequent or one-time visitors"
        changeUnitState={false}
        keyboardDissmissHandler={() => {
          setVisibleBottomSheet(false);
        }}
        formContainer={true}>
        <View
          style={{
            width: '95%',
            backgroundColor: '#FFFFFFDD',
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowColor: '#000000',
            shadowOffset: {height: 0, width: 0},
            height:
              Platform.OS === 'ios'
                ? screenData < 812
                  ? height * 0.86
                  : '94%'
                : '88%',
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            alignItems: 'center',
            elevation: 1,
          }}>
          <View style={styles.topCardContainer}>
            <TouchableOpacity
              onPress={() => setVisibleBottomSheet(true)}
              style={styles.changeUnitDropDown}>
              <Text style={styles.changeUnitDropDownText}>
                {selectedUnit.unit_name ? selectedUnit.unit_name : 'All Units'}
              </Text>
              {visibleBottomSheet ? (
                <UpIcon height={10} width={10} />
              ) : (
                <DownIcon height={10} width={10} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.tabButton}>
            <TouchableOpacity
              onPress={() => setSelectedTab(1)}
              style={[
                styles.leftTab,
                selectedTab === 1 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 1 && styles.selectedTabBtnText,
                ]}>
                Visitor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab(2)}
              style={[
                styles.rightTab,
                selectedTab === 2 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 2 && styles.selectedTabBtnText,
                ]}>
                Parcel
              </Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 1 ? <VisitorContent /> : <ParcelContent />}
        </View>
      </MainContainer>
      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
        />
      )}
    </>
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
  bgImage: {
    resizeMode: 'stretch',
  },
  mainContainer: {
    marginTop: StatusBar.currentHeight + height * 0.1,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  BackContainer: {
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
    fontSize: 26,
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
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.03,
  },
  changeUnitDropDown: {
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
  changeUnitDropDownText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  tabButton: {
    flexDirection: 'row',
    height: height * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  leftTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: 40,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    color: '#C8C8C8',
  },
  tileContainer: {
    paddingTop: 15,
    height: '81%',
    width: '100%',
  },
  tileListingContainer: {
    marginHorizontal: width * 0.04,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    marginVertical: 7.5,
    height: Platform.OS === 'ios' ? height * 0.14 : height * 0.165,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileListingContainerVisitor: {
    marginHorizontal: width * 0.04,
    padding: width * 0.01,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    marginVertical: 7.5,
    height: Platform.OS === 'ios' ? height * 0.13 : height * 0.165,
    justifyContent: 'center',
  },
  tileLeftSide: {
    flexDirection: 'column',
    paddingTop: height * 0.02,
    paddingLeft: width * 0.02,
    width: '50%',
  },
  iconTopContainer: {
    flexDirection: 'row',
  },
  personImageField: {
    width: '20%',
  },
  dateTime: {
    paddingLeft: width * 0.12,
  },
  tileRightSide: {
    paddingRight: width * 0.02,
    paddingTop: height * 0.02,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
  },
  courierTextField: {
    justifyContent: 'space-between',
  },
  rightSideTextContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  approvedNameView: {
    marginTop: Platform.OS === 'ios' ? height * 0.02 : height * 0.005,
    marginRight: width * 0.03,
  },
  collectedByText: {
    marginBottom: height * 0.003,
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
  },
  rightSideText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    marginLeft: width * 0.008,
  },
  tileNameText: {
    marginLeft: width * 0.04,
    marginTop: height * 0.001,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#004F71',
  },
  tileBoldNameText: {
    fontFamily: 'Poppins-Bold',
  },
  tilesRoleTextContainer: {
    alignItems: 'baseline',
  },
  tileRoleTextHelper: {
    backgroundColor: '#239D06',
    width: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    marginBottom: height * 0.07,
  },
  addBtnContainer: {
    alignItems: 'center',
    bottom: -27,
    width: '100%',
    position: 'absolute',
  },
  addBtnParcelContainer: {
    alignItems: 'center',
    bottom: -35,
    width: '100%',
    position: 'absolute',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  TodayText: {
    color: '#9B9B9B',
    fontSize: 16,
    marginTop: height * 0.001,
    marginBottom: height * 0.02,
    marginLeft: height * 0.03,
    fontWeight: 'bold',
  },
  PastVisitorsText: {
    color: '#9B9B9B',
    fontSize: 16,
    marginTop: height * 0.05,
    marginBottom: height * 0.01,
    marginLeft: height * 0.03,
    fontWeight: 'bold',
  },
  bottomDate: {
    marginTop: height * 0.003,
    fontSize: 13,
    color: '#212322',
    fontFamily: 'Poppins-Bold',
  },
  bottomtime: {
    fontSize: 10,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
    marginTop: height * 0.02,
  },
  userImg: {
    marginLeft: width * 0.04,
    
  },

  backIcon: {
    marginLeft: width * 0.04,
  },

  BoxINOUT: {
    marginLeft: height * 0.005,
    marginBottom: height * 0.06,
  },
  rightIcon: {
    marginBottom: height * 0.04,
  },
  rightanwronicon: {
    marginTop: height * 0.04,
    marginRight: 10,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  bottomtimeContainer: {
    fontSize: 10,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
  },
  tileLeftSideView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    width: '60%',
  },
  imageContainerView: {
    flex: 2,
  },
  imageContainerBottom: {
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
  },
  reinviteBtnContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  tileBoldNameTextVisitor: {
    marginLeft: 6,
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 5,
  },
  bottomtimeContainerText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#008d36',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 5,
  },
  bottomtimeContainerTextDateTime: {
    marginLeft: 26,
    fontSize: 12,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 5,
  },
  bottomtimeContainerTextNew: {
    marginLeft: 26,
    fontSize: 12,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
    paddingLeft: 5,
    marginTop: 6,
    justifyContent: 'center',
    flexDirection: 'row',
  },

  ContainerView: {
    paddingTop: 7,
    paddingBottom: 7,
  },
  reinviteBtn: {
    marginRight: 10,
    width: width * 0.3,
    height: height * 0.06,
  },
  reinviteBtnView: {
    paddingHorizontal: 10,
    width: '40%',
    flexDirection: 'row',
  },
  reinviteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },
  pastVisitorsCard: {
    justifyContent: 'space-between',
    height: height * 0.18,
    flexDirection: 'row',
    width: '100%',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnit: state.apartmentState.selectedUnit,
  parcelDataList: state.parcelState.parcelsDataList,
  getVisitorChangeDetails: state.visitorState.getVisitorChangeDetails,
});

const mapDispatchToProps = dispatch => ({
  setSelectedParcelData: payload => dispatch(setSelectedParcelAction(payload)),
  parcelDataProps: payload => dispatch(getParcelDataAction(payload)),
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  visitorStatusChange: payload => dispatch(changeVisitorAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisitorManager);
