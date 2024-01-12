import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  FlatList,
  Image,
} from 'react-native';
import PhoneIcon from '../../assets/images/local_phone_black_24dp.svg';
import Member from '../../assets/images/Profile-Photo.svg';
import {getComplexMoaUsers} from './services/apartment-service';
import {connect} from 'react-redux';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {MainContainer, TopCardContainer} from '../../components';
const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

const Directory = ({navigation, selectedApartmentData}) => {
  const [userStatus, setUserStatus] = useState('all');
  const [userList, setUserList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigateToBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    initDataInPage();
  }, [selectedTab]);

  const initDataInPage = async () => {
    setUserList([]);
    setIsLoading(true);
    let dataParams = {
      complexId: selectedApartmentData.key,
      moaUser: selectedTab === 1 ? true : undefined,
      type: userStatus,
      roleId: selectedTab === 2 ? 12 : undefined,
    };
    const moaUserList = await getComplexMoaUsers(dataParams);
    setUserList(moaUserList.data.dataList);
    setIsLoading(false);
  };

  const OfficeStaff = () => (
    <>
      <View style={styles.flatListContainer}>
        <LoadingDialogue visible={isLoading} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userList}
          renderItem={MembersList}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>
    </>
  );

  const MoaMembers = () => (
    <>
      <View style={styles.flatListContainer}>
        <LoadingDialogue visible={isLoading} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userList}
          renderItem={MembersList}
          keyExtractor={item => item.recreational_location_id}
        />
      </View>
    </>
  );
  const MembersList = ({item, i}) => (
    <TouchableOpacity style={styles.tileListingContainer}>
      <View style={styles.detailsContainer}>
        <View style={{flex: 1}}>
          <View style={{flex: 2, justifyContent: 'center'}}>
            <Text style={styles.textNameContainer}>{`${item.first_name} ${
              item.last_name
            }`}</Text>
            <Text style={styles.textPhoneNumberContainer}>{item.contact_primary}</Text>
          </View>
        </View>
      </View>
      <View style={styles.mainPositionView}>
        <Text style={styles.textPositionContainer}>
          {selectedTab === 1
            ? item.owners_association_designation
            : item.profession}
        </Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <MainContainer
      navigateToHome={navigateToBack}
      title="Directory"
      changeUnitState={false}>
      <TopCardContainer>
        <View style={styles.tabBox}>
          <View style={styles.tabButton}>
            <TouchableOpacity
              onPress={() => setSelectedTab(1)}
              style={[
                styles.leftTab,
                selectedTab === 1 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 1 && styles.selectedTabBtnText,
                ]}>
                Council
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab(2)}
              style={[
                styles.rightTab,
                selectedTab === 2 && styles.selectedTabContainer,
              ]}>
              <Text
                style={[
                  styles.tabBtnText,
                  selectedTab === 2 && styles.selectedTabBtnText,
                ]}>
                Office Staff
              </Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 1 ? <MoaMembers /> : <OfficeStaff />}
        </View>
      </TopCardContainer>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  tileListingContainer: {
    height: height * 0.145,
    backgroundColor: '#ffffff',
    marginVertical: height * 0.01,
    marginHorizontal: width * 0.01,
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    flexDirection: 'row',
    paddingRight: '2%',
  },
  flatListContainer: {
    marginHorizontal: width * 0.025,
    marginVertical: height * 0.03,
    height: height * 0.7,
  },
  tileListingContainerOffice: {
    backgroundColor: '#FFFFFF',
  },
  mainHeaderText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#26272C',
  },
  tabBox: {
    width: '100%',
    backgroundColor: 'transparent',
    height: height * 0.81,
    marginTop: height * 0.019,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {height: 0, width: 0},
  },
  tabButton: {
    flexDirection: 'row',
    height: height * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBtnText: {
    fontSize: 12,
    color: '#969696',
    fontFamily: 'Roboto-Bold',
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
    fontFamily: 'Roboto-Bold',
    color: '#212322',
  },
  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
    left: width * 0.05,
  },
  apartnerTextContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },

  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    width: width,
  },
  detailsContainer: {
    flex: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },
  mainPositionView: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  textNameContainer: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
  },
  textPhoneNumberContainer: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#004F71',
    marginTop: height * 0.01,
  },
  textPositionContainer: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    backgroundColor: '#069D8E',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
  },
});

const mapStateToProps = state => ({
  selectedApartmentData: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData[0],
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Directory);
