import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Platform,
  NativeModules,
  StatusBar,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const {StatusBarManager} = NativeModules;

const {width, height} = Dimensions.get('window');
const ScreenHeaderV2 = ({headerName, navigateToBack}) => {
  const [statusBarHeight, setStatusBarHeight] = useState(null);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);

  return (
    <View style={[styles.topRowContainer, {marginTop: statusBarHeight}]}>
      <View style={styles.backBtnView}>
        <TouchableOpacity
          onPress={() => {
            navigateToBack();
          }}
          style={styles.backBtnContainer}>
          <MaterialIcon name="arrow-back" size={24} color="#26272C" />
        </TouchableOpacity>
      </View>
      <View style={styles.apartnerTextContainer}>
        <Text style={styles.mainTitle}>{headerName}</Text>
      </View>
      <View style={styles.lastView} />
    </View>
  );
};

const styles = StyleSheet.create({
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
  },
  backBtnView: {
    flex: 1,
    alignItems: 'center',
  },
  lastView: {
    flex: 1,
  },
  backBtnContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  apartnerTextContainer: {
    alignItems: 'center',
    zIndex: 0,
    flex: 4,
  },
  mainTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
    lineHeight: 21,
  },
});

export default ScreenHeaderV2;
