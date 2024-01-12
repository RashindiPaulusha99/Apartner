import React, {useEffect, useState, useCallback} from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';

import OrangeIn from '../../../assets/icons/new_ui/ic_keyboard_tab_orange.svg';
import OrangeCircule from '../../../assets/icons/new_ui/task-alert.svg';
import GreenINIcon from '../../../assets/icons/new_ui/ic_keyboard_tab_green.svg';
import InIconGreen from '../../../assets/images/greemIN.svg';
import GreenRightIcon from '../../../assets/icons/new_ui/icon-task-done.svg';
import RedInIcon from '../../../assets/icons/new_ui/ic_keyboard_tab_red.svg';
import CloseIcon from '../../../assets/icons/new_ui/task-notdone.svg';
import OrangeRightIcon from '../../../assets/images/orangeRight.svg';
import OtpIcone from '../../../assets/images/OTP.svg';
import ParcelIcon from '../../../assets/icons/new_ui/parcel.png';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import PersonIcon from '../../../assets/icons/new_ui/user.png';
import GreenBoxIN from '../../../assets/images/OTP-IN.svg';
import OutIcon from '../../../assets/images/OTPRed.svg';

import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import {setSelectedUnitAction} from '../../Apartment/actions/apartment-action';
import {changeVisitorAction} from '../../VisitorManager/actions/apartment-action';
import {setSelectedParcelAction} from '../../VisitorManager/actions/apartment-action';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LeftSideRedIcon from '../../../assets/icons/new_ui/icon-out.svg';

const {width, height} = Dimensions.get('window');

