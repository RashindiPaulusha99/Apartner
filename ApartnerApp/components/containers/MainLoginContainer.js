import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import {DefaultButton} from '../../components';
// import BottomSheet from '../../components/containers/bottomSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;
const MainLoginContainer = ({
  backNavigation,
  lightTitle,
  strongTitle,
  children,
  submitContinueButton,
  BottomSheets = null,
  enableShift,
}) => {
  const [onClose, setOnClose] = useState(false);

  useEffect(() => {}, [BottomSheets]);
  const submitDefaultButton = () => {
    submitContinueButton();
  };

  const navigateToScreen = () => {
    backNavigation();
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setOnClose(true);
        }}>
        <View style={{flex: 1}}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.topCard}>
              <View style={styles.topCardMaincontainer}>
                <View style={styles.topRowContainer}>
                  <TouchableOpacity
                    onPress={navigateToScreen}
                    style={styles.backBtnContainer}>
                    <Icon
                      name="arrow-back"
                      // onpress={detialsHandler}
                      size={24}
                      color="#26272C"
                    />
                    <BackImage width={24} height={24} />
                  </TouchableOpacity>
                  <View style={styles.apartnerTextContainer}>
                    <View style={styles.apartnerLogoMainContainer}>
                      <Image style={styles.logoImg} source={apartnerLogo} />
                    </View>
                  </View>
                </View>
                <View style={styles.mainContentContainer}>
                  <View style={{alignItems: 'center', marginTop: 40}}>
                    <Text style={styles.titleText}>{lightTitle}</Text>
                    <Text style={styles.titleBoldText}>{strongTitle}</Text>
                  </View>
                </View>
              </View>
              <View style={{flex: 4}}>
                <View style={{flex: 3}}>{children}</View>
                <View style={styles.footer}>
                  <KeyboardAvoidingView
                    behavior="height"
                    enabled={enableShift}
                    keyboardVerticalOffset={Platform.select({
                      ios: () => -30,
                      android: () => -height * 0,
                    })()}
                    style={styles.continueBtn}>
                    <DefaultButton
                      submit={submitDefaultButton}
                      title="Continue"
                    />
                  </KeyboardAvoidingView>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
      {BottomSheets != null ? <BottomSheets /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: height,
    backgroundColor: '#ffffff',
  },
  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  topCardMaincontainer: {
    //flex: 1,
    height: Platform.OS === 'ios' ? height * 0.18 : height * 0.22,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // height: height * 0.08,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    width: width,
  },
  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
    left: width * 0.05,
  },
  apartnerTextContainer: {
    width: '100%',
    zIndex: 0,
    alignItems: 'center',
    justifyContent : 'center'
  },
  apartnerLogoMainContainer: {
    width: width * 0.4,
    height: height * 0.045,
    alignItems: 'center',
    justifyContent : 'center',
  },
  logoImg: {
    width: 92,
    height: 22,
  },
  continueBtn: {
    alignItems: 'center',
  },

  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },

  mainContentContainer: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {fontFamily: 'Roboto-Light', fontSize: 18, color: '#26272C'},
  titleBoldText: {fontFamily: 'Roboto-Black', fontSize: 26, color: '#26272C'},
  footer: {
    flex: 1,
  },
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainLoginContainer);
