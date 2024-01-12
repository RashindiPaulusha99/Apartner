import React, {useEffect, useState, useRef} from 'react';
import {ScrollView} from 'react-native';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const {width, height} = Dimensions.get('window');

const ChangeFacilityBottomSheet = ({
  onVisible,
  visibilityHandler,
  facilityHandler,
  facilityList,
  onCloseClick,
  bottomSheetHeight,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (onVisible) {
      onOpen();
    }
    if (onCloseClick) {
      onClose();
    }
  }, [onVisible, onCloseClick]);
  const renderInner = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        onClose();
      }}>
      <View style={styles.mainContainer}>
        <View style={{height: 200, width: '100%'}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{width: '100%'}}>
            {facilityList &&
              facilityList.length > 0 &&
              facilityList.map((facility, id) => (
                <View
                  key={facility.recreational_location_id}
                  style={styles.facilityContainer}>
                  <TouchableOpacity
                    style={styles.clickableFacilityContainer}
                    onPress={() => {
                      facilityHandler(facility);
                      onClose();
                    }}>
                    <Text style={styles.facilityText}>
                      {facility.location_name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  facilityContainer: {
    width: '100%',
    borderBottomColor: '#C8C8C8',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.01,
  },
  clickableFacilityContainer: {
    alignItems: 'center',
    width: '100%',
  },
  facilityText: {
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 16,
    lineHeight: 20,
    textTransform: 'capitalize',
  },
});

export default ChangeFacilityBottomSheet;