const GateUpdate = ({
  navigation,
  setSelectedParcelData,
  allVisiterParcelList,
  spinner,
  visitorListChange,
  visitorsDataList,
  setVisitorDataList
}) => {
  let gateUpdatesRef = React.createRef();
  const [getUpdatesCount, setGetUpdatesCount] = useState(0);

  useEffect(() => {
    if (allVisiterParcelList.length !== 0 && gateUpdatesRef.current !== null) {
      gateUpdatesRef.scrollToIndex({
        animated: true,
        index: getUpdatesCount,
        viewPosition: 0.5,
      });
    }
  }, [getUpdatesCount,visitorListChange]);

  const selectedFacilityHandler = async value => {
    await AsyncStorage.setItem(
      'selectedVisiorId',
      `${
        value.apartment_visitors_id != undefined
          ? value.apartment_visitors_id
          : value.parcel_details_id
      }`,
    );

    if (value.apartment_visitors_id) {
      navigation.navigate('ExpectedVisitors');
    }

    if (value.parcel_details_id) {
      setSelectedParcelData(value);
      // flag : enum('collected','','rejected','reported')

      switch (value.flag) {
        case 'not_collected':
          navigation.navigate('ToBeCollected');
          break;
        case 'collected':
          navigation.navigate('ParcelCollected');
          break;
        case 'reported':
          navigation.navigate('ParcelWithdrowReport');
          break;
        default:
          break;
      }
    }
  };

  const renderBookingItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => selectedFacilityHandler(item)}
      key={index}
      style={{
        paddingLeft: index == 0 ? width * 0.03 : 0,
      }}>
      <View style={styles.gateCardsMain}>
        <View
          style={[
            styles.gateCardsParcel,
            item.apartment_visitors_id !== null &&
            item.visitors_parcel_id === null
              ? {backgroundColor: '#004F71'}
              : {backgroundColor: '#087395'},
          ]}>
          <Text style={styles.gateCardsTextParcel}>
            {item.parcel_details_id ? 'Parcel' : 'Guest'}
          </Text>
        </View>
        <View style={styles.gateCards}>
          <View style={styles.container}>
            <View
              style={[
                styles.otpMainContainer,
                (item.visitors_status === 'awaiting_arrival' ||
                  item.visitors_status === 'arrived') && {width: '50%'},
              ]}>
              <View style={{width: 30}}>
                {item.parcel_details_id ? (
                  <Image source={ParcelIcon} style={styles.gateTypeIcon} />
                ) : (
                  <Image source={PersonIcon} style={styles.gateTypeIcon} />
                )}
              </View>
              <Text style={styles.userNameText}>
                {item.visiter_first_name && item.visiter_first_name.length > 7
                  ? item.visiter_first_name.substring(0, 7) + '...'
                  : item.visiter_first_name}
                {item.courier_name && item.courier_name.length > 7
                  ? item.courier_name.substring(0, 7) + '...'
                  : item.courier_name}
              </Text>
            </View>
            {item.visitors_status === 'awaiting_arrival' && (
              <View style={styles.rightIcon}>
                <View style={{width: 25}}>
                  <MCIcon
                    name="checkbox-marked-circle-outline"
                    size={24}
                    color="#3ADB14"
                    style={{marginRight: 2}}
                  />
                </View>
                <View style={styles.bottomCollectMainView}>
                  <Text style={styles.bottomCollect}>Awaiting</Text>
                </View>
              </View>
            )}
            {item.visitors_status === 'arrived' && (
              <View style={styles.rightIcon}>
                <View style={{width: 25}}>
                  <MCIcon
                    name="checkbox-marked-circle-outline"
                    size={24}
                    color="#3ADB14"
                    style={{marginRight: 2}}
                  />
                </View>
                <View style={styles.bottomCollectMainView}>
                  <Text style={styles.bottomCollect}>Arrived</Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.uberEatsbottomContainer}>
            <View style={styles.uberEatsbottomDateView}>
              <View style={styles.backIcon}>
                {item.flag === 'not collected' && <OrangeIn />}
                {item.flag === 'collected' && <GreenINIcon />}
                {item.flag === 'reported' && <RedInIcon />}
                {item.flag === 'rejected' && <RedInIcon />}
                {item.apartment_visitors_id &&
                  item.visiting_frequency === 'none' &&
                  (moment
                    .parseZone(item.visitors_expected_arrival_time)
                    .isBefore(new Date()) &&
                  item.visiting_frequency === 'none' ? (
                    // ---- BUG BASH COMMENT
                    // <LeftSideRedIcon />
                    <GreenINIcon />
                  ) : (
                    <GreenINIcon />
                  ))}
              </View>
              <View>
                {item.visitors_expected_arrival_time && (
                  <>
                    <Text style={styles.arrivalDate}>
                      {moment(item.visitors_expected_arrival_time).format(
                        'MMM DD',
                      )}
                    </Text>
                    <Text style={styles.expectedArrivalTime}>
                      {moment(item.visitors_expected_arrival_time).format(
                        'hh:mm A',
                      )}
                    </Text>
                  </>
                )}

                {item.visiting_frequency === 'weekly' && (
                  <View style={styles.GreenRightIconCard}>
                    <Text style={styles.arrivalDate}>
                    {item.visiting_frequency == 'daily'
                  ? 'Daily'
                  : item.visiting_frequency == 'weekly'
                  ? 'Weekly'
                  : 'None'
                  }
                    </Text>
                    <InIconGreen style={styles.GreenRightIconStyle} />
                  </View>
                )}
                {item.visiting_frequency === 'daily' && (
                  <View style={styles.GreenRightIconCard}>
                    <Text style={styles.arrivalDate}>
                    {item.visiting_frequency == 'daily'
                  ? 'Daily'
                  : item.visiting_frequency == 'weekly'
                  ? 'Weekly'
                  : 'None'
                  }
                    </Text>
                    <InIconGreen style={styles.GreenRightIconStyle} />
                  </View>
                )}
              </View>
              {item.parcel_details_id && (
                <View>
                  <Text style={styles.arrivalDate}>
                    {item.parcel_details_id
                      ? moment(item.datetime_arrival).format('MMM DD')
                      : item.visiting_frequency === 'none'
                      ? moment(item.visitors_expected_arrival_time).format(
                          'MMM DD',
                        )
                      : item.visiting_frequency}
                  </Text>

                  <Text
                    style={[styles.arrivalDate, {fontFamily: 'Roboto-Bold'}]}>
                    {item.parcel_details_id
                      ? moment(item.datetime_arrival).format('h:mm a')
                      : item.visiting_frequency === 'none'
                      ? moment(item.visitors_expected_arrival_time).format(
                          'h:mm a',
                        )
                      : item.visiting_frequency}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.rightIcon}>
              <View style={{width: 25}}>
                {item.flag === 'not collected' && (
                  <OrangeCircule width={20} height={20} />
                )}
                {item.flag === 'collected' && (
                  <GreenRightIcon width={20} height={20} />
                )}
                {item.flag === 'reported' && (
                  <CloseIcon width={20} height={20} />
                )}
                {item.flag === 'rejected' && (
                  <CloseIcon width={20} height={20} />
                )}
              </View>
              <View style={styles.bottomCollectMainView}>
                <Text style={styles.bottomCollect}>
                  {item.parcel_details_id && item.flag}
                  {item.collected_by && ' by'}
                </Text>

                {item.parcel_details_id && item.collected_by && (
                  <Text
                    style={[styles.bottomCollect, {fontFamily: 'Roboto-Bold'}]}>
                    {item.collected_by && item.collected_by.length > 8
                      ? item.collected_by.substring(0, 8) + '...'
                      : item.collected_by}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const clickableScrollerhandler = value => {
    //initially getUpdatesCount must be less than 1 for come back prev. because there is no index below 0.
    if (getUpdatesCount > 0 && value === 'prev') {
      setGetUpdatesCount(pre => pre - 1);
    }
    //initially getUpdatesCount must be more than 0 for move next. because initial slider index 0.
    if (
      getUpdatesCount < allVisiterParcelList.length - 1 &&
      getUpdatesCount >= 0 &&
      value === 'next'
    ) {
      setGetUpdatesCount(pre => pre + 1);
    }
  };
  const emptyDataComponent = () => (
    <View style={styles.emptyTileContainer}>
      <View style={styles.emptyDataTile}>
        <Text style={styles.emptyDataText}>No updates found</Text>
      </View>
    </View>
  );

  return (
    <View>
      {spinner ? (
        <View>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={visitorsDataList}
          renderItem={renderBookingItem}
          ListEmptyComponent={emptyDataComponent}
          keyExtractor={item =>
            item.apartment_visitors_id
              ? item.apartment_visitors_id
              : item.parcel_details_id
          }
          ref={ref => (gateUpdatesRef = ref)}
          onScrollToIndexFailed={error => {
            gateUpdatesRef.scrollToOffset({
              offset: error.averageItemLength * error.index,
              animated: true,
            });
          }}
        />
      )}
      {visitorsDataList && visitorsDataList.length  > 0 && (
        <View style={styles.viewAll}>
          <TouchableOpacity
            style={styles.arrowIconLeft}
            onPress={() => clickableScrollerhandler('prev')}>
            <Icon name="keyboard-arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowIconRight}
            onPress={() => clickableScrollerhandler('next')}>
            <Icon name="keyboard-arrow-right" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gateCardsMain: {
    width: width * 0.65,
    height: 135,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: height * 0.01,
  },
  emptyTileContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyDataTile: {
    width: width * 0.65,
    height: 135,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDataText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#ffffff',
  },
  gateCardsParcel: {
    height: 35,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  gateCards: {
    height: 100,
    paddingHorizontal: height * 0.025,
    justifyContent: 'center',
  },
  gateCardsTextParcel: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Medium',
    lineHeight: 19,
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  gateTypeIcon: {
    width: 20,
    height: 20,
  },
  userNameText: {
    fontSize: 17,
    color: '#004F71',
    fontFamily: 'Roboto-Bold',
    textTransform: 'capitalize',
    paddingRight: width * 0.07,
  },
  uberEatsbottomContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
  },

  arrivalDate: {
    fontSize: 13,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
  },
  expectedArrivalTime: {
    fontSize: 13,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold',
  },
  uberEatsbottomDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  bottomCollect: {
    fontSize: 13,
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
    textTransform: 'capitalize',
  },
  bottomCollectView: {
    justifyContent: 'center',
  },
  backIcon: {
    width: 30,
  },
  rightIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '50%',
  },
  rightIconView: {
    justifyContent: 'center',
    marginRight: height * 0.01,
  },
  otpStyleText: {
    fontSize: 13,
    color: '#4D4D4D',
    fontFamily: 'Roboto-Bold',
  },
  otpView: {
    width: width * 0.2,
    borderColor: '#4D4D4D',
    height: height * 0.04,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: height * 0.005,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visitorArrivalstatus: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorArrivalstatusText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Regular',
  },
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  arrowIconLeft: {
    marginRight: width * 0.25,
  },
  arrowIconRight: {
    marginLeft: width * 0.25,
  },
  GreenRightIconStyle: {
    marginLeft: 10,
  },
  GreenRightIconCard: {
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnit: state.apartmentState.selectedUnit,
  visitorListChange: state.visitorState.getVisitorChangeDetails,
  visitorsDataList: state.memberVisitorState.visitorsDataList
});

const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  visitorStatusChange: payload => dispatch(changeVisitorAction(payload)),
  setSelectedParcelData: payload => dispatch(setSelectedParcelAction(payload)),
  setVisitorDataList: (payload, callback) => dispatch(setVisitorDataListAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GateUpdate);
