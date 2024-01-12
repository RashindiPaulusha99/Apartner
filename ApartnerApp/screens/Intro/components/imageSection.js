import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

const ImageSection = () => {
  return (
    <View style={styles.imageView}>
      <Image
        style={styles.image}
        source={require('../../../assets/images/app-intor.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    flex: 1,
    flexDirection: 'row',
    width: 318,
    height: 318,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 82,
    left: 47,
    backgroundColor: '#FFFFFF',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

export default ImageSection;
