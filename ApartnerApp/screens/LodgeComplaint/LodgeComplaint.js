import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {Overlay, Input} from 'react-native-elements';
import {connect} from 'react-redux';
import {MainContainer, TopCardContainer} from '../../components/';
import RightIcone from '../../assets/images/check.png';
import BottomSheet from '../../components/containers/ChangeComplaintType';
import BottomSheetPriority from '../../components/containers/changePriorityLevel';
import VectorIcons from 'react-native-vector-icons/MaterialIcons';
import userMissing from '../../assets/images/person-icon.png';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import UpIcon from '../../assets/icons/dropdown-arrow-up.svg';
import DownIcon from '../../assets/icons/dropdown-arrow-down.svg';
import {setTicketListAction} from '../TicketManager/actions/ticketManager-action';
import {saveTicketData} from './services/apartment-service';
import RNFormData from 'form-data';
import PopupTopNotification from '../../components/containers/PopUpTopNotification';
import formDatas from 'form-data';
import ImagePicker from 'react-native-image-crop-picker';
const {width, height} = Dimensions.get('window');

const LodgeComplaint = ({
  navigation,
  loggedInUserData,
  selectedUnit,
  selectedApartmentData,
  ticketStatusChange,
}) => {
  const [descriptiondata, setDescriptiondata] = useState('');

  const [checked, setChecked] = useState(false);
  const [CommonChecked, setCommonChecked] = useState(false);
  const [visibleBottomSheet, setVisibleBottomSheet] = useState(false);
  const [attachmentImageToDisplay, setAttachmentImageToDisplay] = useState(
    false,
  );
  const [visibleBottomSheetPriority, setVisibleBottomSheetPriority] = useState(
    false,
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const [notificationDisplayMessage, setNotificationDisplayMessage] = useState(
    '',
  );
  const [receivedSecurityCode, setReceivedSecurityCode] = useState(false);
  const [compliantDetails, setCompliantDetails] = useState('');
  const [priorityDetails, setPriorityDetails] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [enableAddVisitorButton, setEnableAddVisitorButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageResponse, setImageResponse] = useState(null);
  const [complaintSaving, setComplaintSaving] = useState(false);
  const [relatedStatus, setSelatedStatus] = useState('common');
  useEffect(() => {
    if (imageResponse != null && typeof imageResponse.uri !== 'undefined') {
      setAttachmentImageToDisplay(imageResponse.uri);
    }
    ticketStatusChange(false);
  }, [imageResponse]);
  useEffect(() => {
    validateForm();
    ticketStatusChange(false);
  }, [descriptiondata, compliantDetails, priorityDetails, imageResponse]);

  const navigateToHome = () => {
    navigation.goBack();
  };
  const keyboardDissmissHandler = () => {
    Keyboard.dismiss();
    setVisibleBottomSheet(false);
    setVisibleBottomSheetPriority(false);
  };
  const visibilityHandler = status => {
    setVisibleBottomSheet(status);
  };
  const visibilityHandlerPriority = status => {
    setVisibleBottomSheetPriority(status);
  };

  const bottomSheetOpen = () => {
    setVisibleBottomSheet(true);
  };
  const bottomSheetOpenPriority = () => {
    setVisibleBottomSheetPriority(true);
  };
  const saveTicket = async () => {
    setComplaintSaving(true);
    displayNotification(false, '');
    setSpinner(true);

    try {
      let dataParams = {
        ticketDescription: descriptiondata,
        ticketType: compliantDetails,
        ticketPriority: priorityDetails,
        relatedStatus: relatedStatus,
        ticketComplexId: selectedApartmentData.key,
        ticketUserId: loggedInUserData.user_id,
        ticketUnitId: selectedUnit.apartment_unit_id,
      };
      const formData = new formDatas();
      const keys = Object.keys(dataParams);
      keys.forEach(elementName => {
        formData.append(elementName, dataParams[elementName]);
      });
      if (imageResponse != null) {
        formData.append('ticketImage', imageResponse);
      }
      const saveUpdateEmergencyData = await saveTicketData(formData);
      if (saveUpdateEmergencyData.data.message == 'success') {
        ticketStatusChange(true);
        displayNotification('success', 'complaint Saved Successfully');
      } else {
        displayNotification('error', 'complaint Saving Failed');
      }
    } catch (error) {
      displayNotification('error', 'Error Occurred');
      setSpinner(false);
    }
  };
  const displayNotification = (type, message) => {
    setNotificationDisplayMessage(message);
    setShowNotification(type);

    if (type == 'success') {
      setTimeout(() => {
        setComplaintSaving(false);
        navigation.goBack();
      }, 2000);
    } else if (type == 'error') {
      setComplaintSaving(false);
    }
  };

  const unitHandler = complaintObject => {
    setCompliantDetails(complaintObject.group);
  };
  const unitHandlerPriority = priorityObject => {
    setPriorityDetails(priorityObject.group);
  };
  const validateForm = () => {
    let validation = false;
    if (
      descriptiondata != '' &&
      compliantDetails != '' &&
      imageResponse != null &&
      priorityDetails
    ) {
      validation = true;
    }
    setEnableAddVisitorButton(validation);
  };
  const complaintType = [
    {
      key: 1,
      group: 'water',
    },
    {
      key: 2,
      group: 'electricity',
    },
    {
      key: 3,
      group: 'floor_maintainance',
    },
    {
      key: 4,
      group: 'other',
    },
  ];
  const PriorityType = [
    {
      key: 1,
      group: 'high',
    },
    {
      key: 2,
      group: 'medium',
    },
    {
      key: 3,
      group: 'low',
    },
  ];
  const cameraPicChange = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      responses => {
        if (responses.assets) {
          let response = responses.assets[0];
          if (response.uri) {
            let path = response.uri;
            if (!response.fileName) {
              response.fileName = path.split('/').pop();
            }

            setImageResponse({
              name: response.fileName,
              type: response.type,
              uri: path,
            });
          }
        }
        setModalVisible(false);
      },
    );
  };

  const galleryPicChange = () => {
    setModalVisible(!modalVisible);
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      responses => {
        if (responses.assets) {
          let response = responses.assets[0];
          if (response.uri) {
            let path = response.uri;
            if (!response.fileName) {
              response.fileName = path.split('/').pop();
            }
            setImageResponse({
              name: response.fileName,
              type: response.type,
              uri: path,
            });
          }
        }
      },
    );
  };
  return (
    <MainContainer
      navigateToHome={navigateToHome}
      title="Lodge Complaint"
      subTitle="Add frequent or one-time visitors"
      keyboardDissmissHandler={keyboardDissmissHandler}
      changeUnitState={false}
      formContainer={true}>
      <TopCardContainer>
        <View style={styles.mainDetailContainer}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraHeight={130}
            extraScrollHeight={50}
            keyboardOpeningTime={0}>
            <View style={styles.mainDetailContentContainer}>
              <View style={styles.mainCheckBoxContainer}>
                <View style={styles.unitNameContainer}>
                  <Text style={styles.textTopContainer}>Unit Related</Text>
                  <TouchableOpacity
                    style={styles.iconCheckBoxContainer}
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setChecked(!checked);
                      setCommonChecked(false);
                      setSelatedStatus('unit');
                    }}>
                    {checked === true ? (
                      <Image source={RightIcone} />
                    ) : (
                      <Text />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.commonNameContainer}>
                  <Text style={styles.textTopContainer}>
                    Common Area Related
                  </Text>
                  <TouchableOpacity
                    style={styles.iconCheckBoxContainer}
                    status={CommonChecked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setCommonChecked(!CommonChecked);
                      setChecked(false);
                      setSelatedStatus('common');
                    }}>
                    {CommonChecked === true ? (
                      <Image source={RightIcone} />
                    ) : (
                      <Text />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View style={styles.contentMainContainer}>
                  <Text style={styles.mainAllTittleContainer}>
                    Complaint Type
                  </Text>
                  <TouchableOpacity
                    onPress={bottomSheetOpen}
                    style={styles.bottomSheetRelationshipBtn}>
                    <Text style={styles.residentUnitText}>
                      {compliantDetails}
                    </Text>
                    {visibleBottomSheet ? (
                      <UpIcon height={10} width={10} />
                    ) : (
                      <DownIcon height={10} width={10} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.contentMainContainer}>
                  <Text style={styles.mainAllTittleContainer}>
                    Priority Level
                  </Text>
                  <TouchableOpacity
                    style={styles.bottomSheetRelationshipBtn}
                    onPress={bottomSheetOpenPriority}>
                    <Text style={styles.residentUnitText}>
                      {priorityDetails}
                    </Text>
                    {visibleBottomSheetPriority ? (
                      <UpIcon height={10} width={10} />
                    ) : (
                      <DownIcon height={10} width={10} />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.contentMainContainerImage}>
                  <Text style={styles.mainAllTittleContainer}>Attachments</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.bottomSheetRelationshipBtnImage}>
                    <View style={styles.imageContainer}>
                      {attachmentImageToDisplay ? (
                        <Image
                          style={styles.profilePicture}
                          source={{uri: attachmentImageToDisplay}}
                        />
                      ) : (
                        <Text style={styles.residentUnitTextPlus}>+</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.contentMainContainer}>
                  <Input
                    placeholder="Description"
                    inputStyle={styles.inputField}
                    inputContainerStyle={styles.inputFieldContainer}
                    style={styles.dropdownText}
                    placeholderTextColor="#9B9B9B"
                    onChangeText={text => {
                      setDescriptiondata(text !== '' ? text : '');
                    }}
                    onFocus={() => {
                      setVisibleBottomSheet(false);
                      setVisibleBottomSheetPriority(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.buttonView}>
            <TouchableOpacity
              disabled={!enableAddVisitorButton || complaintSaving}
              style={
                enableAddVisitorButton
                  ? styles.buttonMainView
                  : styles.buttonMainViewDisabled
              }
              onPress={saveTicket}>
              <Text style={styles.buttonTextContainer}>Create Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TopCardContainer>
      <Overlay
        ModalComponent={Modal}
        isVisible={modalVisible}
        animationType="slide"
        backdropStyle={{backgroundColor: 'transparent'}}
        overlayStyle={styles.modalView}
        onBackdropPress={() => setModalVisible(false)}>
        <Text style={styles.modalText}>Please Select an Option</Text>
        <TouchableOpacity
          style={styles.bottonCardBottom}
          onPress={(() => cameraPicChange())}>
          <View style={styles.bottonCardContainer}>
            <Text style={styles.bottonCardContainerText}>Camera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottonCardBottom}
          onPress={() => galleryPicChange()}>
          <View style={styles.bottonCardContainer}>
            <Text style={styles.bottonCardContainerText}>Gallery</Text>
          </View>
        </TouchableOpacity>
      </Overlay>
      {visibleBottomSheet === true ? (
        <BottomSheet
          onVisible={visibleBottomSheet}
          visibilityHandler={visibilityHandler}
          height={[300, 0]}
          complaintType={complaintType}
          unitHandler={unitHandler}
          bottomSheetHeight={Platform.OS === 'ios' && [250, 300, 0]}
        />
      ) : null}
      {visibleBottomSheetPriority === true ? (
        <BottomSheetPriority
          onVisible={visibleBottomSheetPriority}
          visibilityHandler={visibilityHandlerPriority}
          height={[300, 0]}
          priorityLevel={PriorityType}
          unitHandler={unitHandlerPriority}
          bottomSheetHeight={Platform.OS === 'ios' && [250, 300, 0]}
   
        />
      ) : null}
      {showNotification && (
        <PopupTopNotification
          visible={showNotification}
          message={notificationDisplayMessage}
          navigation={navigation}
          type={showNotification}
        />
      )}
      <Overlay
        overlayStyle={{
          backgroundColor: 'transparent',
          padding: 0,
          marginTop: 0,
          justifyContent: 'center',
        }}
        fullScreen={true}
        backdropStyle={{backgroundColor: 'transparent'}}
        isVisible={spinner}>
        <ActivityIndicator size="large" color="#0E9CC9" />
      </Overlay>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainDetailContentContainer: {
    paddingHorizontal: width * 0.05,
  },
  bottonCardBottom: {
    marginVertical: 10,
    backgroundColor: '#DBEAEF',
    width: width * 0.35,
    height: height * 0.07,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#0E9CC9',
    borderWidth: 1.3,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Bold',
  },
  bottonCardContainerText: {
    textAlign: 'center',
    color: '#0E9CC9',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  bottonCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonMainView: {
    width: width * 0.87,
    height: height * 0.08,
    backgroundColor: '#0E9CC9',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMainViewDisabled: {
    width: width * 0.85,
    height: height * 0.08,
    backgroundColor: '#96BAC6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    alignItems: 'center',
  },
  buttonTextContainer: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Roboto-Bold',
  },
  mainDetailContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  iconCheckBoxContainer: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCheckBoxContainer: {
    flexDirection: 'row',
    marginTop: height * 0.02,
  },
  unitNameContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: width * 0.05,
  },
  commonNameContainer: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTopContainer: {
    fontSize: 14,
    color: '#9B9B9B',
    fontFamily: 'Roboto-Medium',
  },
  bottomSheetRelationshipBtn: {
    height: 30,
    width: '100%',
    borderRadius: 6,
    backgroundColor: '#F5F7FD',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#84C7DD',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentUnitText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    lineHeight: 21,
    color: '#212322',
  },
  mainAllTittleContainer: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,

    color: '#9B9B9B',
    marginBottom: height * 0.01,
  },
  contentMainContainer: {
    marginTop: height * 0.03,
  },
  inputField: {
    fontFamily: 'Roboto-Medium',
    color: '#212322',
    fontSize: 16,
  },
  inputFieldContainer: {
    height: 23,
    marginTop: height * 0.01,
    borderColor: '#C8C8C8',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    color: '#212322',
  },
  contentMainContainerImage: {
    marginTop: height * 0.03,
  },
  bottomSheetRelationshipBtnImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F5F7FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#84C7DD',
  },
  imageContainer: {
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
  },
  residentUnitTextPlus: {
    fontSize: 30,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  apartmentFacilityData: state.apartmentState.apartmentFacilities,
  apartmentFacilityDataItems: state.apartmentState.apartmentFacilityItems,
  loggedInUserData: state.signInState.userData,
  selectedUnit: state.apartmentState.selectedUnit,
});

const mapDispatchToProps = dispatch => ({
  ticketStatusChange: payload => dispatch(setTicketListAction(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LodgeComplaint);
