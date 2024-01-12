import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import RNFetchBlob from 'rn-fetch-blob';
import {getNotices} from './services/apartment-service';
import {apiUrlWithPort} from '../../config/constants';
import {Alert} from 'react-native';
import moment from 'moment';
import LoadingDialogue from '../../components/containers/LoadingDialogue';

const {width, height} = Dimensions.get('window');
const charLengthOfNoticeListHeader = 25;

const downloadPdf = documentPath => {
  const {config, fs} = RNFetchBlob;
  let PictureDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: PictureDir + '/me_',
      description: 'Downloading image.',
    },
  };
  config(options)
    .fetch(
      'GET',
      `${apiUrlWithPort}/api/v1/assets/getAsset?filePath=${documentPath}`,
    )
    .then(res => {});
};

const NewCircular = ({
  navigation,
  selectedApartmentData,
  loggedInUserData,
  init,
}) => {
  const [noticesList, setNoticesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initializePage = async () => {
    setIsLoading(true);
    try {
      const receivedNotices = await getNotices({
        requestedUserRole: 'resident-user',
        complexId: selectedApartmentData.key,
      });
      setNoticesList(receivedNotices.data.body);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializePage();
  }, [init]);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.mainContainer}>
        <View style={styles.topRowContainer}>
          <TouchableOpacity
            style={styles.BackContainer}
            onPress={() => {
              navigation.navigate('Home');
            }}>
            <BackImage />
          </TouchableOpacity>
          <Text style={styles.title}>New Circular Issued</Text>
        </View>
        <View style={styles.subTitleContentContainer}>
          <Text style={styles.subTitleContentText}>Management Council</Text>
        </View>
        <View style={styles.subContentLorenView}>
          <Text style={styles.subContentLorenText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s,
          </Text>
        </View>
        <View style={styles.subContentLorenViewDate}>
          <Text style={styles.dateContentLorenText}>Date</Text>
          <Text style={styles.monthContentLorenText}>
            {moment().format('MMM DD, YYYY')}
          </Text>
        </View>
        <LoadingDialogue visible={isLoading} />
        <View style={styles.mainCardContentircular}>
          {noticesList.map(notice => {
            return (
              <View style={styles.CardContentircular}>
                <View style={styles.CardContentircularMainView}>
                  <Text style={styles.CardContentircularCircularText}>
                    {notice.brief_description.length >
                    charLengthOfNoticeListHeader
                      ? notice.brief_description.substring(
                          0,
                          charLengthOfNoticeListHeader - 1,
                        ) + '...'
                      : notice.brief_description}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      downloadPdf(notice.notification_document_name)
                    }
                    style={styles.CardContentircularView}>
                    <Text style={styles.CircularTextView}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  BackContainer: {
    marginTop: height * 0.01,
    marginLeft: width * 0.04,
    width: 20,
  },
  mainContainer: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
  topRowContainer: {
    marginTop: width * 0.07,
    flexDirection: 'row',
    width: '100%',
    height: height * 0.06,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
  },
  subTitleContentContainer: {
    marginLeft: width * 0.09,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.019,
  },
  subTitleContentText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#89B2C4',
  },
  bottomrowContainer: {
    width: 414,
    height: 80,
    backgroundColor: '#EEFAFF',
    marginTop: height * 0.003,
  },
  subContentLorenText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#4D4D4D',
    lineHeight: 16,
  },
  subContentLorenView: {
    width: '80%',
    marginLeft: width * 0.09,
  },
  subContentLorenViewDate: {
    marginLeft: width * 0.09,
    marginTop: height * 0.04,
  },
  dateContentLorenText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4D4D',
  },
  monthContentLorenText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#4D4D4D',
  },
  CardContentircular: {
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: Platform.OS === 'ios' ? '#cccccc' : '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    width: 315,
    height: 69,
    backgroundColor: '#EEFAFF',
    borderRadius: 20,
    marginLeft: width * 0.09,
    borderColor: '#707070',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  CardContentircularView: {
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: Platform.OS === 'ios' ? '#cccccc' : '#000000',
    shadowOffset: {height: 0, width: 0},
    elevation: 5,
    width: 66,
    height: 36,
    borderRadius: 16,
    backgroundColor: '#89B2C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.17,
  },
  CardContentircularCircularText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#4D4D4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CardContentircularMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.02,
  },
  CircularTextView: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  mainCardContentircular: {
    marginTop: height * 0.02,
  },
});

const mapStateToProps = state => ({
  loggedInUserData: state.signInState.userData,
  selectedApartmentData: state.apartmentState.seleletedApatment,
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCircular);
