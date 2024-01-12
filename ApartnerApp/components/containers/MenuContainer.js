import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StatusBar,
  View,
} from 'react-native';
import SignUpBg from '../../assets/images/blue-bg.png';

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
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  overlay: {
    height: '100%',
    paddingTop: StatusBar.currentHeight,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    // // shadowColor: '#182850',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  bluebg: {},
});

export default MenuContainer;
