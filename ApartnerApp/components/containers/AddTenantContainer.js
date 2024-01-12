import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StatusBar,
  View,
} from 'react-native';
import SignUpBg from '../../assets/images/AddBg.png';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight + (height * 0.05);
const MenuContainer = ({children, blurRadius, shadowOpacity}) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <ImageBackground source={SignUpBg} style={styles.image}>
        {/* // blurRadius={blurRadius ? blurRadius : 12} */}
        <View
          style={[
            styles.overlay,
            // {shadowOpacity: {shadowOpacity: shadowOpacity && 0.8}},
          ]}>
          {children}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    height: '100%',
    paddingTop: statusBarHeight,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default MenuContainer;
