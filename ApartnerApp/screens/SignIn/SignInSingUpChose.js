import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';

import AppInitialContainer from '../../components/containers/AppInitial';
import SignInSignUpAppName from '../../components/header/signInSignUpAppName';

const {width, height} = Dimensions.get('window');

const SignInSingUpChose = ({navigation}) => {
  const navigateToSignInInt = () => {
    navigation.navigate('SignIn');
  };
  const navigateToSignUpInt = () => {
    navigation.navigate('SignUpMobile');
  };

  return (
    <AppInitialContainer blurRadius={2} shadowOpacity={0.5}>
      <SignInSignUpAppName customColor="white" />
      <View style={styles.page}>
        <View style={styles.bottomContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.textSecTop}>Bringing</Text>
            <Text style={styles.textSecBottom}>Communities</Text>
            <Text style={styles.textSecBottom}>Together.</Text>
          </View>
          <View style={styles.mainBtnContainer}>
            <Button
              rounded
              buttonStyle={styles.buttonLogin}
              title="Log In"
              onPress={navigateToSignInInt}
              titleStyle={styles.buttonLogInTitle}
              containerStyle={styles.buttonContainer}
            />
            <Button
              rounded
              buttonStyle={styles.buttonSignUp}
              title="Sign Up"
              onPress={navigateToSignUpInt}
              titleStyle={styles.buttonSignUpTitle}
              containerStyle={styles.buttonContainer}
            />
          </View>
        </View>
      </View>
    </AppInitialContainer>
  );
};

const styles = StyleSheet.create({
  page: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  bottomContainer: {
    height: height * 0.9,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  textContainer: {
    height: height * 0.4,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  textSecTop: {
    fontFamily: 'Montserrat-Light',
    color: 'white',
    fontSize: 30,
  },
  textSecBottom: {
    fontFamily: 'Montserrat-Black',
    color: 'white',
    fontSize: 40,
    lineHeight: 50,
  },
  mainBtnContainer: {
    width: '100%',
    height: height * 0.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: 25,
    maxWidth: 350,
    width: '100%',
    marginVertical: 15,
  },
  buttonLogin: {
    height: 60,
    alignItems: 'center',
    backgroundColor: '#4C84FF',
  },
  buttonSignUp: {
    height: 60,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#4C84FF',
  },
  buttonLogInTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  buttonSignUpTitle: {
    color: '#4C84FF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default SignInSingUpChose;
