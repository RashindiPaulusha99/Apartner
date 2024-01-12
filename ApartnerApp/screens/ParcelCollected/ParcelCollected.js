import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {setParcelFlagUpdatedAction} from '../VisitorManager/actions/parcel-actions';
import {MainContainer, TopCardContainer} from '../../components/';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import moment from 'moment';

const {width, height} = Dimensions.get('window');

const ParcelCollected = ({
  navigation,
  selectedParcelData,
  selectedUnit,
  updateParcelDataProps,
  parcelDataList,
  loggedInUserData,
}) => {
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [showNotification, setShowNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);

    if (type == 'success') {
      setTimeout(() => {
        setIsLoading(false);
        updateParcelDataProps(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setIsLoading(false);
      updateParcelDataProps(false);
    }
  };

  const saveUpdatedParcelData = status => {
    setIsLoading(true);
    const dataparams = {
      parcelDetailsId: selectedParcelData.parcel_details_id,
      flag: status,
      unitId: selectedParcelData.unit_id,
      parcelDetailsRowId: selectedParcelData.parcel_details_row_id,
      recordedBy: loggedInUserData.user_id,
    };
    updateParcelDataProps(dataparams, () => {
      if (status === 'collected') {
        displayNotification('success', 'Withdrawal Report Successfully');
      } else {
        displayNotification('success', 'Reported Successfully');
      }
    });
  };

  return (
    <MainContainer
      navigateToHome={() => navigation.goBack()}
      title="Parcel Collected"
      subTitle="View Parcel Details"
      changeUnitState={false}>
      <TopCardContainer>
        <View style={styles.bottomCard}>
          <View style={styles.cardHeaderView}>
            <View style={styles.TopCardMainContainer}>
              <View style={styles.topMain}>
                <View style={styles.nameTextViewTop}>
                  <Text style={styles.nameText}>Parcel Name</Text>
                </View>
                <Text style={styles.textInputNameNew}>
                  {selectedParcelData.courier_name}
                </Text>
              </View>
            </View>

            {/* bug bash(future development) */}
            {/* <View style={styles.allTextTopCardNew}>
              <View style={styles.nameTextView}>
                <Text style={styles.nameText}>Delivery ID</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcelData.delivery_id}
              </Text>
            </View> */}
            <View style={styles.allTextTopCardNew}>
              <View style={styles.nameTextView}>
                <Text style={styles.nameText}>Date & Time of Arrival</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcelData.datetime_arrival
                  ? moment(selectedParcelData.datetime_arrival).format(
                      'MMM DD, YYYY; h:mm A',
                    )
                  : ''}
              </Text>
            </View>
            <View style={styles.allTextTopCardNew}>
              <View style={styles.nameTextView}>
                <Text style={styles.nameText}>Date & Time of Collection</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcelData.datetime_collected
                  ? moment(selectedParcelData.datetime_collected).format(
                      'MMM DD, YYYY; h:mm A',
                    )
                  : ''}
              </Text>
            </View>
            <View style={styles.allTextTopCardNew}>
              <View style={styles.nameTextView}>
                <Text style={styles.nameText}>Collected by</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcelData.collected_by}
              </Text>
            </View>
            <View style={styles.allTextTopCardNew}>
              <View style={styles.nameTextView}>
                <Text style={styles.nameText}>Additional Notes</Text>
              </View>
              <Text style={styles.textInputNameNew}>
                {selectedParcelData.additional_notes}
              </Text>
            </View>
          </View>
          {/* bug bash(future development) */}
          {/* <View style={styles.buttonView}>
            {selectedParcelData.flag === 'reported' ? (
              <TouchableOpacity
                style={[styles.buttonMainView, {backgroundColor: '#999999'}]}
                onPress={() => saveUpdatedParcelData('collected')}>
                <Text style={styles.reportText}>Withdrawal Report</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonMainView}
                onPress={() => saveUpdatedParcelData('reported')}>
                <Text style={styles.reportText}>Report</Text>
              </TouchableOpacity>
            )}
          </View> */}
        </View>
      </TopCardContainer>
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      <LoadingDialogue visible={isLoading} />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  topRowContainer: {
    flexDirection: 'row',
    width: width * 0.9,
  },
  backBtnContainer: {
    width: 20,
    marginTop: 2,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 26,
    color: '#004F71',
    fontWeight: 'bold',
    lineHeight: 28,
  },

  mainTitleExplore: {
    fontSize: 12,
    color: '#89B2C4',
    fontFamily: 'Poppins-Bold',
  },

  bottomCard: {
    justifyContent: 'space-between',
    height: '100%',
    width: '90%',
  },
  buttonMainView: {
    width: '100%',
    height: 51,
    backgroundColor: '#F23B4E',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#9B9B9B',
    marginTop: height * 0.02,
  },

  topMain: {
    width: '66%',
  },
  TopCardMainContainer: {
    width: '100%',
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
});

const mapStateToProps = state => ({
  selectedParcelData: state.apartmentState.selectedParcel,
  selectedUnit: state.apartmentState.selectedUnit,
  parcelDataList: state.parcelState,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  updateParcelDataProps: (payload, callback) =>
    dispatch(setParcelFlagUpdatedAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ParcelCollected);
