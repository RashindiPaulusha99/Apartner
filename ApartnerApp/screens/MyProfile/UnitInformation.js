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
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import DropDown from '../../assets/images/expand_more_black_24dp.svg';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import bgImage from '../../assets/images/myprofile-backgound.png';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {setSelectedUnitAction} from '../Apartment/actions/apartment-action';
import ChangeCityBottomSheet from '../../components/containers/ChangeCityBottomSheet';
import {getApartmentUnitsRelationsShipOfUser} from '../MyProfile/services/unitNotification-services';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import ScreenHeader from '../../components/header/apartnerScreenHeaderV2';
import {MainContainer} from '../../components/';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;
const UnitInformation = ({
  navigation,
  loggedInUserData,
  apartmentFacilityDataItems,
  selectedApartmentData,
  apartmentUnitsList,
  setSelectedUnit,
  selectedUnit,
}) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const [units, setUnits] = useState([]);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [visibleCityBottomSheet, setVisibleCityBottomSheet] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initDataInPage();
  }, []);
  const initDataInPage = async () => {
    setIsLoading(true);
    const dataParam = {
      userId: loggedInUserData.user_id,
      complexId: selectedApartmentData.key,
    };
    const getData = await getApartmentUnitsRelationsShipOfUser(dataParam);
    setUnitList(getData.data.body);
    setIsLoading(false);
  };

  const navigateToHome = () => {
    navigation.navigate('MyProfile');
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const visibilityHandlerCity = status => {
    setVisibleCityBottomSheet(status);
  };

  const initializePage = async () => {
    setUnits(apartmentUnitsList);
  };
  useEffect(() => {
    initializePage();
  }, []);

  const unitHandler = unit => {
    setSelectedUnit(unit);
  };

  const onClose = () => {
    onCloseWithButtonClick();
    visibilityHandler();
  };

  const onCloseWithButtonClick = () => {
    return true;
  };

  const ButtonPressable = props => {
    return (
      <View>
        <View>{props.svg ? <props.svg /> : null}</View>
      </View>
    );
  };

  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };
  const TopRowContainer = () => {
    return (
      <ScreenHeader
        headerName="Unit Information"
        navigateToBack={navigateToHome}
      />
    );
  };
  const openTicketItem = ({item, i}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={i}
      style={styles.tileListingContainer}>
      <View style={styles.mainContainerD}>
        <View style={styles.tileLeftSide}>
          <Text style={styles.tileNameText}>{item.unit_name}</Text>

          <View style={styles.secondTileNameMainView}>
            <Text style={styles.tileNameRelationshipText}>{item.name}</Text>
          </View>

          <ButtonPressable svg={item.image} />
        </View>
      </View>
      <View style={styles.tileRightBlock}>
        <Text style={styles.tileNameText}>{item.block_name}</Text>
      </View>

      <View style={styles.tileRightSide}>
        <ButtonPressable svg={item.imagePrimary} />
        <Text style={styles.defaultNameText}>{item.titleDefault}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <>
      <MainContainer
        navigateToHome={navigateToHome}
        title="Unit Information"
        changeUnitState={false}
        keyboardDissmissHandler={keyboardDissmissHandler}
        formContainer={true}>
        <View style={styles.tabBox}>
          <View style={styles.topCardContainer}>
            <TouchableOpacity
              onPress={() => setVisibleCityBottomSheet(true)}
              style={styles.gateUpdateXBDropDown}>
              <Text style={styles.gateUpdateDropText}>
                {selectedUnit && selectedUnit.unit_name !== null
                  ? selectedUnit.unit_name
                  : 'Havelock..'}
              </Text>
              {visibleCityBottomSheet ? (
                <UpIcon height={10} width={10} />
              ) : (
                <DownIcon height={10} width={10} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.tileContainer}>
            <View style={styles.detailContainer}>
              <View style={styles.detailContainerCommunity}>
                <Text style={styles.titleCommunity}>Community</Text>

                {/* ---As requsted to hide this from the bugs excel sheet --- */}
                {/* <TouchableOpacity onPress={() => setVisibleBottomSheet(true)}>
                  <Text style={styles.titleset}>Set Default Unit</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.titleHavelock}>
                {selectedApartmentData.label}
              </Text>
            </View>
            {/* --- IN BUG BASH --- */}
            {/* <View style={styles.detailContainerBlueBg}>
              <View style={styles.detailContainerMember}>
                <Text style={styles.titleMember}>
                  Member of the Management Council
                </Text>
                <Text style={styles.titleSecuretary}>Secretary</Text>
              </View>
            </View> */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={unitList}
              renderItem={openTicketItem}
              keyExtractor={item => item.recreational_location_id}
            />
          </View>
        </View>

        <LoadingDialogue visible={isLoading} />
      </MainContainer>
      {visibleCityBottomSheet === true ? (
        <ChangeUnitBottomSheet
          onVisible={visibleCityBottomSheet}
          visibilityHandler={visibilityHandlerCity}
          unitHandler={unitHandler}
          unitList={units}
          bottomSheetHeight={Platform.OS === 'ios' && [250, 300, 0]}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: statusBarHeight,
  },
  bgImageStyle: {
    resizeMode: 'stretch',
    height: height + StatusBar.currentHeight,
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
    flex: 1,
    alignItems: 'center',
  },
  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
    left: width * 0.05,
  },
  apartnerTextContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },
  mainHeaderText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
  },

  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.09,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    width: width,
    backgroundColor: '#FFFFFF',
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  subTitleContentText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
  },

  image: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  tabBox: {
    width: '95%',
    backgroundColor: 'rgba(255,255,255, 0.8)',
    height: Platform.OS === 'ios' ? '92%' : '89%',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  tileContainer: {
    height: height * 0.62,
  },
  detailContainer: {
    marginHorizontal: width * 0.04,
  },

  tileListingContainer: {
    marginHorizontal: width * 0.04,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    height: height * 0.12,
    flexDirection: 'row',
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    justifyContent: 'space-between',
  },
  tileLeftSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainContainerD: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },

  tileRightSide: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tileNameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
  },
  tileRightBlock: {
    flex: 2,
    justifyContent: 'center',
    flexDirection: 'row',

    marginTop: 26,
  },
  tileNameRelationshipText: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
  },
  secondTileNameMainView: {
    paddingHorizontal: 10,
    backgroundColor: '#069D8E',
    borderRadius: 12,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  detailContainerCommunity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCommunity: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#4D4D4D',
  },
  titleHavelock: {
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: '#197B9A',
  },
  titleset: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#004F71',
    textDecorationLine: 'underline',
  },
  detailContainerMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.04,
  },
  detailContainerBlueBg: {
    height: 35,
    backgroundColor: '#EEFAFF',
    justifyContent: 'center',
  },
  titleMember: {
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
    color: '#212322',
  },
  titleSecuretary: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
  },
  gateUpdateXBDropDown: {
    width: '85%',
    height: height * 0.042,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  gateUpdateDropText: {
    fontSize: 16,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },

  defaultNameText: {
    fontSize: 12,
    color: '#239D06',
    fontFamily: 'Roboto-Regular',
  },
  topCardContainer: {
    marginHorizontal: width * 0.04,
    marginVertical: height * 0.04,
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedUnit: state.apartmentState.selectedUnit,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitInformation);
