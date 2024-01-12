import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StatusBar,
  View,
} from 'react-native';
import SignUpBg from '../../assets/images/LandingScreenBG.png';

const {width, height} = Dimensions.get('window');
const MenuContainer = ({children, blurRadius, shadowOpacity}) => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
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

});

export default MenuContainer;
