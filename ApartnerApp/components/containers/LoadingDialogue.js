/**
 * <b>Common loading indicator component</b>
 * @author Sandun M
 * @since 2021-07-01
 */
import React, {useEffect, useState, useRef} from 'react';
import {Dimensions, View, ActivityIndicator} from 'react-native';

const {height, width} = Dimensions.get('window');

const LoadingDialogue = ({visible, color}) => {
  let props = {
    size: "large",
  };

  if (color) {
    props.color = color;
  }

  if (visible) {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        >
        <ActivityIndicator size="large" color="#0E9CC9" />
      </View>
    );
  } else {
    return <></>;
  }
};

export default LoadingDialogue;
