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
} from './actions/apartment-action';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {MainContainer, TopCardContainer} from '../../components/';
import AddBtn from '../../assets/images/AddButton.svg';
import Star from '../../assets/images/feather-star-new.svg';
import RightIcon from '../../assets/images/check_black_24dp.svg';
import {
  setSelectedUnitAction,
  changeMemberAction,
  getMemberDetailsAction,
  changeTenantAction,
} from './actions/apartment-action';
import {getApartmentRelationshipData} from '../MemberManagement/services/relationshipData-service';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import MissingImage from '../../assets/images/Missing_avatar.svg';
const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;

const MemberManager = ({
  navigation,
  apartmentFacilityDataItems,
  loggedInUserData,
  selectedApartmentData,
  apartmentUnitsList,
  userApartments,
  getMemberDetails,
  memberListChange,
  memberStatusChange,
  tenantStatusChange,
  tenantListChange,
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
    memberStatusChange(false);
    tenantStatusChange(false);
  }, [memberListChange, tenantListChange]);

  useEffect(() => {
    initDataInPage();
  }, [selectedUnit]);

  const initDataInPage = async () => {
    setIsLoading(true);
    try {
      setUnits(apartmentUnitsList);
      setApartmentRelationshipDataList([]);

      let dataParam = {};
      if (selectedTab === 1) {
        dataParam = {
          relationshipType: 'owners',
        };
      }

      if (selectedTab === 2) {
        dataParam = {
          relationshipType: 'tenants',
        };
      }

      const getData = await getApartmentRelationshipData({
        ...dataParam,
        unitId: selectedUnit.apartment_unit_id,
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
      });
      setApartmentRelationshipDataList(getData.data.body.dataList);
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

  const openTicketItem = ({item, i}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={i}
        style={styles.tileListingContainer}
        onPress={() => {
          getMemberDetails(
            {
              userId: item.user_id,
              unitId: item.apartment_unit_id,
            },
            () => {
              navigation.navigate('EditMember');
            },
          );
        }}>
        <View style={styles.tileLeftSide}>
          {item.imageUrl != null ? (
            <Image style={styles.userImg} source={{uri: item.imageUrl}} />
          ) : (
            <MissingImage height={50} width={50} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.tileNameText}>{item.user_name}</Text>

          <View style={styles.tilesRoleTextContainer}>
            <Text style={styles.tileRoleText}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const openTicketItemTenent = ({item, i}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={i}
        style={styles.tileListingContainer}
        onPress={() => {
          getMemberDetails(
            {
              userId: item.user_id,
              unitId: item.apartment_unit_id,
            },
            () => {
              navigation.navigate('EditTenants');
            },
          );
        }}>
        <View style={styles.tileLeftSide}>
          {item.imageUrl != null ? (
            <Image style={styles.userImg} source={{uri: item.imageUrl}} />
          ) : (
            <MissingImage height={50} width={50} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.tileNameText}>
            <Text style={styles.tileBoldNameText}>{item.user_name}</Text>
          </Text>
          <View style={styles.tilesRoleTextContainer}>
            <Text style={styles.tileRoleText}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ownerstViewChange = async () => {
    setSelectedTab(1);
    const dataParams = {
      relationshipType: 'owners',
      unitId:
        selectedUnit != null
          ? selectedUnit.apartment_unit_id
          : apartmentUnitsList[0].apartment_unit_id,
    };
    const getDataOwner = await getApartmentRelationshipData(dataParams);
    setApartmentRelationshipDataList(getDataOwner.data.body.dataList);
  };
  const tenantViewChange = async () => {
    setSelectedTab(2);
    const dataParamtenant = {
      relationshipType: 'tenants',
      unitId:
        selectedUnit != null
          ? selectedUnit.apartment_unit_id
          : apartmentUnitsList[0].apartment_unit_id,
    };
    const getDataTenant = await getApartmentRelationshipData(dataParamtenant);
    setApartmentRelationshipDataList(getDataTenant.data.body.dataList);
  };

  const addMemberHandler = () => {
    if (selectedTab == 1) {
      navigation.navigate('AddMember');
    } else {
      navigation.navigate('AddTenant');
    }
  };

  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title="Member Manager"
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

          <View style={styles.tabButton}>
            <TouchableOpacity
              onPress={() => ownerstViewChange()}
              style={[
                styles.leftTab,
                selectedTab === 1 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 1 && styles.selectedTabBtnText,
                ]}>
                Family
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => tenantViewChange()}
              style={[
                styles.rightTab,
                selectedTab === 2 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 2 && styles.selectedTabBtnText,
                ]}>
                Tenants
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tileContainer}>
            {selectedTab === 1 && (
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
            )}
            {selectedTab === 2 && (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={
                  apartmentRelationshipDataList
                    ? apartmentRelationshipDataList
                    : []
                }
                renderItem={openTicketItemTenent}
                keyExtractor={item => item.recreational_location_id}
              />
            )}
          </View>

          <View style={styles.addBtnContainer}>
            <TouchableOpacity onPress={addMemberHandler} style={styles.addBtn}>
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
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight + height * 0.02,
    alignItems: 'center',
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
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: width * 0.9,
    height: '11%',
  },
  BackContainer: {
    width: '11%',
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
  rightSideTextContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainIcon: {
    alignItems: 'flex-end',
    marginBottom: 5,
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
  gateUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  tabButton: {
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
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
    fontFamily: 'Roboto-Bold',
    color: '#212322',
  },
  tabBtnText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#969696',
  },
  tileContainer: {
    width: '100%',
    height: '82%',
    paddingTop: 10,
    paddingBottom: '12%',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tileListingContainer: {
    marginHorizontal: width * 0.05,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    height: height * 0.13,
    marginVertical: 7.5,
    flexDirection: 'row',
  },
  tileLeftSide: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  userImg: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  tileRightSide: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSideText: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#9B9B9B',
    lineHeight: 16,
  },
  tileNameText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
  },

  tilesRoleTextContainer: {
    alignItems: 'baseline',
    marginTop: 5,
  },
  tileRoleText: {
    backgroundColor: '#069D8E',
    width: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },

  addBtnContainer: {
    alignItems: 'center',
    bottom: -25,
    width: '100%',
    position: 'absolute',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
  memberListChange: state.memberDetailsState.getMemberDetailsChange,
  tenantListChange: state.memberDetailsState.getTenantChangeDetails,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberManager);
