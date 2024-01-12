import React, {useState, Component, useEffect, useRef} from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Keyboard,
  Modal,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {connect} from 'react-redux';

import {
  MainContainer,
  TopCardContainer,
  DefaultButtonPlainOutlined,
  DefaultButtonPlain,
} from '../../components/';

const {width, height} = Dimensions.get('window');

const FacilitiesMoreDetails = ({navigation}) => {
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

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Swimming Pool"
      changeUnitState={false}
      formContainer={false}>
      <>
        <TopCardContainer customHeight={height * 0.9 - statusBarHeight}>
          <View style={styles.mainContainer}>
            <View style={styles.detailsContainer}>
              <View style={styles.facilityRowContainer}>
                <Text style={styles.topicText}>Facility</Text>
                <Text style={styles.locationText}>Swimming Pool</Text>
              </View>
              <View style={styles.facilityRowContainer}>
                <Text style={styles.topicText}>Status</Text>
                <Text style={styles.statusText}>Confirmed</Text>
              </View>
              <View style={styles.facilityRowContainer}>
                <Text style={styles.topicText}>Confirmation Number</Text>
                <Text style={styles.confirmationNumberText}>CON19283</Text>
              </View>
              <View style={styles.checkedRowContainer}>
                <View style={styles.checkInContainer}>
                  <Text style={styles.topicText}>Check In</Text>
                  <Text style={styles.confirmationNumberText}>
                    10th September 2021{' '}
                  </Text>
                  <Text style={styles.confirmationNumberText}>4:00PM</Text>
                </View>
                <View style={styles.checkOutContainer}>
                  <Text style={styles.topicText}> Check Out </Text>
                  <Text style={styles.confirmationNumberText}>
                    10th September 2021{' '}
                  </Text>
                  <Text style={styles.confirmationNumberText}> 4:00PM </Text>
                </View>
              </View>
              <View style={styles.reservedRowContainer}>
                <Text style={styles.topicText}>Reserved For</Text>
                <Text style={styles.confirmationNumberText}> John Corner</Text>
              </View>
              <View style={styles.totalDueRowContainer}>
                <View>
                  <Text style={styles.dueText}>Total Due</Text>
                  <Text style={styles.dueValueText}>2,500 LKR </Text>
                </View>
              </View>
            </View>

            <View style={styles.buttonMainView}>
              <DefaultButtonPlainOutlined
                title="Cancel Booking"
                customStyle={{width: '50%'}}
              />
              <DefaultButtonPlain
                title="Pay Now"
                customStyle={{width: '35%'}}
              />
            </View>
          </View>
        </TopCardContainer>
      </>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '95%',
    justifyContent: 'space-between',
  },
  buttonMainView: {
    height: height * 0.1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,

    alignItems: 'center',
  },
  detailsContainer: {
    height: height * 0.6,

    paddingBottom: 25,
  },
  facilityRowContainer: {
    paddingBottom: 20,
  },
  topicText: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#26272C',
  },
  locationText: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: '#26272C',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#3ADB14',
  },
  confirmationNumberText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#26272C',
  },
  checkedRowContainer: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  checkInContainer: {
    width: '50%',
  },
  checkOutContainer: {
    width: '50%',
  },
  reservedRowContainer: {
    paddingBottom: 20,
  },
  totalDueRowContainer: {
    flexDirection: 'row',
  },
  dueText: {
    fontSize: 12,
    color: '#197B9A',
    fontFamily: 'Roboto-Medium',
  },
  dueValueText: {
    fontSize: 16,
    color: '#197B9A',
    fontFamily: 'Roboto-Bold',
  },
});

const mapStateToProps = state => ({
  unitsOfUser: state.apartmentState.apartmentUnits,
  memberListChange: state.memberDetailsState.getMemberDetailsChange,
});

const mapDispatchToProps = dispatch => ({
  memberStatusChange: payload => dispatch(changeMemberAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilitiesMoreDetails);
