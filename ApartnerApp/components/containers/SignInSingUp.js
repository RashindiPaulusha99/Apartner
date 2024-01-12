import React from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';
import BgImage from '../../assets/images/bg-image.png';

const SignInSingUpContainer = ({children}) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={BgImage} style={styles.image} blurRadius={12}>
        {children}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    
  },
});

export default SignInSingUpContainer;
