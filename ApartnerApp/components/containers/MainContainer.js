import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  NativeModules,
  Image,
} from 'react-native';
import bgImage from '../../assets/images/new_images/myprofilebackgound.png';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px.png';
import LinearGradientContainer from '../../components/containers/LinearGradientContainer';
const {StatusBarManager} = NativeModules;

const {width, height} = Dimensions.get('window');
const MainContainer = ({
  children,
  navigateToHome,
  setVisibleChangeUnit,
  unitName,
  title,
  changeUnitState = true,
  formContainer = false,
  keyboardDissmissHandler,
  setbgImage,
  backgroundimage = false,
  lineargradientStatus = false,
}) => {
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
  const MainComponent = () => (
    <>
      {lineargradientStatus ? (
        <LinearGradientContainer
          colors={['#ffffff', '#FFFFFFBA', 'transparent']}
          styles={styles.linearMainImageContainer}>
          <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
              <View
                style={[
                  styles.topRowContainer,
                  changeUnitState === false && {height: 50},
                ]}>
                <TouchableOpacity
                  onPress={navigateToHome}
                  style={styles.backContainer}>
                  <Image source={BackImage} style={{width: 24, height: 24}} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{title}</Text>
                  {/* <View
                style={[
                  {backgroundColor: tagBackgroundColour},
                  styles.inOutStatusContainer,
                ]}>
                <Text style={styles.inOutStatusText}>{flagName}</Text>
              </View> */}
                </View>
              </View>
              {changeUnitState && (
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>{unitName}</Text>
                  <TouchableOpacity onPress={setVisibleChangeUnit}>
                    <Text style={styles.linkText}>Change Unit</Text>
                  </TouchableOpacity>
                </View>
              )}
              {children}
            </View>
          </SafeAreaView>
        </LinearGradientContainer>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.mainContainer}>
            <View
              style={[
                styles.topRowContainer,
                changeUnitState === false && {height: 50},
              ]}>
              <TouchableOpacity
                onPress={navigateToHome}
                style={styles.backContainer}>
                <Image source={BackImage} style={{width: 24, height: 24}} />
              </TouchableOpacity>

              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {/* <View
                style={[
                  {backgroundColor: tagBackgroundColour},
                  styles.inOutStatusContainer,
                ]}>
                <Text style={styles.inOutStatusText}>{flagName}</Text>
              </View> */}
              </View>
            </View>
            {changeUnitState && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>{unitName}</Text>
                <TouchableOpacity onPress={setVisibleChangeUnit}>
                  <Text style={styles.linkText}>Change Unit</Text>
                </TouchableOpacity>
              </View>
            )}
            {children}
          </View>
        </SafeAreaView>
      )}
    </>
  );
  return (
    <>
      {formContainer ? (
        <TouchableWithoutFeedback
          onPress={() => {
            keyboardDissmissHandler();
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              paddingTop: statusBarHeight,
            }}>
            <StatusBar
              translucent
              backgroundColor="#ffffff"
              barStyle="dark-content"
            />

            <ImageBackground
              source={backgroundimage === false ? bgImage : setbgImage}
              style={styles.bgImageContainer}>
              <StatusBar
                translucent
                backgroundColor="#ffffff"
                barStyle="dark-content"
              />

              <View style={{flex: 1}}>{MainComponent()}</View>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            paddingTop: statusBarHeight,
          }}>
          <StatusBar
            translucent
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />
          <ImageBackground
            source={backgroundimage === false ? bgImage : setbgImage}
            style={styles.bgImageContainer}>
            {MainComponent()}
          </ImageBackground>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImageContainer: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
  },
  linearMainImageContainer: {
    width: '100%',
    flex: 1,
    height: '100%',
  },

  mainContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    backgroundColor: '#ffffff',
  },
  backContainer: {
    position: 'absolute',
    left: '2.5%',
    zIndex: 10,
  },
  title: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
    lineHeight: 21,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  locationContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#004F71',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#004F71',
  },
  titleContainer: {
    flexDirection: 'row',
  },
  inOutStatusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    height: 30,
    marginLeft: width * 0.15,
  },
  inOutStatusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
});

export default MainContainer;
