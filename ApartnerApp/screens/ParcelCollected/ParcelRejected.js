import React, {useEffect, useState} from 'react';
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
  ScrollView,
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AddTenantContainer';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import {
  getParcelDetailsData,
  updateParcelDetailsData,
} from '../ParcelCollected/services/ParcelCollectedService';
import {Alert} from 'react-native';
import {MainContainer} from '../../components/';
const {width, height} = Dimensions.get('window');

const ParcelCollected = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);
  const navigateToNotificationSettings = () => {
    navigation.navigate();
  };

  const [parcelDetailsList, setParcelDetailsList] = useState([]);

  useEffect(() => {
    initDataInPage();
  }, []);

  const initDataInPage = async () => {
    const dataParam = {parcelDetailsId: 1};
    const getData = await getParcelDetailsData(dataParam);

    setParcelDetailsList(getData.data[0][0]);
  };

  const saveUpdatedParcelData = async () => {
    const savedata = {
      parcelDetailsId: 1,
      flag: 'collected',
    };
    const saveUpdatedParcel = await updateParcelDetailsData(savedata);

    if (saveUpdatedParcel.status == 200) {
      Alert.alert('', 'Parcel Rejected Successfully');
    } else {
      Alert.alert('', 'Error');
    }
  };
  const navigateToBack = () => {
    navigation.navigate('VisitorManager');
  };
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Parcel Rejected"
      subTitle="View Parcel Details"
      changeUnitState={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => height * 0.1,
        })()}>
        <View style={styles.bottomCardView}>
          <View style={styles.bottomCard}>
            <View style={styles.cardHeaderView}>
              <View
                style={styles.scroll}
                onStartShouldSetResponder={() => true}>
                <ScrollView keyboardDismissMode="on-drag" style={{flex: 1}}>
                  <View style={styles.TopCardMainContainer}>
                    <View style={styles.topMain}>
                      <View style={styles.nameTextViewTop}>
                        <Text style={styles.nameText}>Name of the courier</Text>
                      </View>
                      <Text style={styles.textInputNameNew}>
                        {parcelDetailsList && parcelDetailsList.courier_name}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity style={styles.courierCardView}>
                        <Text style={styles.ViewCourierText}>View Courier</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.allTextTopCardNew}>
                    <View style={styles.allTextTopCardNewView}>
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Name of the Company</Text>
                      </View>
                      <Text style={styles.textInputNameNew}>
                        {parcelDetailsList && parcelDetailsList.company_name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.allTextTopCardNew}>
                    <View style={styles.allTextTopCardNewView}>
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Delivery ID</Text>
                      </View>
                      <Text style={styles.textInputNameNew}>
                        {parcelDetailsList && parcelDetailsList.delivery_id}
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
                        {parcelDetailsList &&
                          parcelDetailsList.datetime_arrival}
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
                        {parcelDetailsList &&
                          parcelDetailsList.datetime_collected}{' '}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.allTextTopCardNew}>
                    <View style={styles.allTextTopCardNewView}>
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Collected by</Text>
                      </View>
                      <Text style={styles.textInputNameNew}>
                        {parcelDetailsList && parcelDetailsList.collected_by}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.allTextTopCardNew}>
                    <View style={styles.allTextTopCardNewView}>
                      <View style={styles.nameTextView}>
                        <Text style={styles.nameText}>Additional Notes</Text>
                      </View>
                      <Text style={styles.textInputNameNew}>
                        {parcelDetailsList &&
                          parcelDetailsList.additional_notes}
                      </Text>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.buttonMainView}
                onPress={saveUpdatedParcelData}>
                <Text style={styles.reportText}>Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
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
  },
  bottomCard: {
    width: width * 0.9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    height: height * 0.84,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  buttonMainView: {
    width: 336,
    height: 51,
    backgroundColor: '#F23B4E',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
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
    width: '95%',
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    flexDirection: 'row',
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
  scroll: {
    height: height * 0.7,
  },
});

export default ParcelCollected;
