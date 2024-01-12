import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
  setSelectedParcelAction,
} from './actions/apartment-action';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import {getParcelDataAction} from './actions/parcel-actions';
import {getVisitersParcelApi} from './services/apartment-service';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import moment from 'moment';
import AddBtn from '../../assets/images/AddButton.svg';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import ParcelIcon from '../../assets/icons/inventory_2.svg';
import HorizontalArrow from '../../assets/icons/horizontal-arrow-right.svg';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import TodayUpdate from './Today-updateUpComingUI';
import ToBeCollected from './components/toBeCollectedUpComingUI';
import {MainContainer, DefaultButtonPlain} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {changeVisitorAction} from './actions/apartment-action';

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
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
    <TouchableOpacity activeOpacity={1} style={styles.mainCardContainer}>
      <View style={styles.todayCardMainSub}>
        <View style={styles.leftSideContent}>
          <View style={styles.leftSideRowContent}>
            <View style={styles.leftSideRowContent}>
              <MIcon
                name="person-outline"
                size={24}
                color="#000000"
                style={{marginRight: 5}}
              />
              <Text style={styles.nameText}>
                {item.visiter_first_name && item.visiter_first_name.length > 15
                  ? item.visiter_first_name.substring(0, 15) + '...'
                  : item.visiter_first_name}
              </Text>
            </View>

            <View
              style={[
                styles.rightSideContent,
                {
                  justifyContent: 'space-between',
                },
              ]}>
              <View
                style={[
                  styles.guestType,
                  {
                    backgroundColor:
                      item.apartment_visitors_id != null && '#004F71',
                  },
                ]}>
                <Text style={styles.todayCardsTextParcel}>
                  {item.apartment_visitors_id && 'Guest'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.pastVistorList}>
            <View style={styles.leftSideRowContent}>
              <HorizontalArrow style={{marginRight: 5, marginTop: 7}} />
              {item.visiting_frequency === 'none' ? (
                <View>
                  {item.visitors_expected_arrival_time && (
                    <>
                      <Text style={styles.bottomtime}>
                        {moment(item.visitors_expected_arrival_time).format(
                          'MMM DD hh:mm a',
                        )}
                      </Text>
                    </>
                  )}
                </View>
              ) : (
                <Text style={styles.bottomVisitingFrequency}>
                  {item.visiting_frequency == 'daily'
                  ? 'Daily'
                  : item.visiting_frequency == 'weekly'
                  ? 'Weekly'
                  : 'None'
                  }
                </Text>
              )}
            </View>
            <View style={styles.leftSideRowContent}>
              <MCIcon
                name="checkbox-marked-circle-outline"
                size={24}
                color="#3ADB14"
                style={{marginRight: 2}}
              />
              <Text style={styles.bottomCollect}>
                {item.visitors_status == 'arrived'
                  ? 'Arrived'
                  : item.visitors_status == 'awaiting_arrival'
                  ? 'Awaiting Arrival'
                  : 'Denied'}
              </Text>
            </View>
          </View>
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
    </TouchableOpacity>
  );
  const setSelectedParcelHander = parcel => {
    visibilityHandler(false);
    setSelectedParcelData(parcel);
    navigation.navigate('ParcelCollected');
  };
  const parcelTicketItem = ({item, i}) => (
    <>
      <TouchableOpacity
        activeOpacity={1}
        key={i}
        onPress={() => setSelectedParcelHander(item)}
        style={styles.mainCardContainer}>
        <View style={styles.todayCardMainSub}>
          <View style={styles.leftSideContent}>
            <View style={styles.leftSideRowContent}>
              <ParcelIcon style={{marginRight: 5}} />
              <Text style={styles.nameText}>
                {item.courier_name && item.courier_name.length > 10
                  ? item.courier_name.substring(0, 10) + '...'
                  : item.courier_name}
              </Text>
            </View>
            {item.datetime_collected && (
              <View style={styles.leftSideRowContent}>
                <HorizontalArrow style={{marginRight: 5}} />

                <Text style={styles.bottomTimeCollected}>
                  {moment(item.datetime_collected).format('MMM DD hh:mm a')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rightSideContent}>
            <View
              style={[
                styles.guestType,
                {
                  backgroundColor: item.parcel_details_id != null && '#0E9CC9',
                },
              ]}>
              <Text style={styles.todayCardsTextParcel}>
                {item.parcel_details_id && 'Parcel'}
              </Text>
            </View>

            <View style={styles.arrivalStatusContainer}>
              <Text style={styles.bottomCollect}>Collected by</Text>
              <Text style={styles.bottomCollect}>
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
    </>
  );
  const VisitorContent = () => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <LoadingDialogue visible={isLoading} />
      <View style={styles.tileContainer}>
        <Text style={styles.categoryTypeText}>Expected Visitors</Text>
        <View style={styles.categoryTypeTodayUpdate}>
          <TodayUpdate
            visibilityHandler={visibilityHandler}
            navigation={navigation}
          />
        </View>
        <Text style={styles.categoryTypeText}>Past Visitors</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pastVisitorsList}
          renderItem={visitorTicketItem}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>
    </ScrollView>
  );

  const ParcelContent = () => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <View style={styles.tileContainer}>
        <Text style={styles.categoryTypeText}>Arrived</Text>
        <ToBeCollected
          visibilityHandler={visibilityHandler}
          selectedTab={selectedTab}
          navigation={navigation}
        />
        <LoadingDialogue visible={isLoading} />
        <Text style={styles.categoryTypeText}>Collected</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={parcelDataList.parcelsCollected}
          renderItem={parcelTicketItem}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>
    </ScrollView>
  );
  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title={selectedTab === 1 ? 'Visitor Manager' : 'Parcel Manager'}
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
          <View style={{width: '100%', marginTop: 15, height: height * 0.65}}>
            {selectedTab === 1 ? <VisitorContent /> : <ParcelContent />}
          </View>
          {selectedTab === 1 && (
            <View style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={navigateToAddVisitor}>
                <AddBtn width={66} height={66} />
              </TouchableOpacity>
            </View>
          )}
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

  mainContainer: {
    marginTop: StatusBar.currentHeight + height * 0.1,
    height: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
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
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#969696',
  },
  tileContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
  },
  dateTime: {
    marginBottom: height * 0.003,
  },

  addBtnContainer: {
    alignItems: 'center',
    bottom: -27,
    width: '100%',
    position: 'absolute',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTypeText: {
    color: '#969696',
    fontSize: 14,
    marginVertical: 5,
    marginHorizontal: '4%',
    fontFamily: 'Roboto-Medium',
  },
  bottomtime: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    marginTop: height * 0.012,
  },
  bottomTimeCollected: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },

  imageContainer: {
    flexDirection: 'row',
  },

  reinviteBtnContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 5,
  },

  reinviteBtn: {
    width: width * 0.22,
    height: 32,
    backgroundColor: '#0E9CC9',
  },

  reinviteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
  },

  mainCardContainer: {
    width: '92%',
    marginHorizontal: '4%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: width * 0.02,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  guestType: {
    backgroundColor: '#8A2FC7',
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  todayCardMainSub: {
    alignItems: 'center',
    paddingHorizontal: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayCardsTextParcel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
  },

  NameText: {
    marginBottom: Platform.OS === 'ios' ? 6 : 2,
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Poppins-Bold',
  },

  bottomTime: {
    fontSize: 10,
    color: '#5E5E5E',
    fontFamily: 'Poppins-Bold',
  },

  leftSideContent: {
    flex: 3,
  },
  leftSideRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Roboto-Bold',
  },
  bottomVisitingFrequency: {
    fontSize: 12,
    color: '#5E5E5E',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    marginTop: height * 0.01,
  },
  bottomCollect: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },
  arrivalStatusContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
  },
  rightSideContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  pastVistorList: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  categoryTypeTodayUpdate: {
    marginBottom: height * 0.05,
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
