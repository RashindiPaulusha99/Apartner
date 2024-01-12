import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  PixelRatio,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import {addComplexLastVisitTimeOfUserApi} from '../services/apartment-service';
import BackImage from '../../../assets/images/ic_arrow_forward_24px.svg';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

const {width, height, fontScale} = Dimensions.get('window');
let currentHour = parseFloat(moment().format('HH'));
const ApartmentSelectionForm = ({
  navigateToHome,
  userApartments,
  setSelectedApartmentData,
  loggedInUserData,
  selectedApartment,
  apartmentComplexSelectionPending,
  navigation,
}) => {
  const [greeting, setGreeting] = useState(null);
  const [spinner, showSpinner] = useState(false);

  useEffect(() => {
    setGreeting(getGreetingTime(moment()));
  }, [currentHour]);

  useEffect(() => {
    showSpinner(apartmentComplexSelectionPending);
  }, [apartmentComplexSelectionPending]);

  const setSelectedApartmentComplex = async apartment => {
    try {
      setSelectedApartmentData(apartment);

      const responseLastVisit = await addComplexLastVisitTimeOfUserApi({
        visitedBy: loggedInUserData.user_id,
        complexId: apartment.key,
      });

      if (
        responseLastVisit.data.body.statusCode != undefined &&
        responseLastVisit.data.body.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        navigateToHome(apartment);
      }
    } catch (error) {}
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      key={index}
      onPress={() => setSelectedApartmentComplex(item)}
      style={
        index == 0
          ? styles.selectContainerFieldFirstElement
          : styles.selectContainerField
      }>
      {/* <View> */}
      <Image style={styles.complexImg} source={{uri: item.img}} />
      {/* </View> */}
      <View style={styles.bottomStyleSheet}>
        <View>
          <Text style={styles.selectionTopic}>
            {item.label.length > 24
              ? item.label.substring(0, 20) + '...'
              : item.label}
          </Text>

          <Text style={styles.selectionLocation}>
            {item.location.length > 38
              ? item.location.substring(0, 34) + '...'
              : item.location}
          </Text>
        </View>
        <View>
          <Text style={styles.selectionLastViewedText}>Last viewed:</Text>
          <View style={styles.selectionIconView}>
            <Text style={styles.selectionLastViewed}>
              {item.lastViewed
                ? moment(item.lastViewed).format('h:mm a, MMM DD')
                : 'Never'}
            </Text>
            <BackImage />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const getGreetingTime = m => {
    let g = null; //return g

    if (!m || !m.isValid()) {
      return;
    } //if we can't find a valid or filled moment, we return.

    let split_afternoon = 12; //24hr time to split the afternoon
    let split_evening = 17; //24hr time to split the evening

    if (currentHour >= split_afternoon && currentHour <= split_evening) {
      g = 'Good Afternoon!';
    } else if (currentHour >= split_evening) {
      g = 'Good Evening!';
    } else {
      g = 'Good Morning!';
    }

    return g;
  };
  return (
    <>
      <View style={styles.formView}>
        <View style={styles.mainTextView}>
          <Text style={styles.timeRange}>{greeting}</Text>
          <Text style={styles.subTitle}>Tap to enter your apartment</Text>
        </View>

        <View style={styles.selectContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={userApartments}
            renderItem={renderItem}
            keyExtractor={item => item.key.toString()}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formView: {
    height: height * 0.72,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.04,
  },

  timeRange: {
    fontFamily: 'Roboto-Black',
    fontSize: 26,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  subTitle: {
    fontFamily: 'Roboto-Light',
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: height * 0.005,
  },
  mainTextView: {
    paddingLeft: width * 0.02,
  },
  bottomStyleSheet: {
    height: height * 0.225,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  selectContainerField: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginRight: 15,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderRadius: 20,
    width: width * 0.4,
    height: height * 0.45,
  },
  selectContainerFieldFirstElement: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginRight: 15,
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderRadius: 20,
    width: width * 0.4,
    height: height * 0.45,
    marginLeft: width * 0.05,
  },
  complexImg: {
    width: '100%',
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  selectionTopic: {
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
    fontSize: 18,
    lineHeight: 20,
  },
  selectionLocation: {
    fontFamily: 'Roboto-Regular',
    color: '#0E9CC9',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
  },
  selectionLastViewedText: {
    fontFamily: 'Roboto-Regular',
    color: '#9B9B9B',
    fontSize: 12,
  },
  selectionLastViewed: {
    fontFamily: 'Roboto-Regular',
    color: '#212322',
    fontSize: 12,
    opacity: 1,
  },
  bottomPanel: {
    justifyContent: 'space-between',
    height: height * 0.16,
    marginBottom: 10,
    paddingBottom: 5,
    backgroundColor: 'red',
  },
  selectionIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => ({
  apartmentComplexSelectionPending:
    state.apartmentState.apartmentComplexSelectionPending,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApartmentSelectionForm);
