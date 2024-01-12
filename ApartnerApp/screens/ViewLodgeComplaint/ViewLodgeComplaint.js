import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Overlay, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {MainContainer, TopCardContainer} from '../../components';
import RightIcone from '../../assets/images/check.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from './actions/apartment-action';
import configConstants from '../../config/constants';
import moment from 'moment';
function getServerAddress() {
  return configConstants.apiUrlWithPort;
}
const {width, height} = Dimensions.get('window');
const LodgeComplaint = ({navigation, selectedTicketData}) => {
  const [spinner, setSpinner] = useState(false);

  const navigateToHome = () => {
    navigation.goBack();
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };

  const {
    ticket_description,
    ticket_priority,
    ticket_image,
    ticket_status,
    recorded_date,
    ticket_type,
    related_status,
  } = selectedTicketData;

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="View Lodge Complaint"
      subTitle="Add frequent or one-time visitors"
      keyboardDissmissHandler={keyboardDissmissHandler}
      changeUnitState={false}
      formContainer={true}>
      <TopCardContainer>
        <View style={styles.mainDetailContainer}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            keyboardOpeningTime={0}>
            <View style={styles.scroll} onStartShouldSetResponder={() => true}>
              <ScrollView>
                <View style={styles.mainDetailContentContainer}>
                  <View style={styles.mainCheckBoxContainer}>
                    <View style={styles.unitNameContainer}>
                      <Text style={styles.textTopContainer}>Unit Related</Text>
                      <TouchableOpacity
                        disabled={true}
                        style={styles.iconCheckBoxContainer}>
                        {related_status === 'unit' ? (
                          <Image source={RightIcone} />
                        ) : (
                          <Text />
                        )}
                      </TouchableOpacity>
                    </View>
                    <View style={styles.commonNameContainer}>
                      <Text style={styles.textTopContainer}>
                        Common Area Related
                      </Text>
                      <TouchableOpacity
                        disabled={true}
                        style={styles.iconCheckBoxContainer}>
                        {related_status === 'common' ? (
                          <Image source={RightIcone} />
                        ) : (
                          <Text />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.contentMainContainer}>
                    <Text style={styles.mainAllTittleContainer}>
                      Compliant Type :
                    </Text>
                    <TouchableOpacity style={styles.bottomSheetRelationshipBtn}>
                      <Text style={styles.residentUnitText}>{ticket_type}</Text>

                      <DownIcon height={10} width={10} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.contentMainContainer}>
                    <Text style={styles.mainAllTittleContainer}>
                      Priority Level :
                    </Text>

                    <TouchableOpacity style={styles.bottomSheetRelationshipBtn}>
                      <Text style={styles.residentUnitText}>
                        {ticket_priority}
                      </Text>

                      <DownIcon height={10} width={10} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.contentMainContainerImage}>
                    <Text style={styles.mainAllTittleContainer}>
                      Attachments :
                    </Text>
                    <View style={styles.descriptionDetailContainer}>
                      {ticket_image ? (
                        <Image
                          style={styles.imageContainer}
                          source={{
                            uri: `${getServerAddress()}/api/v1/assets/getAsset?filePath=${ticket_image}`,
                          }}
                        />
                      ) : (
                        <Text style={styles.residentUnitTextPlus} />
                      )}
                    </View>
                  </View>

                  <View style={styles.contentMainContainer}>
                    <Text style={styles.mainAllTittleContainer}>
                      Description :
                    </Text>
                    <Text style={styles.residentUnitText}>
                      {ticket_description}
                    </Text>
                  </View>
                  <View style={styles.contentMainContainer}>
                    <Text style={styles.mainAllTittleContainer}>
                      Recorded Date :
                    </Text>
                    <Text style={styles.residentUnitText}>
                      {moment(recorded_date).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TopCardContainer>

      <Overlay
        overlayStyle={{
          backgroundColor: 'transparent',
          padding: 0,
          marginTop: 0,
          justifyContent: 'center',
        }}
        fullScreen={true}
        backdropStyle={{backgroundColor: 'transparent'}}
        isVisible={spinner}>
        <ActivityIndicator size="large" color="#0E9CC9" />
      </Overlay>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  descriptionDetailContainer: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#212322',
    flex: 2,
  },
  mainDetailContentContainer: {
    paddingHorizontal: width * 0.05,
  },

  mainDetailContainer: {
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  iconCheckBoxContainer: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCheckBoxContainer: {
    flexDirection: 'row',
    marginTop: height * 0.03,
  },
  unitNameContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.06,
  },
  commonNameContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTopContainer: {
    fontSize: 14,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Medium',
  },
  residentUnitText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 21,
    color: '#212322',
  },
  mainAllTittleContainer: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    color: '#9B9B9B',
    marginBottom: 5,
  },
  contentMainContainer: {
    marginTop: height * 0.02,
  },
  contentMainContainerImage: {
    marginTop: height * 0.03,
  },
  imageContainer: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },

  residentUnitTextPlus: {
    fontSize: 30,
  },
  scroll: {
    height: '100%',
  },
  bottomSheetRelationshipBtn: {
    height: 30,
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#F5F7FD',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#84C7DD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  selectedTicketData: state.ticketState.currentTicketDetails,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),

  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LodgeComplaint);
