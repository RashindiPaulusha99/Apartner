import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';

import {connect} from 'react-redux';
import {resetSignInStateAction} from '../SignIn/actions/signIn-action';
import {resetSignUpStateAction} from '../SignUp/actions/signUp-action';

import AppInitialsplashContainer from '../../components/containers/AppInitialsplash';
import Nextarrow from '../../assets/images/Next-arrow.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.png';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {DefaultButton} from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import {getUserApartmentsListAction} from '../Apartment/actions/apartment-action';

const {height, width} = Dimensions.get('window');

const SplashScreen = ({
  navigation,
  resetSignInState,
  resetSignUpState,
  getUserApartmentsList,
}) => {
  const navigateToLoginInt = () => {
    setLoadingPage(true);
    resetSignInState();
    resetSignUpState();
    navigation.navigate('SignUpMobileNew');
  };

  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    setLoadingPage(false);
  }, []);

  const initDataInPage = async () => {
    let userId = await AsyncStorage.getItem('userId');
    let userToken = await AsyncStorage.getItem('token');
    if (userId && userToken) {
      getUserApartmentsList(
        {
          userId: userId,
        },
        async responseData => {
          navigation.navigate('ApartmentSelection');
        },
      );
    } else {
      navigateToLoginInt();
    }
  };

  return (
    <AppInitialsplashContainer blurRadius={2} shadowOpacity={0.5}>
      <SafeAreaView>
        <View style={styles.splashContainer}>
          <View style={styles.apartnerLogo}>
            <Image source={Apartnerlogo} />
            {/* <Apartnerlogo /> */}
          </View>
          <DefaultButton submit={initDataInPage} title="Get Started" />
        </View>
      </SafeAreaView>
    </AppInitialsplashContainer>
  );
};

const styles = StyleSheet.create({
  apartnerLogo: {
    height: '65%',
    marginTop: '25%',
    alignItems: 'center',
  },

  buttonContainer: {
    backgroundColor: '#0E9CC9',
    borderColor: '#004F71',
    width: width * 0.85,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '10.5%',
  },
  textContainer: {
    color: '#FFFFFF',
    fontSize: 21,
    fontFamily: 'Roboto',
    // marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrowIcon: {
    marginHorizontal: 10,
    position: 'absolute',
    right: '10%',
    height: 24,
    width: 24,
  },
  splashContainer: {
    alignItems: 'center',
    height: height,
  },
});

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  resetSignInState: () => dispatch(resetSignInStateAction()),
  resetSignUpState: () => dispatch(resetSignUpStateAction()),
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SplashScreen);
