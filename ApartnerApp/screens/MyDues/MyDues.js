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
  Animated as ReactNativeAnimated,
} from 'react-native';
import {MainContainer, TopCardContainer} from '../../components/';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import member from '../../assets/images/member.png';
import DueItems from './components/dueItems';
import PaidItems from './components/paidItems';
import {
  getPaymentsDataOfUnitApi,
  getUnitsAndApartments,
} from './services/apartment-service';
import AsyncStorage from '@react-native-community/async-storage';

import {setSelectedDueInvoiceAction} from './actions/myDues-action';
import {Alert} from 'react-native';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;
const MyDues = ({
  navigation,
  setSelectedDueInvoice,
  loggedInUserData,
  selectedApartmentData,
  selectedUnitState,
  apartmentUnitsList,
  init,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(selectedUnitState);
  const [units, setUnits] = useState([]);
  const [duePaymentsList, setDuePaymentsList] = useState([]);
  const [paidPaymentsList, setPaidPaymentsList] = useState([]);
  const [invoicesTotalFigures, setInvoicesTotalFigures] = useState({});
  const [loadingPage, setLoadingPage] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(null);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  useEffect(() => {
    initializePage();
  }, [selectedUnit, init]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);
  const resetListStates = () => {
    setDuePaymentsList([]);
    setInvoicesTotalFigures([]);
    setPaidPaymentsList([]);
  };

  const initializePage = async () => {
    try {
      setLoadingPage(true);

      const paymentsList = await getPaymentsDataOfUnitApi({
        unitId: selectedUnit.apartment_unit_id,
        userId: loggedInUserData.user_id,
        complexId: selectedApartmentData.key,
      });
      if (
        paymentsList.data.body.duePaymentsData.statusCode != undefined &&
        paymentsList.data.body.duePaymentsData.statusCode === 401 &&
        paymentsList.data.body.paidPaymentsData.statusCode != undefined &&
        paymentsList.data.body.paidPaymentsData.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        resetListStates();
        setDuePaymentsList(paymentsList.data.body.duePaymentsData.dueInvoices);

        setInvoicesTotalFigures(
          paymentsList.data.body.duePaymentsData.totalFigures[0],
        );
        setPaidPaymentsList(paymentsList.data.body.paidPaymentsData);

        let neededData = {
          userId: loggedInUserData.user_id,
          complexId: selectedApartmentData.key,
        };
        const unitList = await getUnitsAndApartments(neededData);
        setUnits(unitList.data.body);
      }
    } catch (error) {
    } finally {
      setLoadingPage(false);
    }
  };

  const apartmentFacilityData = [
    {
      key: 1,
      fName: 'Nirmal',
      lName: 'Ranatunga',
      role: 'Tenant',
      img: member,
    },
    {
      key: 2,
      fName: 'Kanthi',
      lName: 'Ranatunga',
      role: 'Family member',
      img: member,
    },
    {
      key: 3,
      fName: 'Isuru',
      lName: 'Ranatunga',
      role: 'Family member',
      img: member,
    },
    {
      key: 4,
      fName: 'Isuru',
      lName: 'Ranatunga',
      role: 'Family member',
      img: member,
    },
  ];
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const unitHandler = unit => {
    setSelectedUnit(unit);
  };

  const getAllInvoicePaymentType = () => {
    if (selectedUnit.apartment_unit_id) {
      return 'all';
    } else {
      return 'due-all-units';
    }
  };

  const navigateToPaymentConfirm = () => {
    setSelectedDueInvoice({
      amount: invoicesTotalFigures.totalDue,
      type: getAllInvoicePaymentType(),
      unitName: invoicesTotalFigures.unit_name,
      unitId: selectedUnit.apartment_unit_id,
      invoiceDueDate: '',
    });
    navigation.navigate('PaymentVerification');
  };
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="My Dues"
      changeUnitState={false}>
      <TopCardContainer
        customHeight={
          Platform.OS === 'android' ? '88%' : height * 0.82 - statusBarHeight
        }>
        <View style={styles.topCardContainer}>
          <TouchableOpacity
            onPress={() => setVisibleBottomSheet(true)}
            style={styles.duesUpdateXBDropDown}>
            <Text style={styles.unitUpdateDropText}>
              {selectedUnit.unit_name ? selectedUnit.unit_name : 'All Units'}
            </Text>
            {visibleBottomSheet ? (
              <UpIcon height={10} width={10} />
            ) : (
              <DownIcon height={10} width={10} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.tabBox}>
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
                  Summary
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
                  History
                </Text>
              </TouchableOpacity>
            </View>
            {selectedTab === 1 ? (
              <>
                <View style={styles.tileContainer}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={duePaymentsList}
                    renderItem={item => {
                      if (item.item.invoice_id) {
                        return (
                          <DueItems navigation={navigation} items={item} />
                        );
                      }
                    }}
                  />
                </View>
                <View style={styles.bottomBtnContainer}>
                  <View style={styles.buttonRowContainer}>
                    <Button
                      containerStyle={styles.buttonContainerRight}
                      buttonStyle={
                        duePaymentsList && !duePaymentsList.length > 0
                          ? [
                              styles.buttonStyle,
                              {backgroundColor: 'transparent'},
                            ]
                          : [styles.buttonStyle, {backgroundColor: '#197B9A'}]
                      }
                      title={
                        invoicesTotalFigures.totalDue
                          ? `Pay Now (${invoicesTotalFigures.totalDue} LKR)`
                          : 'Pay Now'
                      }
                      titleStyle={styles.buttonText}
                      onPress={() => {
                        navigateToPaymentConfirm();
                      }}
                    />
                  </View>
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.tileContainer,
                    {height: height * 0.67, width: '100%'},
                  ]}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={apartmentFacilityData}
                    renderItem={item => {
                      if (item.item.invoice_id) {
                        return <PaidItems items={item} />;
                      }
                    }}
                  />
                </View>
              </>
            )}

            <LoadingDialogue visible={loadingPage} />
          </View>
        </View>
      </TopCardContainer>
      {visibleBottomSheet === true ? (
        <ChangeUnitBottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          unitHandler={unitHandler}
          unitList={apartmentUnitsList}
          bottomSheetHeight={Platform.OS === 'ios' && [250, 300, 0]}
        />
      ) : null}
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
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
  bottomContainer: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  tabBox: {
    height: Platform.OS === 'ios' ? '89%' : '88%',
    marginVertical: 10,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    backgroundColor: 'transparent',
  },
  tabButton: {
    flexDirection: 'row',
    height: 40,
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
    height: height * 0.46,
    width: '100%',
    backgroundColor: 'transparent',
  },
  itemTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnContainer: {
    marginTop: 5,
    paddingVertical: 5,
  },
  buttonRowContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainerRight: {
    width: '55%',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: '#197B9A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    height: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.02,
  },
  duesUpdateXBDropDown: {
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
  unitUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  selectedUnitState: state.apartmentState.selectedUnit,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  selectedApartmentData: state.apartmentState.seleletedApatment,
});

const mapDispatchToProps = dispatch => ({
  setSelectedDueInvoice: data => dispatch(setSelectedDueInvoiceAction(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyDues);
