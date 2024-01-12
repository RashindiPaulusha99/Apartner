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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {} from 'react-native-elements';
import {connect} from 'react-redux';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import {MainContainer} from '../../components/';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import MoreIcon from '../../assets/icons/new_ui/expand_more_black.png';

const {width, height} = Dimensions.get('window');

const PendingRequest = ({navigation, apartmentUnitsList, selectedUnit}) => {
  const [visibleCityBottomSheet, setVisibleCityBottomSheet] = useState(false);
  const [units, setUnits] = useState([]);

  const navigateToMyProfile = () => {
    navigation.navigate('Home');
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
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

  const myProfileTile = [
    {
      key: 1,
      Name: 'Nimal Ranathunga',
      Title: 'Added you as a member to',
      Unit: ' T2/22/C3, HavelockCity',
    },
    {
      key: 2,
      Name: 'Kanthi Dias',
      Title: 'Added you as a member to',
      Unit: 'T2/22/C3, HavelockCity',
    },
  ];

  const openTicketItem = ({item, i}) => (
    <View activeOpacity={1} key={i} style={styles.tileListingContainer}>
      <View style={styles.detailsView}>
        <Text style={styles.tileNameText}>{item.Name}</Text>
        <Text style={styles.tileTitleText}>{item.Title}</Text>
        <Text style={styles.tileUnitText}>{item.Unit}</Text>
      </View>
      <View style={styles.buttonMainView}>
        <TouchableOpacity style={styles.declineBtnView}>
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>

        <View style={styles.buttonMiddleView} />
        <TouchableOpacity style={styles.acceptBtnView}>
          <Text style={styles.acceptBtnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <TouchableWithoutFeedback onPress={() => onClose()}>
      <MainContainer
        navigateToHome={navigateToMyProfile}
        title="Pending Requests"
        changeUnitState={false}
        keyboardDissmissHandler={keyboardDissmissHandler}
        formContainer={true}>
        <>
          <View style={styles.tabBox}>
            <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
              <View style={styles.tileContainer}>
                <View
                  style={{
                    marginTop: 20,
                  }}
                />
                <View style={styles.dropDownMainView}>
                  <TouchableOpacity
                    onPress={() => setVisibleCityBottomSheet(true)}
                    style={styles.dropDownView}>
                    <Text style={styles.DropText}>
                      {selectedUnit && selectedUnit.unit_name !== null
                        ? selectedUnit.unit_name
                        : 'Havelock..'}
                    </Text>
                    <Image source={MoreIcon} style={styles.MoreIcon} />
                  </TouchableOpacity>
                </View>

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={myProfileTile}
                  renderItem={openTicketItem}
                />
              </View>
            </ScrollView>
          </View>
        </>
        <ChangeUnitBottomSheet
          onVisible={visibleCityBottomSheet}
          visibilityHandler={visibilityHandlerCity}
          unitHandler={unitHandler}
          unitList={units}
        />
      </MainContainer>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  tabBox: {
    flex: 1,
    backgroundColor: '#FFFFFFDD',
    marginHorizontal: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 10,
  },
  dropDownMainView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.02,
  },
  dropDownView: {
    width: width * 0.7,
    height: 30,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  DropText: {
    fontSize: 16,
    color: '#26272C',
    fontFamily: 'Roboto-Medium',
  },
  MoreIcon: {
    width: 25,
    height: 25,
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
    height: height * 0.23,
    width: width * 0.8,
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.025,
    justifyContent: 'space-between',
  },
  detailsView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tileNameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    lineHeight: 18,
    color: '#004F71',
  },
  tileTitleText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    lineHeight: 18,
    color: '#969696',
    marginTop: height * 0.001,
  },
  tileUnitText: {
    fontSize: 12,
    fontFamily: 'Roboto-Bold',
    lineHeight: 18,
    color: '#000000',
    marginTop: height * 0.001,
  },
  buttonMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnView: {
    flex: 2,
    width: width * 0.1,
    height: height * 0.06,
    backgroundColor: '#DD1C3A',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  declineBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  acceptBtnView: {
    flex: 2,
    width: width * 0.1,
    height: height * 0.06,
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  acceptBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  buttonMiddleView: {
    flex: 2,
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
  setUpdatedUserData: payload => dispatch(setUpdatedUserDataAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingRequest);
