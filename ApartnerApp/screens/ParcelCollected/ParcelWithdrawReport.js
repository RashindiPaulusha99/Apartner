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
  Alert,
  ScrollView,
  StatusBar,
  ImageBackground
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AddTenantContainer';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import {
  getParcelDetailsData,
  updateParcelDetailsData,
} from '../ParcelCollected/services/ParcelCollectedService';
import moment from 'moment';
import SignUpBg from '../../assets/images/AddBg.png';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';

const {width, height} = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight + (height * 0);

const ParcelWithdrawReport = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);
  const navigateToNotificationSettings = () => {
    navigation.navigate();
  };
  const [loadingParcelData, setLoadingParcelData] = useState(false);
  const [parcelDetailsList, setParcelDetailsList] = useState([]);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState('');

  useEffect(() => {
    initDataInPage();
  }, []);

    /**
   * <b>handler to display the popup notification according to the type</b>
   * @author Sandun M
   * @since 2021-06-21
   */
     const displayNotification = (type, message) => {
      setNotificationDisplayMessage(message);
      setShowNotification(type);

      if(type == "success"){
        setTimeout(() => {
          setLoadingParcelData(false);
          navigation.goBack();
        }, 2000);
      }else if(type == "error"){
        setLoadingParcelData(false);
      }
    };

  const initDataInPage = async () => {
    try {
      const dataParam = {
        parcelDetailsId: 1,
      };
      setLoadingParcelData(true);
      const parcelData = await getParcelDetailsData(dataParam);
      setLoadingParcelData(false);
      setParcelDetailsList(parcelData.data[0]);
    } catch (error) {
      setLoadingParcelData(false);
    }
  };

  const withdrawParcelReport = async () => {
    try {
      displayNotification(false, '');
      setLoadingParcelData(true);
      const savedata = {
        parcelDetailsId: parcelDetailsList.parcel_details_id,
        parcelDetailsRowId: parcelDetailsList.parcel_details_row_id,
        flag: 'collected',
      };
      const saveUpdatedParcel = await updateParcelDetailsData(savedata);
  
      if (saveUpdatedParcel.status == 200) {
        displayNotification('success', 'Report Withdrawn!');
      } else {
        displayNotification('error', 'Report Withdrawal Failed');
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground source={SignUpBg} style={styles.image}>
        {/* // blurRadius={blurRadius ? blurRadius : 12} */}
        <View
          style={[
            styles.overlay,
            // {shadowOpacity: {shadowOpacity: shadowOpacity && 0.8}},
          ]}>
          

          <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => height * 0.1,
        })()}>

        <SafeAreaView>

        <View style={styles.topCard}>
          <View style={styles.topRowContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.backBtnContainer}>
              <BackImage />
            </TouchableOpacity>
            <View>
              <View>
                <Text style={styles.mainTitle}>Parcel Acknowledgement</Text>
                <Text style={styles.mainTitleExplore}>
                  View Visitor Details
                </Text>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.bottomCardView}>
              <View style={styles.bottomCard}>
              <ScrollView style={{
                height : height * 0.6
              }}>
                {!loadingParcelData && (
                  <>
                    <View style={styles.cardHeaderView}>
                      <View style={styles.TopCardMainContainer}>
                        <View style={styles.topMain}>
                          <View style={styles.nameTextViewTop}>
                            <Text style={styles.nameText}>
                              Name of the courier
                            </Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {parcelDetailsList.courier_name}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity style={styles.courierCardView}>
                            <Text style={styles.ViewCourierText}>
                              View Courier
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>
                              Name of the Company
                            </Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {parcelDetailsList.company_name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>Delivery ID</Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {parcelDetailsList.delivery_id}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>
                              Date & Time of Arrival
                            </Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {moment(parcelDetailsList.datetime_arrival).format(
                              'MMMM D, YYYY ; hh.mm A',
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>
                              Date & Time of Collection
                            </Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {moment(
                              parcelDetailsList.datetime_collected,
                            ).format('MMMM D, YYYY ; hh.mm A')}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>Reported on</Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {moment(parcelDetailsList.recorded_date).format(
                              'MMMM D, YYYY ; hh.mm A',
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allTextTopCardNew}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>Collected by</Text>
                          </View>
                          <Text style={styles.textInputNameNew}>
                            {parcelDetailsList.collected_by}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.allCardNewNotes}>
                        <View style={styles.allTextTopCardNewView}>
                          <View style={styles.nameTextView}>
                            <Text style={styles.nameText}>
                              Additional Notes
                            </Text>
                          </View>
                          <Text style={styles.textParcelWas}>
                            {parcelDetailsList.additional_notes}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </>
                )}
                </ScrollView>
                <View style={styles.buttonView}>
                  <TouchableOpacity
                    onPress={withdrawParcelReport}
                    style={styles.buttonMainView}>
                    <Text style={styles.reportText}>Withdraw Report</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <LoadingDialogue
          visible={loadingParcelData}
        />

        </SafeAreaView>
      </KeyboardAvoidingView>
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}


        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    height: '100%',
    paddingTop: statusBarHeight,
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
    fontFamily: 'Poppins',
    fontSize: 26,
    color: '#004F71',
    marginTop: height * 0.02,
    fontWeight: 'bold',
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

  bottomCardView: {
    alignItems: 'center',
    marginTop: height * 0.005,
  },
  bottomCard: {
    width: 361,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height : (height * 0.8)
  },
  buttonMainView: {
    width: 336,
    height: 51,
    backgroundColor: '#707070',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
    flex: 1,
  },
  cardHeaderView: {
    flex: 8,
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
  textInputName: {
    width: 322,
    height: 37,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Poppins',
    padding: 10,
    fontWeight: 'bold',
  },
  allTextTopCard: {
    marginTop: height * 0.02,
  },
  nameTextView: {
    marginBottom: height * 0.008,
    marginTop: height * 0.008,
  },
  textInputNameNew: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  allTextTopCardNew: {
    width: 322,
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    marginTop: height * 0.02,
  },

  topMain: {
    width: '66%',
  },
  TopCardMainContainer: {
    width: 322,
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
    top: 26,
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
  allCardNewNotes: {
    width: 322,
    borderBottomWidth: 1,
    borderColor: '#EFECEC',
    marginTop: height * 0.02,
  },
  nameTextViewTop: {
    marginBottom: height * 0.005,
  },
  textParcelWas: {
    color: '#212322',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ParcelWithdrawReport;
