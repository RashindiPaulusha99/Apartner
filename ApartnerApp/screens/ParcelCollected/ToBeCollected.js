import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ImageBackground,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import BottomSheet from '../../components/containers/bottomSheet';
import OutlineIcon from '../../assets/images/circle-outline.svg';
import ReceiptSubmittedIcon from '../../assets/images/ReceiptSubmittedIcon.svg';
import SignUpBg from '../../assets/images/AddBg.png';
import {setParcelFlagUpdatedAction} from '../VisitorManager/actions/parcel-actions';
import {MainContainer} from '../../components/';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
const {width, height} = Dimensions.get('window');

const ToBeCollected = ({
  navigation,
  selectedParcel,
  updateParcelDataProps,
  selectedUnit,
  parcelDataList,
  loggedInUserData,
}) => {
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [openSuccessfulBottomSheet, setOpenSuccessfulBottomSheet] = useState(
    false,
  );
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    if (parcelDataList.updateParcelDataError && loadingPage) {
      setLoadingPage(false);
      displayNotification('error', 'Error Occurred');
    }
  }, [parcelDataList]);

  const vistorDetails = {
    otp: '1 8 0 6',
  };
  const visibilityHandler = status => {
    setOpenBottomSheet(status);
    displayNotification(false, '');
  };
  const visibilitySuccessfullHandler = status => {
    setOpenSuccessfulBottomSheet(status);
    displayNotification(false, '');
  };

  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);
  };
  const updateTobeCollectedData = flagType => {
    try {
      setLoadingPage(true);
      displayNotification(false, '');
      const dataparams = {
        parcelDetailsId: selectedParcel.parcel_details_id,
        flag: flagType,
        unitId: selectedParcel.unit_id,
        parcelDetailsRowId: selectedParcel.parcel_details_row_id,
        collectedBy: loggedInUserData.user_id,
        recordedBy: loggedInUserData.user_id,
      };

      updateParcelDataProps(dataparams, () => {
        displayNotification('succss', 'Parcel Collected');
        setOpenBottomSheet(false);
        setTimeout(() => {
          setLoadingPage(false);
          navigation.navigate('VisitorManager', {
            open: 'parcel',
          });
        }, 2000);
      });
    } catch (error) {
      setLoadingPage(false);
      displayNotification('error', 'Error Occurred');
    }
  };
  const navigateToBack = () => {
    navigation.navigate('VisitorManager');
  };

  const rejectCollected = () => (
    <View style={styles.rejectPopop}>
      <View style={styles.receiptSubmittedContainer}>
        <View style={styles.collectionView}>
          <OutlineIcon />
          <Text style={styles.parcelTextcon}> Parcel Collection Denied</Text>
        </View>
        <View style={styles.backBtnView}>
          <View style={styles.bottomSubContentView}>
            <Text style={styles.bottomSubContent}>
              You have requested to reject the collection of the parcal. Do you
              wish to continue ?
            </Text>
          </View>
          <View style={styles.continueBtn}>
            <TouchableOpacity
              onPress={() => {
                setOpenBottomSheet(false);
              }}
              // onPress={navigateToLoginInt}
              style={styles.backButtonContainer}>
              <Text style={styles.closeText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              disabled={loadingPage}
              style={styles.continueButtonContainer}>
              <Text style={styles.ContinueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <LoadingDialogue visible={loadingPage} />
    </View>
  );

  return (
    <MainContainer
      navigateToHome={() => navigation.goBack()}
      title="To Be Collected"
      subTitle="View Visitor Details"
      changeUnitState={false}>
      <View style={styles.bottomRowContainer}>
        <View style={styles.cardHeaderView}>
          <View style={styles.TopCardMainContainer}>
            <View style={styles.topMain}>
              <View style={styles.nameTextViewTop}>
                <Text style={styles.nameText}>Parcel Name</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcel.courier_name}
              </Text>
            </View>
          </View>
          <View style={styles.allTextTopCardNew}>
            <View style={styles.nameTextView}>
              <Text style={styles.nameText}>Date and time of arrival</Text>
            </View>
            <Text style={styles.textInputNameNew}>
              {moment(selectedParcel.datetime_arrival).format(
                'MMM DD, YYYY  h:mm A',
              )}
            </Text>
          </View>

          <View style={styles.allTextTopCardNew}>
            <View style={styles.nameTextView}>
              <Text style={styles.nameText}>Additional Note</Text>
            </View>
            <Text style={styles.textInputNameNew}>
              {selectedParcel.additional_notes}
            </Text>
          </View>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              setLoadingPage(true);
              navigation.navigate('VisitorManager', {
                open: 'parcel',
              });
            }}
            style={styles.buttonMainViewOk}>
            <Text style={styles.reportText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*----Bug Bash Disission -----  */}
      {/* <BottomSheet
        onVisible={openBottomSheet}
        visibilityHandler={visibilityHandler}
        children={rejectCollected}
        height={[350, 0]}
      /> */}
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      <LoadingDialogue visible={loadingPage} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    height: '89%',
  },
  topCard: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    height: '100%',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backBtnContainer: {
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
    width: 20,
  },
  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    marginTop: height * 0.02,
  },

  topRowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  mainTitleExplore: {
    fontSize: 12,
    color: '#89B2C4',
    fontFamily: 'Poppins-Bold',
  },

  bottomRowContainer: {
    width: '95%',
    flex: 1,
    backgroundColor: '#FFFFFFDD',
    marginHorizontal: 5,
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 10,
  },

  cardHeaderView: {
    alignItems: 'center',
  },

  reportText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  nameText: {
    fontSize: 12,
    color: '#9B9B9B',
    fontFamily: 'Poppins-Bold',
  },
  nameTextAditional: {
    color: '#212322',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  allTextTopCard: {
    marginTop: height * 0.02,
  },
  nameTextView: {
    marginVertical: height * 0.008,
  },
  textInputNameNew: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  allTextTopCardNew: {
    width: width * 0.8,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    marginTop: height * 0.02,
  },

  topMain: {
    width: '66%',
  },
  TopCardMainContainer: {
    width: width * 0.8,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    flexDirection: 'row',
    marginTop: height * 0.02,
  },
  courierCardView: {
    width: 110,
    height: 35,
    backgroundColor: '#197B9A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    top: 4,
  },
  ViewCourierText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  nameTextViewTop: {
    marginBottom: height * 0.005,
  },
  otpCard: {
    width: width * 0.8,
    backgroundColor: '#EEFAFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pleaseTetOtp: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    lineHeight: 14,
    color: '#197B9A',
  },

  OtpText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 36,
    color: '#212322',
    lineHeight: 41,
    letterSpacing: 20,
    marginBottom: height * 0.02,
  },
  rejectPopop: {
    backgroundColor: 'white',
    height: '100%',
  },
  collectionView: {
    flex: 1,
    backgroundColor: '#F68D2E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  successfulView: {
    flex: 1,
    backgroundColor: '#239D06',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backBtnView: {
    flex: 3,
  },
  backButtonContainer: {
    width: 126,
    height: 52,
    backgroundColor: '#C8C8C8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  parcelTextcon: {
    fontFamily: 'Poppins',
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  continueButtonContainer: {
    width: 195,
    height: 52,
    backgroundColor: '#197B9A',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#4D4D4D',
    fontWeight: 'bold',
  },
  ContinueText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomSubContent: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#212322',
    width: '75%',
    textAlign: 'center',
  },
  bottomSubContentView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.045,
  },
  receiptSubmittedContainer: {
    flex: 1,
  },
  buttonMainView: {
    width: '47.5%',
    height: 51,
    backgroundColor: '#F23B4E',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMainViewOk: {
    width: '47.5%',
    height: 51,
    backgroundColor: '#197B9A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedParcel: state.apartmentState.selectedParcel,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,
  parcelDataList: state.parcelState,
});

const mapDispatchToProps = dispatch => ({
  updateParcelDataProps: (payload, callback) =>
    dispatch(setParcelFlagUpdatedAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToBeCollected);
