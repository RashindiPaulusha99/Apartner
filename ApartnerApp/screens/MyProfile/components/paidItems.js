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
  Animated,
} from 'react-native';
import PaidIcon from '../../../assets/icons/check-circle.svg';

import ArrowUp from '../../../assets/icons/show-more-arrow-up.svg';
import ArrowDown from '../../../assets/icons/show-more-arrow-down.svg';

const {width, height} = Dimensions.get('window');

const PaidItems = ({item, i}) => {
  const [collapsed, setCollapsed] = useState(true);
  const animationHeight = useRef(new Animated.Value(0)).current;
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    if (collapsed) {
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 0,
      }).start();
    } else {
      Animated.timing(animationHeight, {
        duration: 1000,
        toValue: 1000,
      }).start();
    }
  }, [collapsed]);
  const payments = [
    {type: 'Sinking Fund', value: '11,200'},
    {type: 'Service Charge', value: '1,200'},
    {type: 'apartner Subscription Fee', value: '500'},
  ];
  return (
    <View key={item.key} style={styles.tileListingContainer}>
      <View style={styles.itemTitleContainer}>
        <Text style={styles.itemTitle}>XB/01</Text>
      </View>
      <View style={styles.detailFirstRowContainer}>
        <View style={styles.tileLeftSide}>
          <View style={styles.textContainer}>
            <View style={styles.duration}>
              <Text style={styles.tileDueText}>
                {'Dec 2020'}
                {'-'}
                {'Mar 2021'}
              </Text>
            </View>
            <View style={styles.tilesDueTypeContainer}>
              <Text style={styles.tileDueTypeText}>Maintence</Text>
              <Text style={styles.tileDuePriceText}>18,700{' LKR'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.tileRightSide}>
          <TouchableOpacity style={styles.duesButtonMainContainer}>
            <View style={styles.duesButtonContainer}>
              <PaidIcon />
              <Text style={styles.duesButtonText}>Paid</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailSecondRowContainer}>
        <View style={styles.tileLeftSide}>
          <Text style={styles.overDueText}>Paid on : March 5, 2021</Text>
        </View>
        <View style={styles.tileRightSide}>
          <TouchableOpacity style={styles.viewInvoiceContainer}>
            <Text style={styles.viewInvoice}>View Reciept</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.detailThirdRowContainer}>
        <Animated.View
          style={{
            maxHeight: animationHeight,
            width: '100%',
            overflow: 'hidden',
          }}>
          {payments.map((payment, id) => (
            <View key={id} style={styles.showMoreContainer}>
              <Text style={styles.paymentSectionText}>{payment.type}</Text>
              <Text style={styles.paymentSectionText}>
                {payment.value}
                {' LKR'}
              </Text>
            </View>
          ))}
        </Animated.View>
        <TouchableOpacity
          onPress={() => toggleCollapsed(item.key)}
          style={styles.showMoreBtnContainer}>
          <Text style={styles.overDueText}>
            {collapsed ? 'Show More' : 'Show Less'}
          </Text>
          {collapsed ? <ArrowDown /> : <ArrowUp />}
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 26,
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
    // height: '100%',
  },
  tabBox: {
    marginHorizontal: width * 0.06,
    backgroundColor: '#ffffff',
    height: height * 0.8,
    marginVertical: 20,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 1,
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
  tileListingContainer: {
    marginHorizontal: width * 0.05,
    // paddingHorizontal: width * 0.03,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowColor: '#999999',
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
    borderRadius: 20,
    marginVertical: 7.5,
    height: 'auto',
  },
  itemTitleContainer: {
    width: '100%',
    backgroundColor: '#89B2C4',
    height: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
  },
  detailFirstRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.03,
  },
  detailSecondRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: width * 0.03,
  },
  tileLeftSide: {
    width: '55%',
  },
  tileDueText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#212322',
  },

  tilesDueTypeContainer: {
    alignItems: 'baseline',
  },
  tileDueTypeText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#197B9A',
    lineHeight: 22,
  },
  tileDuePriceText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#197B9A',
    margin: 0,
    padding: 0,
    lineHeight: 24,
  },

  addBtnContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tileRightSide: {
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  duesButtonMainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    height: 50,
    borderColor: '#069D8E',
    borderWidth: 1,
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
  },
  duesButtonContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duesButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#069D8E',
    alignItems: 'center',
    marginTop: 3,
    // height:25,
    // lineHeight: 14,
  },
  overDueText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9B9B9B',
  },
  viewInvoice: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#197B9A',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#9B9B9B',
  },
  detailThirdRowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  showMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: width * 0.03,
  },
  paymentSectionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#212322',
    lineHeight: 18,
  },
  showMoreBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    // borderWidth: 4,
    // borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 25,
  },
  bottomBtnContainer: {
    height: height * 0.07,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  linearContainer: {
    width: '100%',
    height: height * 0.07,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'grey',
  },
  arrowBottomContainer: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // height: 30,
  },
  buttonRowContainer: {
    paddingHorizontal: width * 0.04,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainerLeft: {width: '40%'},
  buttonContainerRight: {
    width: '55%',
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: '#239D06',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    height: 50,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
});

export default PaidItems;
