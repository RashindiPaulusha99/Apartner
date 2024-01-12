import React, {useEffect, useState, useRef} from 'react';
import {Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const ChangeBottomSheetCalendar = ({
  onVisible,
  visibilityHandler,
  styleSheet,
  onSubmit,
  children,
  height,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  useEffect(() => {
    if (onVisible) {
      onOpen();
    } else {
      onClose();
    }
  }, [onVisible]);

  const sheetRef = React.createRef(null);

  const onClose = () => {
    sheetRef.current.snapTo(1);
    visibilityHandler(false);
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const onOpen = () => {
    visibilityHandler(true);
    sheetRef.current.snapTo(0);
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={height ? height : [480, 0]}
      initialSnap={1}
      renderContent={children}
      onCloseEnd={onClose}
      borderRadius={20}
    />
  );
};

export default ChangeBottomSheetCalendar;
