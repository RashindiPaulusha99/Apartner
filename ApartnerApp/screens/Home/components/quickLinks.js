import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';

import PoolIcon from '../../../assets/images/pool_black_24dp.svg';
import TwoPepoleIcon from '../../../assets/images/ic_people_outline_24px.svg';
import FindIcon from '../../../assets/icons/new_ui/person_search_black_24dp.svg';
import HelpIcon from '../../../assets/images/confirmation_number_black_24dp.svg';
import {getApartmentFacilityAction} from '../../Apartment/actions/apartment-action';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');
const QuickLinks = ({
  navigation,
  getApartmentFacilities,
  selectedApartmentData,
}) => {
  let quickLinksRef = React.createRef();

  const navigateToAddVisitor = () => {
    navigation.navigate('AddVisitor');
  };
  const navigateToAddTicket = () => {
    navigation.navigate('LodgeComplaint');
  };
  const navigateToBookingFacility = () => {
    getApartmentFacilities(
      {
        selectedComplexId: selectedApartmentData.key,
      },
      () => {
        navigation.navigate('BookingFacility');
      },
    );
  };
  const [selectedFacility, setSelectedFacility] = useState('Swimming Pools');
  const [quickLinksCount, setQuickLinksCount] = useState(1);
  const apartmentFacilities = [
    {
      recreational_location_row_id: 1,
      catagory: 'Add Visitors',
      image: TwoPepoleIcon,
      bgColor: '#fff',
      textColor: '#004F71',
      navHandler: navigateToAddVisitor,
    },
    {
      recreational_location_row_id: 2,
      catagory: 'Book Facility',
      bgColor: '#004F71',
      textColor: '#FFFFFF',
      image: PoolIcon,
      navHandler: navigateToBookingFacility,
    },
    {
      recreational_location_row_id: 3,
      catagory: 'Create Ticket',
      bgColor: '#fff',
      textColor: '#004F71',
      image: HelpIcon,
      navHandler: navigateToAddTicket,
    },
    // future development (bug bash commented code)

    // {
    //   recreational_location_row_id: 4,
    //   catagory: 'Add Helpers',
    //   bgColor: '#004F71',
    //   textColor: '#FFFFFF',
    //   image: TwoPepoleIcon,
    // },
    // {
    //   recreational_location_row_id: 5,
    //   catagory: 'Find Vendors',
    //   bgColor: '#fff',
    //   image: FindIcon,
    //   textColor: '#004F71',
    // },
  ];
  const ButtonPressable = props => {
    return (
      <View>
        <View>
          {props.svg ? (
            <props.svg
              style={styles.svgContainer}
              width={props.width}
              height={props.height}
            />
          ) : null}
        </View>
      </View>
    );
  };
  const selectedFacilityHandler = value => {
    setSelectedFacility(value);
  };
  const renderBookingItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        if (item.navHandler) {
          item.navHandler();
        }
        selectedFacilityHandler(item.catagory);
      }}
      key={index}
      activeOpacity={1}
      style={[styles.bottomCardAdd, {backgroundColor: item.bgColor}]}>
      <View style={styles.quickLinkTile}>
        <ButtonPressable svg={item.image} width={28} height={28} />
        <View style={styles.selectionFacilityTopicContainer}>
          <Text
            style={[styles.selectionFacilityTopic, {color: item.textColor}]}>
            {item.catagory}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    if (apartmentFacilities.length !== 0 && quickLinksRef.current !== null) {
      quickLinksRef.scrollToIndex({
        animated: true,
        index: quickLinksCount,
        viewPosition: 0.5,
      });
    }
  }, [quickLinksCount]);

  const clickableScrollerhandler = value => {
    //initially quickLinksCount must be less than 1 for come back prev. because there is no index below 0.
    if (quickLinksCount > 1 && value === 'prev') {
      setQuickLinksCount(pre => pre - 1);
    }
    //initially quickLinksCount must be more than 0 for move next. because initial slider index 0.
    if (
      quickLinksCount >= 1 &&
      quickLinksCount < apartmentFacilities.length - 2 &&
      value === 'next'
    ) {
      setQuickLinksCount(pre => pre + 1);
    }
  };
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={apartmentFacilities}
        renderItem={renderBookingItem}
        keyExtractor={item => item.recreational_location_row_id}
        ref={ref => (quickLinksRef = ref)}
        onScrollToIndexFailed={error => {
          quickLinksRef.scrollToOffset({
            offset: error.averageItemLength * error.index,
            animated: true,
          });
        }}
      />
      <View style={styles.viewAll}>
        <TouchableOpacity
          style={styles.arrowIconLeft}
          onPress={() => clickableScrollerhandler('prev')}>
          <Icon name="keyboard-arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowIconRight}
          onPress={() => clickableScrollerhandler('next')}>
          <Icon name="keyboard-arrow-right" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomCardAdd: {
    width: width * 0.33,
    height: height * 0.08,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkTile: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  complexImg: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#ffffff',
    borderWidth: 2,
  },
  selectionFacilityTopic: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
    width: '100%',
  },
  selectionFacilityTopicContainer: {
    width: '50%',
    justifyContent: 'center',
    marginLeft: height * 0.01,
  },
  svgContainer: {
    marginTop: 10,
    fontSize: 11,
    maxHeight: '60%',
  },
  viewAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  arrowIconLeft: {
    marginRight: width * 0.25,
  },
  arrowIconRight: {
    marginLeft: width * 0.25,
  },
});

const mapStateToProps = state => ({
  selectedApartmentData: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData,
});

const mapDispatchToProps = dispatch => ({
  getApartmentFacilities: (payload, callBack) =>
    dispatch(getApartmentFacilityAction(payload, callBack)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuickLinks);
