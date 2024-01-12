import React from 'react';
import {StyleSheet, View, Text, Linking} from 'react-native';
import {connect} from 'react-redux';

const WelcomeMessage = ({loggedInUserData}) => {
  return (
    <View style={styles.welcomeView}>
      <Text style={styles.message}>
        Welcome{' '}
        <Text style={styles.userName}>{loggedInUserData.given_name}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeView: {},
  message: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  userName: {
    fontFamily: 'Poppins-Bold',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  loggedInUserData: state.signInState.userData[0],
});

export default connect(mapStateToProps)(WelcomeMessage);
