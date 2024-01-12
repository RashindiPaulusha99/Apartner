import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const {width, height} = Dimensions.get('window');

const ChangeCountBottomSheet = ({
  onVisible,
  visibilityHandler,
  unitHandler,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));
  const [countList, setCountList] = useState([]);
  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
    let arr = [];
    for (let x = 0; x <= 50; x++) {
      arr.push(x);
    }
    setCountList(arr);
  }, [onVisible]);

  const renderInner = () => (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={[styles.clickableUnitContainer, {marginVertical: height * 0.03}]}
        onPress={() => {
          unitHandler(0);
          onClose();
        }}>
        <Text style={styles.unitText}>Count</Text>
      </TouchableOpacity>
      <ScrollView keyboardDismissMode="on-drag" style={{width: '100%'}}>
        {countList &&
          countList.length > 0 &&
          countList.map((num, id) => (
            <View key={num} style={styles.countContainer}>
              <TouchableOpacity
                style={styles.clickableUnitContainer}
                onPress={() => {
                  unitHandler(num);
                  onClose();
                }}>
                <Text style={styles.unitText}>{num}</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
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
  countContainer: {
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

export default ChangeCountBottomSheet;
