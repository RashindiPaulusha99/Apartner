import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {setSelectedParcelAction} from './actions/apartment-action';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {getVisitersParcelApi} from './services/apartment-service';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import HorizontalArrow from '../../assets/icons/horizontal-arrow-right.svg';

const {width, height} = Dimensions.get('window');
const TodayUpdate = ({
  selectedApartmentData,
  navigation,
  selectedUnit,
  apartmentUnitsList,
  loggedInUserData,
  visibilityHandler,
}) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const [selectedFacility, setSelectedFacility] = useState('');
  const [allVisiterParcelList, setAllVisiterParcelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    initializePage();
  }, [selectedUnit]);

  const initializePage = async () => {
    setIsLoading(true);
    const visiterParcelList = await getVisitersParcelApi({
      unitId: selectedUnit.apartment_unit_id,
      complexId: selectedApartmentData.key,
      userId: loggedInUserData.user_id,
    });
    const visitors = visiterParcelList.data.body.dataList.visitors;
    const todate = new Date();

    const fullArray = visitors
      .filter(item => {
        if (
          item.visiting_frequency === 'none' &&
          item.visitors_status == 'awaiting_arrival'
        ) {
          return item;
        }
      })
      .map(item => {
        return item;
      });

    //check whether any visitor is a weekly visitor
    const weeklyVisitorList = await weeklyVisitorCheck(visitors);

    //check whether any visitor is a daily visitor
    const dailyVisitorList = await dailyVisitorCheck(visitors);

    const weeklyConcatVisitorList =
      weeklyVisitorList.length > 0
        ? fullArray.concat(weeklyVisitorList)
        : fullArray;

    const totalVisitorList =
      dailyVisitorList.length > 0
        ? weeklyConcatVisitorList.concat(dailyVisitorList)
        : weeklyConcatVisitorList;

    setAllVisiterParcelList(totalVisitorList);
    setIsLoading(false);
  };

  const weeklyVisitorCheck = visitorList => {
    const todayDay = moment().format('dddd');
    const weeklyVisitorList =
      visitorList.length > 0 &&
      visitorList !== undefined &&
      visitorList != null &&
      visitorList.filter(item => {
        let weekdays = item.visiting_week_days;
        if (
          item.visiting_week_days != null &&
          weekdays.includes(`${todayDay}`)
        ) {
          return item;
        }
      });

    return weeklyVisitorList;
  };

  const dailyVisitorCheck = visitorList => {
    const dailyVisitorList =
      visitorList.length > 0 &&
      visitorList !== undefined &&
      visitorList != null &&
      visitorList.filter(item => {
        if (item.visiting_frequency === 'daily') {
          return item;
        }
      });

    return dailyVisitorList;
  };

  const selectedFacilityHandler = async value => {
    visibilityHandler(false);
    await AsyncStorage.setItem(
      'selectedVisiorId',
      `${
        value.apartment_visitors_id != undefined
          ? value.apartment_visitors_id
          : value.parcel_details_id
      }`,
    );

    {
      value.apartment_visitors_id && navigation.navigate('ExpectedVisitors');
    }
    {
      value.parcel_details_id && navigation.navigate('VisitorManager');
    }
  };

  const renderBookingItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={i}
      onPress={() => selectedFacilityHandler(item)}
      style={styles.mainCardContainer}>
      <View style={styles.todayCardMainSub}>
        <View style={styles.leftSideContent}>
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
          <View style={styles.leftSideRowContent}>
            <HorizontalArrow style={{marginRight: 5, marginTop: 6}} />
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
        </View>
        <View style={styles.rightSideContent}>
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
          <View style={styles.arrivalStatusContainer}>
            <MCIcon
              name="checkbox-marked-circle-outline"
              size={24}
              color="#3ADB14"
            />
            <Text style={styles.bottomCollect}>
              {' '}
              {item.visitors_status == 'arrived'
                ? 'Awaiting'
                : item.visitors_status == 'awaiting_arrival'
                ? 'Awaiting'
                : 'Denied'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View
    // style={{
    //   height: height * 0.2,
    // }}
    >
      <LoadingDialogue visible={isLoading} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={allVisiterParcelList}
        renderItem={renderBookingItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  leftSideContent: {
    flex: 3,
  },
  leftSideRowContent: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Roboto-Bold',
  },
  inImageIcon: {
    marginLeft: height * 0.035,
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  bottomtime: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    marginTop: height * 0.012,
  },
  bottomDate: {
    marginLeft: 14,
    fontSize: 10,
    color: '#5E5E5E',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  bottomVisitingFrequency: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    marginTop: height * 0.01,
  },
  bottomCollect: {
    fontSize: 12,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
    marginLeft: 5,
  },
  backIcon: {
    marginTop: height * 0.01,
    marginRight: height * 0.02,
  },
  bottomMainContainer: {
    flex: 3,
  },
  arrivalStatusContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  rightSideContent: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
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
});

const mapDispatchToProps = dispatch => ({
  setSelectedParcelData: payload => dispatch(setSelectedParcelAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TodayUpdate);
