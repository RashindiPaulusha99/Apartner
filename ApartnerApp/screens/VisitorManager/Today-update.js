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
import GreenINIcon from '../../assets/images/greemIN.svg';
import InIcon from '../../assets/images/In-icon.svg';
import ExpectedIcon from '../../assets/images/Expected-Icon.svg';
import ProfileIcon from '../../assets/images/Profile-icon.svg';
import OutIcon from '../../assets/images/Out-Icon.svg';
import GreenRightIcon from '../../assets/images/greenRight.svg';
import moment from 'moment';
import RedInIcon from '../../assets/images/redIN.svg';
import PersonIcon from '../../assets/images/Icon-Person.svg';
import {getVisitersParcelApi} from './services/apartment-service';
import AsyncStorage from '@react-native-community/async-storage';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import AwaitingIcon from '../../assets/images/awaiting.svg';
import ArrivedIcon from '../../assets/images/arrived.svg';

const {width, height} = Dimensions.get('window');
const TodayUpdate = ({
  selectedApartmentData,
  navigation,
  selectedUnit,
  apartmentUnitsList,
  loggedInUserData,
  visibilityHandler,
}) => {

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
    const visitors = visiterParcelList.data.body.dataList.visitorMangerVisitors;
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

    const orderedTotalVisitorList = totalVisitorList.reverse();
    setAllVisiterParcelList(orderedTotalVisitorList);
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

  const ButtonPressable = props => {
    return (
      <View>
        <View>{props.svg ? <props.svg /> : null}</View>
      </View>
    );
  };

  const renderBookingItem = ({item, i}) => (
    <View activeOpacity={1} key={i}>
      <TouchableOpacity
        onPress={() => selectedFacilityHandler(item)}
        style={styles.mainCardContainer}>
        <View
          style={[
            styles.todayCardsParcel,
            {backgroundColor: item.apartment_visitors_id != null && '#004F71'},
          ]}>
          <Text style={styles.todayCardsTextParcel}>
            {item.apartment_visitors_id && 'GUEST'}
          </Text>
        </View>
        <View style={styles.todayCardMainSub}>
          <View style={styles.bottomMainContainer}>
            <View style={styles.subMainContainer}>
              <View>
                <ProfileIcon />
              </View>
              <View>
                <Text style={styles.NameText}>
                  {item.visiter_first_name && item.visiter_first_name.length > 8
                    ? item.visiter_first_name.substring(0, 8) + '...'
                    : item.visiter_first_name}
                </Text>
              </View>
              <View style={styles.inImageIcon}>
                <ButtonPressable svg={item.imageOtp} />
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <View style={styles.backIcon}>{/* <GreenINIcon /> */}</View>

              {item.visiting_frequency === 'none' ? (
                <View>
                  {item.visitors_expected_arrival_time && (
                    <>
                      <Text style={styles.bottomtime}>
                        {moment(item.visitors_expected_arrival_time).format(
                          'hh:mm a',
                        )}
                      </Text>
                      <Text style={styles.bottomDate}>
                        {moment(item.visitors_expected_arrival_time).format(
                          'YYYY-MM-DD',
                        )}
                      </Text>
                    </>
                  )}
                </View>
              ) : (
                <Text style={styles.bottomVisitingFrequency}>
                  {item.visiting_frequency}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.bottomArrivalContainer}>
            <GreenRightIcon />

            <Text style={styles.bottomCollect}>
              {' '}
              {item.visitors_status == 'arrived'
                ? <ArrivedIcon/>
                : item.visitors_status == 'awaiting_arrival'
                ? <AwaitingIcon/>
                : 'Denied'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
  return (
    <View
      style={{
        height: height * 0.2,
      }}>
      <LoadingDialogue visible={isLoading} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={allVisiterParcelList}
        renderItem={renderBookingItem}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainCardContainer: {
    width: width * 0.65,
    height: Platform.OS === 'ios' ? height * 0.17 : height * 0.19,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: height * 0.01,
    marginLeft: height * 0.02,
    marginBottom: width * 0.02,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  todayCardsParcel: {
    flex: 2,
    backgroundColor: '#8A2FC7',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  todayCardMainSub: {
    flex: 5,
    alignItems: 'center',
    paddingHorizontal: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayCardsTextParcel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  subMainContainer: {
    flexDirection: 'row',
  },
  NameText: {
    fontSize: 16,
    color: '#004F71',
    fontFamily: 'Poppins-Bold',
    marginLeft: height * 0.016,
  },
  inImageIcon: {
    marginLeft: height * 0.035,
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  bottomtime: {
    marginLeft: 14,
    fontSize: 13,
    color: '#212322',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
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
    color: '#5E5E5E',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    marginTop: height * 0.01,
  },
  bottomCollect: {
    fontSize: 11,
    color: '#707070',
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    marginLeft: 5,
    marginTop: 2,
  },
  backIcon: {
    marginTop: height * 0.01,
    marginRight: height * 0.02,
  },
  bottomMainContainer: {
    flex: 3,
  },
  bottomArrivalContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    alignItems: 'center',
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
