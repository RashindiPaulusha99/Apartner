import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('window');
const MyUnitButton = ({customStyle,myUnitSummery}) => {

    const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);

    useEffect(() => {
        if(myUnitSummery && myUnitSummery.noOfTickets != undefined){
            setUnreadTicketsCount(myUnitSummery.noOfTickets);
        }
    }, [myUnitSummery]);

  const MyUnitIconWithCount = () => {
      return (
        <View style={styles.noticesMainView}>
        <CIcon name="bed-king-outline" size={30} color="#969696" />
  
        <View style={styles.circle}>
          <Text style={styles.count}>
          {unreadTicketsCount > 9 ? '9+' : unreadTicketsCount}
          </Text>
        </View>
      </View>
      );
  };

  const BlankMyUnitsIcon = () => {
      return (
        <CIcon name="bed-king-outline" size={30} color="#969696" />
      )
  }



  if(unreadTicketsCount > 0){
    return <MyUnitIconWithCount/>;
  }else{
      return <BlankMyUnitsIcon />;
  }

};

const styles = StyleSheet.create({
  noticesMainView: {
    flexDirection: 'row',
  },

  circle: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#DD1C3A',
    alignItems: 'center',
    position: 'absolute',
    top: -1,
    right: -5,
  },
  count: {
    color: '#FFF',
    fontSize: 11,
  },
});

const mapStateToProps = state => ({
  userNoticesList: state.homeState.userNoticesList,
  userTicketList: state.homeState.userTicketList,
  myUnitSummery: state.homeState.myUnitSummery,
});

export default connect(mapStateToProps)(MyUnitButton);
