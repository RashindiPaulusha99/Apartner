import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const {width, height} = Dimensions.get('window');

const ChangeBloodBottomSheet = ({
  onVisible,
  visibilityHandler,
  unitHandler,
  complaintType,
  bottomSheetHeight,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
  }, [onVisible]);

  const renderInner = () => (
    <View style={styles.mainContainer}>
      {complaintType &&
        complaintType.length > 0 &&
        complaintType.map((complaintObject, id) => (
          <TouchableOpacity
            key={complaintObject.key}
            style={styles.complaintContainer}
            onPress={() => {
              unitHandler(complaintObject);
              onClose();
            }}>
            <Text style={styles.complaintText}>{complaintObject.group}</Text>
          </TouchableOpacity>
        ))}
      <TouchableOpacity
        style={[
          styles.clickableComplaintContainer,
          {marginVertical: height * 0.03},
        ]}
        onPress={() => {
          unitHandler(0);
          onClose();
        }}
      />
    </View>
  );

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
      snapPoints={bottomSheetHeight ? bottomSheetHeight : [250, 0]}
      initialSnap={1}
      renderContent={renderInner}
      onCloseEnd={onClose}
      borderRadius={20}
    />
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  complaintContainer: {
    width: '100%',
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  clickableComplaintContainer: {
    alignItems: 'baseline',
  },
  complaintText: {
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 16,
    lineHeight: 20,
  },
});

export default ChangeBloodBottomSheet;
