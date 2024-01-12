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

const ChangeCityBottomSheet = ({
  onVisible,
  visibilityHandler,
  unitHandler,
  unitList,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
  }, [onVisible]);

  const renderInner = () => (
    <View style={styles.mainContainer}>
      {unitList &&
        unitList.length > 0 &&
        unitList.map((unit, id) => (
          <View key={unit.apartment_unit_id} style={styles.unitContainer}>
            <TouchableOpacity
              style={styles.clickableUnitContainer}
              onPress={() => {
                unitHandler(unit);
                onClose();
              }}>
              <Text style={styles.unitText}>{unit.unit_name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      <TouchableOpacity
        style={[styles.clickableUnitContainer, {marginVertical: height * 0.03}]}
        onPress={() => {
          unitHandler(0);
          onClose();
        }}>
        <Text style={styles.unitText}>All City</Text>
      </TouchableOpacity>
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
      snapPoints={[250, 0]}
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
  unitContainer: {
    width: '100%',
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  clickableUnitContainer: {
    alignItems: 'baseline',
  },
  unitText: {
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 16,
    lineHeight: 20,
  },
});

export default ChangeCityBottomSheet;
