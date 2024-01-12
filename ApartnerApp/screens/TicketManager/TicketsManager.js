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
  Platform,
  NativeModules,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from './actions/ticketManager-action';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {MainContainer, TopCardContainer} from '../../components';
import AddBtn from '../../assets/images/AddButton.svg';
import Star from '../../assets/images/feather-star-new.svg';
import RightIcon from '../../assets/images/check_black_24dp.svg';
import {
  setSelectedUnitAction,
  changeMemberAction,
  getMemberDetailsAction,
  changeTenantAction,
  setTicketDataAction,
  setTicketListAction,

} from './actions/ticketManager-action';
import {getTicketsDataData} from './services/ticketsData-service';

import LoadingDialogue from '../../components/containers/LoadingDialogue';
import MissingImage from '../../assets/images/Missing_avatar.svg';
import moment from 'moment';

const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;

const MemberManager = ({
  navigation,
  loggedInUserData,
  selectedApartmentData,
  apartmentUnitsList,
  ticketStatus,
  ticketDataChange,
  tenantListChange,
  ticketStatusChange,
  selectedUnit,
  setSelectedUnit,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [units, setUnits] = useState([]);
  const [
    apartmentRelationshipDataList,
    setApartmentRelationshipDataList,
  ] = useState([]);
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
    initDataInPage();
  }, [selectedUnit]);

  useEffect(() => {
    if (ticketStatus === true) {
      initDataInPage();
      ticketStatusChange(false);
    }
  }, [ticketStatus]);

  const initDataInPage = async () => {
    setIsLoading(true);
    try {
      setUnits(apartmentUnitsList);
      setApartmentRelationshipDataList([]);
      const getData = await getTicketsDataData({
        unitId: selectedUnit.apartment_unit_id,
        userId: loggedInUserData.user_id,
        selectedComplexId: selectedApartmentData.key,
      });

      setApartmentRelationshipDataList(getData.data.dataList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHome = () => {
    navigation.goBack();
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const unitHandler = unit => {
    setSelectedUnit(unit);
  };
  const navigateToAddTicket = () => {
    navigation.navigate('LodgeComplaint');
  };
  const openTicketItem = ({item, i}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={i}
        style={styles.tileListingContainer}
        onPress={() => {
          ticketDataChange(item);
          navigation.navigate('ViewLodgeComplaint');
        }}>
        <View style={styles.textContainer}>
          <Text style={styles.tileNameText}>{item.ticket_type}</Text>
          <View style={styles.tilesRoleTextMainContainer}>
            <Text style={styles.expiryTextContainer}>Recorded Date : </Text>
            <Text style={styles.tileTicketColourText}>
              {moment(item.recorded_date).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.tilesRoleTextContainer}>
            <Text style={styles.tileRoleText}>{item.ticket_status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title="Tickets Manager"
        changeUnitState={false}>
        <TopCardContainer customHeight={height * 0.897 - statusBarHeight}>
          <View style={styles.topCardContainer}>
            <TouchableOpacity
              onPress={() => setVisibleBottomSheet(true)}
              style={styles.gateUpdateXBDropDown}>
              <Text style={styles.gateUpdateDropText}>
                {selectedUnit.unit_name ? selectedUnit.unit_name : 'All Units'}
              </Text>
              {visibleBottomSheet ? (
                <UpIcon height={10} width={10} />
              ) : (
                <DownIcon height={10} width={10} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.tileContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={
                apartmentRelationshipDataList
                  ? apartmentRelationshipDataList
                  : []
              }
              renderItem={openTicketItem}
              keyExtractor={item => item.recreational_location_id}
            />
          </View>

          <View style={styles.addBtnContainer}>
            <TouchableOpacity
              onPress={navigateToAddTicket}
              style={styles.addBtn}>
              <AddBtn width={75} height={75} />
            </TouchableOpacity>
          </View>
        </TopCardContainer>
        <LoadingDialogue visible={isLoading} />
      </MainContainer>
      {visibleBottomSheet && (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
          height={[250, 300, 0]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gateUpdateXBDropDown: {
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
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.02,
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  priorityName: {
    marginRight: 3,
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
  },

  gateUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  tileContainer: {
    width: '100%',
    height: Platform.OS === 'ios' ? '92%' : '92%',
    paddingTop: 10,
    paddingBottom: '2%',
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tileListingContainer: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tileNameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
    textTransform: 'capitalize',
  },
  tilesRoleTextMainContainer: {
    marginTop: 5,
    height: 20,
    flexDirection: 'row',
  },
  tilesRoleTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#087395',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 20,
  },
  tileRoleText: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  tileTicketColourText: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
    textTransform: 'uppercase',
  },
  addBtnContainer: {
    alignItems: 'center',
    bottom: -30,
    width: '100%',
    position: 'absolute',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryTextContainer: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#9B9B9B',
  },
  tileRoleTexts: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#26272C',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,

  ticketStatus: state.ticketState.getTicketStatusChange,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  getMemberDetails: (payload, successCallback) =>
    dispatch(getMemberDetailsAction(payload, successCallback)),
  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
  memberStatusChange: payload => dispatch(changeMemberAction(payload)),
  tenantStatusChange: payload => dispatch(changeTenantAction(payload)),
  ticketDataChange: payload => dispatch(setTicketDataAction(payload)),
  ticketStatusChange: payload => dispatch(setTicketListAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberManager);
