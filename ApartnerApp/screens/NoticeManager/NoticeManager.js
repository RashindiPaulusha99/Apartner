import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  Image,
  Modal,
  View,
  StatusBar,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  NativeModules,
  ScrollView,
} from 'react-native';
import {Overlay, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import ChangeUnitBottomSheet from '../../components/containers/ChangeUnitBottomSheet';
import {MainContainer, TopCardContainer} from '../../components';
import {getNoticeData, saveNoticeLogData} from './services/noticeData-service';
import testImage from '../../assets/images/app-intor.png';
import {setSelectedUnitAction} from '../MemberManagement/actions/apartment-action';
import configConstants from '../../config/constants';
import {getUserNoticesAction} from '../Home/actions/home-action';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import Pdf from 'react-native-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

function getServerAddress() {
  return configConstants.apiUrlWithPort;
}
const {width, height} = Dimensions.get('window');
const {StatusBarManager} = NativeModules;
let navigateParams = false;

const NoticeManagement = ({
  route,
  navigation,
  selectedApartmentData,
  apartmentUnitsList,
  selectedUnit,
  setSelectedUnit,
  loggedInUserData,
  userNoticesChange,
}) => {
  navigateParams =
    route.params !== undefined && route.params.fromMyUnit !== undefined
      ? route.params.fromMyUnit
      : false;
  const [units, setUnits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [PDFModalVisible, setPDFModalVisible] = useState(false);
  const [apartmentRelationshipDataList, setApartmentRelationshipDataList] =
    useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickState, setClickState] = useState({});

  const [statusBarHeight, setStatusBarHeight] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [iosPdfHandlerClick, setIosPdfHandlerClick] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight(({height}) => {
        setStatusBarHeight(height);
      });
    } else {
      setStatusBarHeight(StatusBar.currentHeight);
    }
  }, []);

  useEffect(() => {
    initDataInPage();
  }, [selectedUnit]);
  const initDataInPage = async () => {
    setIsLoading(true);

    try {
      setUnits(apartmentUnitsList);
      setApartmentRelationshipDataList([]);
      const getData = await getNoticeData({
        complexId: selectedApartmentData.key,
        userId: loggedInUserData.user_id,
      });
      if (
        getData.data.body.statusCode != undefined &&
        getData.data.body.statusCode === 401
      ) {
        AsyncStorage.clear();
        navigation.navigate('SpalshScreen');
      } else {
        let sortList = getData.data.body.dataList.sort((a, b) =>
          a.type < b.type ? 1 : b.type < a.type ? -1 : 0,
        );
        setApartmentRelationshipDataList(sortList);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const getDataSave = async () => {
    setIsLoading(true);

    try {
      const getData = await getNoticeData({
        complexId: selectedApartmentData.key,
        userId: loggedInUserData.user_id,
      });

      let sortList = getData.data.body.dataList.sort((a, b) =>
        a.type < b.type ? 1 : b.type < a.type ? -1 : 0,
      );
      setApartmentRelationshipDataList(sortList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOverlay = () => {
    setIsLoading(true);
    setIosPdfHandlerClick(true);
    setPDFModalVisible(true);
  };

  const navigateToHome = () => {
    if (navigateParams) {
      navigation.navigate('MyUnit');
    } else {
      navigation.goBack();
    }
  };
  // const navigateToHome = () => {
  //   navigation.goBack();
  // };
  const noticeListClickHandler = notice => {
    setIsLoading(true);
    setClickState(notice);
    if (notice.notice_image != null) {
      const splitName = notice.notice_image.split('\\');
      const splitFileName = splitName[splitName.length - 1].split('-');
      setFileName(splitFileName[splitFileName.length - 1]);
      const splitType = notice.notice_image.split('.');
      setFileType(splitType[splitType.length - 1]);
    }
    setModalVisible(true);

    saveData(notice);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const saveData = async notice => {
    try {
      const dataParams = {
        complexId: selectedApartmentData.key,
        userId: loggedInUserData.user_id,
        noticeId: notice.notice_id,
      };
      const saveDataResponse = await saveNoticeLogData(dataParams);
    } catch (e) {}
  };
  const onClose = async () => {
    setIsLoading(false);
    const dataparams = {
      complexId: selectedApartmentData.key,
      userId: loggedInUserData.user_id,
    };
    await userNoticesChange(dataparams);
    setModalVisible(false);
    setPDFModalVisible(false);
    initDataInPage();
  };
  const onCloseModal = async () => {
    setPDFModalVisible(false);
    setIsLoading(false);
    setIosPdfHandlerClick(false);
    setModalVisible(false);
    getDataSave();
  };
  const getUrlExtension = url => {
    const sPlitedUrl = url.split(/[#?]/)[0].split('.').pop().trim();
    return sPlitedUrl;
  };
  const iosPdfHandler = callBack => {
    const url = encodeURI(
      `${getServerAddress()}/api/v1/assets/getAsset?filePath=${
        clickState.notice_image
      }`,
    );
    const extension = getUrlExtension(clickState.notice_image);

    const localFile = `${RNFS.DocumentDirectoryPath}/temporaryfile.${extension}`;

    const options = {
      fromUrl: url,
      toFile: localFile,
    };
    callBack(options);
  };

  const openTicketItem = ({item, i}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={i}
        onPress={() => noticeListClickHandler(item)}
        style={styles.tileListingContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.tileNameText}>
            {item.brief_description && item.brief_description.length > 30
              ? item.brief_description.substring(0, 30) + '...'
              : item.brief_description}
          </Text>
          <View style={styles.bottomRow}>
            <View style={styles.expiryContainer}>
              <Text style={styles.expiryTextContainer}>Recorded Date : </Text>

              <Text style={styles.tileRoleText}>
                {moment(item.recorded_date).format('DD/MM/YYYY')}
              </Text>
            </View>
            {item.type === 'read' ? (
              <View
                style={[
                  styles.rightSideTextContent,
                  {backgroundColor: '#84C7DD'},
                ]}>
                <Text style={styles.notificationStatus}>{item.type}</Text>
              </View>
            ) : (
              <View style={styles.rightSideTextContent}>
                <Text style={styles.notificationStatus}>{item.type}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //-----KEEP THIS-----
  // const IosPDFRender = () => {
  //   try {
  //     const [readerLoading, setReaderLoading] = useState(true);
  //     let options =
  //     useEffect(() => {
  //       setReaderLoading(false);
  //     }, [])

  //     return <></>;
  //   } catch (error) {
  //     return <></>;
  //   }
  // };

  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Notice Manager"
      changeUnitState={false}>
      <TopCardContainer
        customHeight={
          Platform.OS === 'android' ? '88%' : height * 0.85 - statusBarHeight
        }>
        <View style={styles.tileContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              apartmentRelationshipDataList ? apartmentRelationshipDataList : []
            }
            renderItem={openTicketItem}
            keyExtractor={item => item.recreational_location_id}
          />
          <LoadingDialogue visible={isLoading} />
        </View>
      </TopCardContainer>
      <Overlay
        ModalComponent={Modal}
        isVisible={modalVisible}
        animationType="slide"
        backdropStyle={{backgroundColor: 'transparent'}}
        overlayStyle={styles.modalView}
        onBackdropPress={() => onClose()}>
        <View>
          <View style={styles.popupTopContainer}>
            <Text style={styles.popupContainerText}>
              {clickState.brief_description}
            </Text>
          </View>
          <View style={styles.scroll} onStartShouldSetResponder={() => true}>
            <ScrollView style={{flex: 1}}>
              <View style={styles.descriptionMainViewContainer}>
                <Text style={styles.descriptionContainer}>Description</Text>
                <Text style={styles.descriptionDots}>:</Text>
                <Text style={styles.descriptionDetailContainer}>
                  {clickState.detailed_description}
                </Text>
              </View>
              <View style={styles.descriptionMainViewContainer}>
                <Text style={styles.descriptionContainer}>Recorded Date</Text>
                <Text style={styles.descriptionDots}>:</Text>
                <View style={styles.descriptionDetailContainer}>
                  <View style={styles.popupRoleTextContainer}>
                    <Text style={styles.tileRoleRecordedText}>
                      {moment(clickState.recorded_date).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.descriptionMainViewContainer}>
                <Text style={styles.descriptionContainer}>Sent by</Text>
                <Text style={styles.descriptionDots}>:</Text>
                <Text style={styles.descriptionDetailContainer}>
                  {'Condominium Management'}
                </Text>
              </View>
              <View style={styles.descriptionMainImageViewContainer}>
                <Text style={styles.descriptionContainer}>Notice image</Text>
                <Text style={styles.descriptionDots}>:</Text>

                <View style={styles.descriptionDetailContainer}>
                  {fileType != 'pdf' ? (
                    <Text></Text>
                  ) : (
                    <Text style={styles.pdfTextStyle} onPress={toggleOverlay}>
                      {fileName}
                    </Text>
                  )}
                </View>

                <View />
              </View>
              <View style={styles.imageViewStyles}>
                {fileType != 'pdf' ? (
                  <Image
                    style={styles.imageContainer}
                    source={{
                      uri: `${getServerAddress()}/api/v1/assets/getAsset?filePath=${
                        clickState.notice_image
                      }`,
                    }}
                  />
                ) : (
                  <Text></Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
        <LoadingDialogue visible={isLoading} />
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity
            style={styles.closeButtonMainContainer}
            onPress={() => onCloseModal()}>
            <Text style={styles.closeButtonTextContainer}>Close</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
      <Overlay
        isVisible={PDFModalVisible}
        ModalComponent={Modal}
        animationType="slide"
        backdropStyle={{backgroundColor: 'transparent'}}
        overlayStyle={styles.modalView}
        onBackdropPress={() => onClose()}>
        {clickState.notice_image != undefined &&
          iosPdfHandlerClick &&
          (Platform.OS === 'ios' ? (
            iosPdfHandler(options => {
              RNFS.downloadFile(options).promise.then(() =>
                FileViewer.open(options.toFile, {
                  onDismiss: () => {
                    setIosPdfHandlerClick(false);
                    setIsLoading(false);
                    setPDFModalVisible(false);
                  },
                }),
              );
            })
          ) : (
            <Pdf
              source={{
                uri: `${getServerAddress()}/api/v1/assets/getAsset?filePath=${
                  clickState.notice_image
                }`,
              }}
              onError={error => {
                console.log(error);
              }}
              // onPressLink={uri => {
              //   toggleOverlay();
              // }}
              style={styles.pdf}
              trustAllCerts={false}
            />
          ))}
      </Overlay>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageViewStyles: {
    width: '100%',
    height: '100%',
  },
  gateUpdateXBDropDown: {
    width: '100%',
    height: height * 0.045,
    backgroundColor: '#F5F7FD',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: width * 0.015,
    alignItems: 'center',
    borderColor: '#84C7DD',
    borderWidth: 1,
  },
  topCardContainer: {
    width: '100%',
    paddingHorizontal: width * 0.13,
    marginVertical: height * 0.02,
  },

  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#004F71',
    lineHeight: 32,
  },

  rightSideTextContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#087395',
    borderRadius: 8,
  },
  notificationStatus: {
    marginHorizontal: 8,
    marginVertical: 2,
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },

  scroll: {
    height: height * 0.77,
  },

  gateUpdateDropText: {
    color: '#212322',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },

  tileContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tileListingContainer: {
    width: '92%',
    marginHorizontal: '4%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: width * 0.02,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  textContainer: {
    justifyContent: 'center',
  },
  tileRightSide: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSideText: {
    fontSize: 11,
    fontFamily: 'Roboto-Regular',
    color: '#9B9B9B',
    lineHeight: 16,
  },
  tileNameText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
    textTransform: 'capitalize',
  },

  popupRoleTextContainer: {
    alignItems: 'baseline',
  },
  tileRoleText: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#26272C',
  },
  tileRoleRecordedText: {
    // {.......BUG BASH COMMENT.......}
    // backgroundColor: '#069D8E',
    // width: 'auto',
    // paddingHorizontal: 8,
    // paddingVertical: 2,
    // borderRadius: 25,
    // fontSize: 11,
    // fontFamily: 'Roboto-Medium',
    // color: '#FFFFFF',
    // textTransform: 'uppercase',
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#26272C',
  },

  statusText: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#9B9B9B',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 5,
  },
  expiryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  expiryTextContainer: {
    fontSize: 13,
    fontFamily: 'Roboto-Medium',
    color: '#9B9B9B',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  popupContainerText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#004F71',
  },
  popupTopContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  descriptionContainer: {
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
    color: '#9B9B9B',
    width: '30%',
  },
  descriptionMainViewContainer: {
    flexDirection: 'row',
    marginVertical: height * 0.015,
  },
  descriptionDots: {
    marginRight: '2%',
  },
  descriptionMainImageViewContainer: {
    flexDirection: 'row',
    marginVertical: height * 0.015,
  },
  headerName: {
    flexDirection: 'row',
    flex: 6,
    backgroundColor: 'red',
    // justifyContent:""
  },
  descriptionDetailContainer: {
    fontSize: 13,
    fontFamily: 'Roboto-Bold',
    color: '#212322',
    flex: 2,
  },
  closeButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonMainContainer: {
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 42,
    backgroundColor: '#DBEAEF',
    borderWidth: 1,
    borderRadius: 25,
  },
  closeButtonTextContainer: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#0E9CC9',
  },
  imageContainer: {
    marginVertical: height * 0.01,
    height: 200,
    width: '100%',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 5,
  },
  pdfTextStyle: {
    color: '#004F71',
    textDecorationLine: 'underline',
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,
  memberListChange: state.memberDetailsState.getMemberDetailsChange,
  tenantListChange: state.memberDetailsState.getTenantChangeDetails,
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  userNoticesChange: payload => dispatch(getUserNoticesAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoticeManagement);
