import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  View,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import ApartmentSelectionForm from './components/apartmentSelectionForm';
import {
  setSelectedApartmentAction,
  setApartmentUnitAction,
  setSelectedUnitAction,
  getApartmentFacilityAction,
} from './actions/apartment-action';

import backImage from '../../assets/images/landing-backgound.png';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight + height * 0.05;

const ApartmentSelection = ({
  navigation,
  userApartments,
  setSelectedApartmentData,
  selectedApartment,
  loggedInUserData,
  getApartmentUnitsOfUser,
  setSelectedUnit,
  getApartmentFacilities,
}) => {
  const [loaderStatus, setLoaderStatus] = useState(false);

  useEffect(() => {
    userApartments.length !== 0
      ? setLoaderStatus(false)
      : setLoaderStatus(true);
  }, [userApartments]);

  const navigateToLandingScreen = apartment => {
    if (selectedApartment) {
      getApartmentUnitsOfUser(
        {
          userId: loggedInUserData.user_id,
          complexId: apartment.key,
        },
        firstUnitData => {
          setSelectedUnit(firstUnitData);
          setLoaderStatus(false);
          navigation.navigate('Home');
        },
      );
    }
  };

  const setApartmentHandler = selectedApartmentdata => {
    setLoaderStatus(true);
    getApartmentFacilities({
      selectedComplexId: selectedApartmentdata.key,
    });
    setSelectedApartmentData(selectedApartmentdata);
  };
  return (
    <ImageBackground
      source={backImage}
      imageStyle={styles.bgImage}
      style={styles.backgroundImageContainer}>
      <LinearGradientContainer
        colors={['#003471', '#03285258', '#80808033']}
        styles={styles.facilityImg}>
        <SafeAreaView style={styles.container}>
          <StatusBar
            translucent
            animated={true}
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View style={styles.mainContainer}>
            <View style={styles.complexContainer}>
              <ApartmentSelectionForm
                loggedInUserData={loggedInUserData}
                navigateToHome={navigateToLandingScreen}
                userApartments={userApartments}
                setSelectedApartmentData={setApartmentHandler}
                selectedApartment={selectedApartment}
                navigation={navigation}
              />
            </View>
          </View>
          <LoadingDialogue visible={loaderStatus} />
        </SafeAreaView>
      </LinearGradientContainer>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    marginTop: statusBarHeight,
  },
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bgImage: {
    resizeMode: 'stretch',
    height: height + StatusBar.currentHeight,
  },
  mainContainer: {
    flex: 1,
  },
  logoContainer: {
    paddingHorizontal: width * 0.05,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartment: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData,
  apartmentComplexSelectionPending:
    state.apartmentState.apartmentComplexSelectionPending,
});

const mapDispatchToProps = dispatch => ({
  setSelectedApartmentData: payload =>
    dispatch(setSelectedApartmentAction(payload)),
  getApartmentUnitsOfUser: (payload, successCallback) =>
    dispatch(setApartmentUnitAction(payload, successCallback)),
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  getApartmentFacilities: payload =>
    dispatch(getApartmentFacilityAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApartmentSelection);
