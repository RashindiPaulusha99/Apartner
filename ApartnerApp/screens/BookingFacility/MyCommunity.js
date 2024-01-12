import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {MainContainer} from '../../components/';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
import ArrowForward from '../../assets/images/ic_arrow_forward_24px.svg';
import BackgroundImage from '../../assets/images/my-profile-background.png';
import {getCommunityData} from './services/apartment-service';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
const {width, height} = Dimensions.get('window');

const MyCommunity = ({navigation, selectedApartmentData}) => {
  const [selectedFacility, setSelectedFacility] = useState('Tennis Courts');
  const [imagePath, setImagePath] = useState({uri: selectedApartmentData.img});
  const [complexName, setComplexName] = useState();
  const [address, setAddress] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [managementCompany, setManagementCompany] = useState();
  const [profilePicture, setProfilePicture] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigateToBack = () => {
    navigation.goBack();
  };
  const navigateToManagementCouncil = () => {
    navigation.navigate('ManagementCouncil');
  };
  useEffect(() => {
    initDataInPage();
  }, [selectedApartmentData]);

  const initDataInPage = async () => {
    setIsLoading(true);
    const dataParam = {
      complexId: selectedApartmentData.key,
    };
    const getProfileData = await getCommunityData(dataParam);
    setComplexName(getProfileData.data.body.dataList[0].complex_name);
    setAddress(getProfileData.data.body.dataList[0].complex_address);
    setPhoneNumber(getProfileData.data.body.dataList[0].phone_number);
    setEmail(getProfileData.data.body.dataList[0].email);
    setManagementCompany(
      getProfileData.data.body.dataList[0].management_company,
    );
    if (getProfileData.data.body.dataList[0].profile_pic) {
      setProfilePicture(getProfileData.data.body.dataList[0].imageUrl);
    }
    setIsLoading(false);
  };

  const selectedFacilityHandler = value => {
    setSelectedFacility(value.catagory);
    setImagePath(value.img);
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
  };
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="My Community"
      subTitle=""
      changeUnitState={false}
      keyboardDissmissHandler={keyboardDissmissHandler}
      formContainer={false}
      newHeader={true}
      backgroundImage={BackgroundImage}
      lineargradientStatus={true}>
      <View style={styles.mainContainer}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <View style={styles.middleContainer}>
            <ImageBackground
              source={imagePath}
              style={styles.mainImageContainer}
              imageStyle={styles.facilityImg}>
              <LinearGradientContainer
                colors={['transparent', 'transparent', '#004F71']}
                styles={styles.linearMainImageContainer}
              />
            </ImageBackground>
            <LoadingDialogue visible={isLoading} />

            <View style={styles.middleMainContainer}>
              <View style={styles.mainTextContainer}>
                <View style={styles.subTextContainer}>
                  <Text style={styles.textTopContainer}>Address</Text>
                  <Text style={styles.textBottomContainer}>{address}</Text>
                </View>
                <View style={styles.subTextContainer}>
                  <Text style={styles.textTopContainer}>Contact No.</Text>
                  <Text style={styles.textBottomContainer}>{phoneNumber}</Text>
                </View>
                <View style={styles.subTextContainer}>
                  <Text style={styles.textTopContainer}>Email</Text>
                  <Text style={styles.textBottomContainer}>{email}</Text>
                </View>

                <View style={styles.subTextContainer}>
                  <Text style={styles.textTopContainer}>
                    Management Company
                  </Text>
                  <Text style={styles.textBottomContainer}>
                    {managementCompany}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.bottomTextView}
                  onPress={navigateToManagementCouncil}>
                  <Text style={styles.bottomTextContainer}>
                    Management Council
                  </Text>
                  <ArrowForward />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  bottomTextContainer: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
  },
  bottomTextView: {
    marginHorizontal: width * 0.02,
    marginVertical: height * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTextContainer: {
    marginTop: height * 0.02,
  },
  mainTextContainer: {
    marginHorizontal: width * 0.02,
  },
  textTopContainer: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#9B9B9B',
  },
  textBottomContainer: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#004F71',
    marginTop: 5,
  },

  mainContainer: {
    height: Platform.OS === 'ios' ? '92%' : '90%',
    backgroundColor: '#ffffff',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 20,
  },

  middleContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: width * 0.94,
    flex: 1,
  },
  mainImageContainer: {
    width: '100%',
    height: height * 0.37,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
  },
  facilityImg: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.37,
  },
  linearMainImageContainer: {
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.37,
  },

  middleMainContainer: {
    flexDirection: 'column',
    borderStyle: 'solid',
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    width: '100%',
  },

  sliderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  topContent: {
    height: height * 0.08,
    width: width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 5,
    marginBottom: height * 0.32,
  },

  selectFacilityContainerField: {
    flexDirection: 'column',
    borderRadius: 20,
  },

  facilityImgContainer: {
    width: 75,
    height: 75,
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
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData[0],
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyCommunity);
