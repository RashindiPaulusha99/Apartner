import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';

import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import member from '../../assets/images/user-dummy.png';
import bgImage from '../../assets/images/bg-img.png';

import AddBtn from '../../assets/images/AddButton.svg';
import ArrowRight from '../../assets/icons/arrow-ios-back-fill.svg';

const {width, height} = Dimensions.get('window');
const UnderDev = ({navigation, apartmentFacilityDataItems}) => {
  const [selectedTab, setSelectedTab] = useState(2);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState();
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundImageContainer}>
        <StatusBar
          translucent
          animated={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ImageBackground style={styles.image} source={bgImage}>
          <View style={styles.mainContainer}>
            <View style={styles.topRowContainer}>
              <View style={styles.titleContainer}>
                <TouchableOpacity
                  onPress={navigateToHome}
                  style={styles.BackContainer}>
                  <BackImage width={30} height={30} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View style={styles.tabBox}>
                <Text style={styles.title}>This page is under</Text>
                <Text style={styles.title}>development</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
  },
  bgImage: {
    resizeMode: 'stretch',
  },

  mainContainer: {
    marginTop: StatusBar.currentHeight + height * 0.1,
    height: '100%',
  },
  topRowContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.07,
    width: '100%',
  },
  BackContainer: {
    width: '11%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  titleRightContainer: {
    width: '89%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#004F71',
    lineHeight: 32,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#004F71',
  },
  subTitleContentContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  linkText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#004F71',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#004F71',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    height: '100%',
  },
  bottomContainer: {
    backgroundColor: 'transparent',
    height: '100%',
  },
  tabBox: {
    marginHorizontal: width * 0.07,
    backgroundColor: '#ffffff',
    height: height * 0.77,
    marginVertical: 20,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    flexDirection: 'row',
    height: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  leftTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: 40,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightTab: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    height: 40,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 4,
    borderBottomColor: '#197B9A',
  },
  selectedTabBtnText: {
    fontSize: 14,
    color: '#212322',
  },
  tabBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#C8C8C8',
  },
  tileContainer: {
    paddingTop: 15,
    height: height * 0.65,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
  },
  leftDetailCorner: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  nameText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#004F71',
  },
  subText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#4D4D4D',
  },
  rightDetailCorner: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileListingContainer: {
    marginHorizontal: width * 0.05,
    padding: width * 0.03,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 0,
    marginVertical: 7.5,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tileLeftSide: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  userImg: {
    borderRadius: 1000,
  },
  tileRightSide: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightSideTextContent: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightSideText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#9B9B9B',
    lineHeight: 16,
  },
  tileNameText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#212322',
  },
  tileBoldNameText: {
    fontFamily: 'Poppins-Bold',
  },
  tilesRoleTextContainer: {
    alignItems: 'baseline',
  },
  tileRoleText: {
    backgroundColor: '#89B2C4',
    width: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 25,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  addBtnContainer: {
    alignItems: 'center',
    bottom: -27,
    width: '100%',
    position: 'absolute',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UnderDev;
