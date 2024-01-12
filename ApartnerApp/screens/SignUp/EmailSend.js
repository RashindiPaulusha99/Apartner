import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import RightImage from '../../assets/images/feather-check-circle.svg';

const {width, height} = Dimensions.get('window');

const EmailSend = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);

  return (
    <AppInitialSignUpContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => height * 0.1,
        })()}
      />
      <View style={styles.topCard1}>
        <View style={styles.topCard1} />
        <View style={styles.topCard}>
          <View style={styles.rightImageview}>
            <RightImage />
          </View>
          <View style={styles.emailText}>
            <Text style={styles.emailTextSent}>Email Sent !</Text>
          </View>
          <View style={styles.checkTextview}>
            <Text style={styles.checkTextYour}>
              Check your inbox for an email from APARTNER with a link to reset
              your password.
            </Text>
          </View>
          <View style={styles.BottonView}>
            <TouchableOpacity style={styles.okBotton}>
              <Text tyle={styles.okBottonText}>Ok</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendBotton}>
              <Text tyle={styles.resendBottonText}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppInitialSignUpContainer>
  );
};

const styles = StyleSheet.create({
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  topCard: {
    flex: 2,
    backgroundColor: '#239D06',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  topCard1: {
    flex: 3,
    backgroundColor: '#C8C8C8',
  },
  rightImageview: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  emailText: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  emailTextSent: {
    color: '#ffffff',
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: 'bold',
  },
  checkTextview: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  checkTextYour: {
    fontFamily: 'Poppins',
    fontSize: 16,
    alignItems: 'center',
    color: '#ffffff',
    textAlign: 'center',
    width: '70%',
  },
  okBotton: {
    width: 130,
    height: 51,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  okBottonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
  },
  BottonView: {
    flexDirection: 'row',
    marginTop: height * 0.02,
    marginLeft: 50,
  },
  resendBottonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
  },
  resendBotton: {
    width: 130,
    height: 51,
    backgroundColor: '#C8C8C8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
});

export default EmailSend;
