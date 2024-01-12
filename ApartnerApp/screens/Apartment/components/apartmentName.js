import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {connect} from 'react-redux';

const ApartmentName = ({selectedApartmentData}) => {
  return (
    <React.Fragment>
      <View style={styles.apartmentNameContiner}>
        {/* <GradientHeader /> */}
        <View style={styles.apartmentName} />
        <Text style={styles.name}>{selectedApartmentData.complex_name} </Text>
        <Text style={styles.location}>
          {selectedApartmentData.complex_address}
        </Text>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  apartmentNameContiner: {
    position: 'relative',
    height: '10%',
    width: '100%',
    backgroundColor: '#31348B',
  },
  apartmentName: {
    backgroundColor: '#31348B',
  },
  name: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'Roboto-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Roboto-regular',
    color: '#BFBFBF',
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  selectedApartmentData: state.apartmentState.seleletedApatment,
});

export default connect(mapStateToProps)(ApartmentName);
