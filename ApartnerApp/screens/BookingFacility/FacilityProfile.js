import React, {useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
} from './actions/booking-facility-action';

import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
import {MainContainer} from '../../components/';
import {ScrollView as Scroller} from 'react-native-gesture-handler';
import moment from 'moment';

const {width, height} = Dimensions.get('window');
const FacilityProfile = ({navigation, selectedBookingFacility}) => {
  const [selectedBackgroundImgData, setSelectedBackgroundImgData] = useState(
    selectedBookingFacility.images[0],
  );

  const navigateToHome = () => {
    navigation.goBack();
  };

  const selectedFacilityHandler = value => {
    setSelectedBackgroundImgData(value);
  };
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title={selectedBookingFacility.location_name}
      changeUnitState={false}
      formContainer={false}>
      <View style={styles.mainContainer}>
        <View style={styles.middleContainer}>
          {selectedBookingFacility.images.length > 0 ? (
            <ImageBackground
              source={{uri: selectedBackgroundImgData.imageUrl}}
              style={styles.mainImageContainer}
              imageStyle={styles.facilityImg}>
              <LinearGradientContainer
                colors={['#FFFFFF00', '#EBEBEB17', '#407992C0', '#004F71']}
                styles={styles.linearMainImageContainer}
              />
            </ImageBackground>
          ) : (
            <View style={styles.noImageDiv}>
              <Text style={styles.contentText}>No images available</Text>
            </View>
          )}

          {selectedBookingFacility.images.length > 0 && (
            <View style={styles.sliderContainer}>
              <Scroller
                bounces={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                nestedScrollEnabled>
                {selectedBackgroundImgData &&
                  selectedBookingFacility.images.map((item, i) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => selectedFacilityHandler(item)}
                      key={i}
                      style={styles.selectFacilityContainerField}>
                      <ImageBackground
                        source={{
                          uri: item.imageUrl,
                        }}
                        style={styles.facilityImgContainer}
                        imageStyle={styles.sliderImg}>
                        <View
                          style={[
                            styles.sliderOverlayContainer,
                            selectedBackgroundImgData.recreational_location_images_row_id ===
                              item.recreational_location_images_row_id && {
                              backgroundColor: 'transparent',
                            },
                          ]}
                        />
                      </ImageBackground>
                    </TouchableOpacity>
                  ))}
              </Scroller>
            </View>
          )}
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={styles.middleMainContainer}>
              <View style={styles.firstRowContainer}>
                <View style={styles.firstRowMainContainer}>
                  <Text style={styles.subTitleContentText}>Hourly Rate</Text>
                  <Text style={styles.subTitleContentValueText}>
                    LKR{' '}
                    {selectedBookingFacility.cost_per_hour &&
                      selectedBookingFacility.cost_per_hour}
                  </Text>
                </View>
                <View style={styles.firstRowMainContainer}>
                  <Text style={styles.subTitleContentText}>Capacity</Text>
                  <Text style={styles.subTitleContentValueText}>
                    {selectedBookingFacility.capacity &&
                      selectedBookingFacility.capacity}
                  </Text>
                </View>
              </View>
              <View style={styles.firstRowContainer}>
                <View style={[styles.firstRowMainContainer, {width: '100%'}]}>
                  <Text style={styles.subTitleContentText}>
                    Maximum Hours Per Booking
                  </Text>
                  <Text style={styles.subTitleContentValueText}>
                    {selectedBookingFacility.maximum_hours_per_booking &&
                      selectedBookingFacility.maximum_hours_per_booking}
                  </Text>
                </View>
              </View>
              <View style={styles.firstRowContainer}>
                <View style={[styles.firstRowMainContainer, {width: '100%'}]}>
                  <Text style={styles.subTitleContentText}>
                    Booking Availability
                  </Text>

                  {selectedBookingFacility.availability &&
                  selectedBookingFacility.availability.length > 0 ? (
                    selectedBookingFacility.availability.map((slots, id) => (
                      <View style={styles.availabilityTimeSlotRow}>
                      <View style={styles.availabilityTimeSlot}>
                        <Text style={styles.availabilityTimeSlotText}>
                          {moment(slots.from_date_time).format('YY-MMM-DD')}{' '}
                          {moment(slots.from_time).format('hh:mm A')}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.availabilityTimeSlotText,
                          {marginHorizontal: 10},
                        ]}>
                        To
                      </Text>
                      <View style={styles.availabilityTimeSlot}>
                        <Text style={styles.availabilityTimeSlotText}>
                          {moment(slots.to_date_time).format('YY-MMM-DD')}{' '}
                          {moment(slots.to_time).format('hh:mm A')}
                        </Text>
                      </View>
                    </View>
                    ))
                  ) : (
                    <Text style={styles.descriptionValueText}>
                      No available slots
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.firstRowContainer}>
                <View style={styles.descriptionRowMainContainer}>
                  <Text style={styles.descriptionHeaderText}>Description</Text>
                  <Text style={styles.descriptionValueText}>
                    {selectedBookingFacility.description &&
                      selectedBookingFacility.description}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.bottomContainer}>
          <LinearGradientContainer
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0)', '#ffffff']}
            styles={styles.linearContainer}
          />
          <View style={styles.buttonRowContainer}>
            <Button
              onPress={() => navigation.navigate('FacilityBookingCalendar')}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              title="Book Now"
              titleStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: '90%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFFE6',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  middleContainer: {
    height: height * 0.73,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  mainImageContainer: {
    width: width * 0.9,
    borderRadius: 20,
    justifyContent: 'center',
    height: height * 0.5,
  },
  noImageDiv: {
    width: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4,
    borderRadius: 20,
    backgroundColor: '#E2E2E2',
  },

  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    height: height * 0.5,
  },
  linearMainImageContainer: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderRadius: 20,
    height: height * 0.5,
  },

  middleMainContainer: {
    flexDirection: 'column',
    width: width * 0.9,
    marginHorizontal: 5,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.03,
  },
  firstRowContainer: {
    marginVertical: height * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  firstRowMainContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '40%',
  },

  descriptionRowMainContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  subTitleContentText: {
    color: '#26272C',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 26,
  },
  descriptionHeaderText: {
    color: '#9B9B9B',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 26,
  },
  subTitleContentValueText: {
    color: '#26272C',
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    lineHeight: 26,
  },
  descriptionValueText: {
    color: '#26272C',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    lineHeight: 26,
  },
  availabilityTimeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(198,198,198,0.9)',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    paddingBottom: 2,
    width: '100%',
  },
  availabilityTimeSlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  availabilityTimeSlotText: {
    color: '#26272C',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  contentText: {
    color: '#212322',
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    lineHeight: 18,
  },
  secondRowContainer: {
    marginBottom: 5,
  },
  descTitle: {
    color: '#9B9B9B',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  sliderContainer: {
    width: width * 0.85,
    alignItems: 'center',
    borderStyle: 'solid',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    paddingVertical: 15,
    marginTop: -height * 0.1,
    height: 90,
  },
  selectFacilityContainerField: {
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 20,
    width: 70,
    marginHorizontal: 5,
  },

  facilityImgContainer: {
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  sliderImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  sliderOverlayContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.38)',
    borderRadius: 20,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    marginTop: -height * 0.05,
    paddingBottom: 20,
  },
  linearContainer: {
    width: '100%',
    height: height * 0.035,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRowContainer: {
    paddingHorizontal: width * 0.05,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    width: '100%',
    paddingTop: 10,
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: '#0E9CC9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    height: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
  selectedBookingFacility: state.bookingFacilityState.selectedBookingFacility,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),
  getApartmentUnitsOfUser: payload => dispatch(setApartmentUnitAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FacilityProfile);
