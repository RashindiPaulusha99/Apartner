import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');
const UnitUpdate = ({spinner, apartmentFacilities}) => {
  let unitUpdatesRef = React.createRef();
  const [unitUpdatesCount, setUnitUpdatesCount] = useState(0);

  useEffect(() => {
    if (apartmentFacilities.length !== 0 && unitUpdatesRef.current !== null) {
      unitUpdatesRef.scrollToIndex({
        animated: true,
        index: unitUpdatesCount,
        viewPosition: 0.5,
      });
    }
  }, [unitUpdatesCount]);

  const renderUnitUpdatesItem = ({item, i}) => {
    return (
      <TouchableOpacity
        onPress={item.navHandler}
        key={i}
        activeOpacity={1}
        style={[styles.bottomCardAdd]}>
        <View style={{justifyContent: 'center'}}>
          <Text
            style={[styles.unitUpdatesTitleText, {color: item.textredColor}]}>
            {item.header}
          </Text>
          <Text
            style={[
              styles.unitUpdatesSubTitleText,
              {color: item.textredColor},
            ]}>
            {item.catagory}
          </Text>
          <Text style={[styles.unitUpdatesBottomText]}>{item.sub}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const clickableScrollerhandler = value => {
    //initially unitUpdatesCount must be less than 1 for come back prev. because there is no index below 0.
    if (unitUpdatesCount > 0 && value === 'prev') {
      setUnitUpdatesCount(pre => pre - 1);
    }
    //initially unitUpdatesCount must be more than 0 for move next. because initial slider index 0.
    if (
      unitUpdatesCount < apartmentFacilities.length - 1 &&
      unitUpdatesCount >= 0 &&
      value === 'next'
    ) {
      setUnitUpdatesCount(pre => pre + 1);
    }
  };
  return (
    <>
      {spinner ? (
        <View>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={apartmentFacilities}
            renderItem={renderUnitUpdatesItem}
            keyExtractor={item => item.id}
            horizontal
            ref={ref => (unitUpdatesRef = ref)}
            onScrollToIndexFailed={error => {
              unitUpdatesRef.scrollToOffset({
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomCardAdd: {
    width: width * 0.7,
    height: height * 0.11,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 12,
    marginTop: height * 0.014,
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitUpdatesTitleText: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: '#F23B4E',
    lineHeight: 20,
  },
  unitUpdatesSubTitleText: {
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
    lineHeight: 20,
  },
  unitUpdatesBottomText: {
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
    color: '#9B9B9B',
    lineHeight: 16,
  },

  viewAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  arrowIconLeft: {
    marginRight: width * 0.25,
  },
  arrowIconRight: {
    marginLeft: width * 0.25,
  },
  payBotton: {
    width: width * 0.25,
    height: height * 0.08,
    backgroundColor: '#F23B4E',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBottonMain: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
  },
});

const mapStateToProps = state => {
  return {
    selectedUnit: state.apartmentState.selectedUnit,
    loggedInUserData: state.signInState.userData,
    selectedApartmentData: state.apartmentState.seleletedApatment,
    unitUpdatesSuccess: state.homeState.unitUpdatesLoadSuccess,
    unitChangesStatus: state.homeState.unitChangesStatus,
    
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnitUpdate);
