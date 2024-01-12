import React, {useState, Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  View,
  Text,
  TextInput,
  Switch,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import {Input} from 'react-native-elements';
import AppInitialSignUpContainer from '../../components/containers/AddTenantContainer';
import BackImage from '../../assets/images/arrow-ios-back-fill.svg';
import Aicon from '../../assets/images/Aicon.svg';
import PhotoUploader from './PhotoUploader';
import DateIcon from '../../assets/images/feather-calendar.svg';
import CameraIcon from '../../assets/icons/camera-icon.svg';
import formDatas from 'form-data';

import {saveTenantUser} from './services/tenant-service';
const {width, height} = Dimensions.get('window');

const AddTenant = ({navigation}) => {
  const [enableShift, setEnableShift] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [text, onChangeText] = React.useState('Useless Text');
  const [name, setName] = useState('');
  const [nicPassport, setNicPassport] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [imageResponse, setImageResponse] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const createAccount = async () => {
    let relationshipObj = {
      relationships: [
        {
          apartmentRowId: 1,
          apartmentId: 1,
          relationshipId: 2,
          createdBy: 1,
          desc: 'Tenant Added From Mobile',
        },
      ],
    };
    try {
      const updatedData = {
        firstName: name,
        nicPassport: nicPassport,
        contactPrimary: contactNo,
        email: email,
        dob: dob,
        usersType: 'tenant-users',
        userRole: 11,
        createdBy: 1,
        roleId: 1,
        userName: name,
      };
      const formData = new formDatas();
      const keys = Object.keys(updatedData);
      // formData.append("profile_pic", imageResponse);

      //const keysToEscape = ['profilePic'];
      keys.forEach(elementName => {
        //if (keysToEscape.indexOf(elementName) == -1) {
        // allowed to pass to form data
        formData.append(elementName, updatedData[elementName]);
        // }
      });
      if (relationshipObj !== null) {
        formData.append(
          'userAprtmentRelationships',
          JSON.stringify(relationshipObj),
        );
      }
      formData.append('profilePic', imageResponse);

      const saveUser = await saveTenantUser(formData);
    } catch (e) {}
  };

  const cameraPicChange = () => {
    setModalVisible(!modalVisible);
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      response => {
        // setImageResponse(response);
        if (response.uri) {
          let path = response.uri;
          if (!response.fileName) {
            response.fileName = path.split('/').pop();
          }
          // setProfilePic({uri: response.uri});
          setImageResponse({
            name: response.fileName,
            type: response.type,
            uri: path,
          });
          // setProfilePicStatus(true);
        }
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
      response => {
        setImageResponse(response);
      },
    );
  };

  return (
    <AppInitialSignUpContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={enableShift}
        style={styles.container}
        keyboardVerticalOffset={Platform.select({
          ios: () => 0,
          android: () => height * 0.1,
        })()}>
        <View style={styles.topCard}>
          <View style={styles.topRowContainer}>
            <TouchableOpacity
              // onPress={navigateToHome}
              style={styles.backBtnContainer}>
              <BackImage />
            </TouchableOpacity>
            <View>
              <View>
                <Text style={styles.mainTitle}>Add Tenant</Text>
                <Text style={styles.mainTitleExplore}>
                  Create tenant profile
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.bottomCardView}>
            <View style={styles.bottomCard}>
              <View style={styles.bottomCardView}>
                <View style={styles.userCard}>
                  <View style={styles.userIconView}>
                    <Aicon />
                  </View>
                  <Text style={styles.userText}>Create a user account</Text>
                  <View style={styles.containerToggle}>
                    <Switch
                      trackColor={{false: '#FFFFFF', true: '#FFFFFF'}}
                      thumbColor={isEnabled ? '#197B9A' : '#C8C8C8'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.residenceTextMainView}>
                <View style={styles.residenMainview}>
                  <Text style={styles.residenceText}>Residence Unit *</Text>
                  <View style={styles.gateUpdateXBDropDown}>
                    <RNPickerSelect
                      onValueChange={value => console.log(value)}
                      items={[{label: 'XB / 10'}]}>
                      <Text style={styles.gateUpdateDropText} />
                    </RNPickerSelect>
                  </View>
                </View>
                <View style={styles.residenMainviewImage}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.BackContainer}>
                    <CameraIcon />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>
                        Please Select an Option
                      </Text>
                      <TouchableOpacity
                        style={styles.bottonCardBottom}
                        onPress={() => cameraPicChange()}>
                        <View style={styles.bottonCardContainer}>
                          <Text style={styles.bottonCardContainerText}>
                            Camera
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.bottonCardBottom}
                        onPress={() => galleryPicChange()}>
                        <View style={styles.bottonCardContainer}>
                          <Text style={styles.bottonCardContainerText}>
                            Gallery
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
              <View>
                <View style={styles.inputw}>
                  <Input
                    inputContainerStyle={styles.referenceNote}
                    placeholder="Name *"
                    value={name}
                    onChangeText={text => {
                      setName(text != '' ? text : '');
                    }}
                  />
                </View>
                <View style={styles.inputw}>
                  <Input
                    inputContainerStyle={styles.referenceNote}
                    placeholder="NIC / Passport *"
                    value={nicPassport}
                    onChangeText={text => {
                      setNicPassport(text != '' ? text : '');
                    }}
                  />
                </View>
                <TouchableOpacity style={styles.inputDateView}>
                  <View style={styles.inputDateicon}>
                    <DateIcon />
                  </View>
                  <Input
                    inputContainerStyle={styles.referenceNoteView}
                    placeholder="Date of Birth "
                    keyboardType="numeric"
                    value={dob}
                    onChangeText={text => {
                      setDob(text != '' ? text : '');
                    }}
                  />
                </TouchableOpacity>
                <View />
                <View style={styles.inputw}>
                  <Input
                    inputContainerStyle={styles.referenceNote}
                    placeholder="Contact No. * "
                    keyboardType="numeric"
                    value={contactNo}
                    onChangeText={text => {
                      setContactNo(text != '' ? text : '');
                    }}
                  />
                </View>
                <View style={styles.inputw}>
                  <Input
                    inputContainerStyle={styles.referenceNoteEmail}
                    inputStyle={styles.inputField}
                    labelStyle={styles.inputLabel}
                    placeholder="Email Address *"
                    onFocus={() => setEnableShift(false)}
                    autoCapitalize="none"
                    autoComplete={false}
                    value={email}
                    onChangeText={text => {
                      setEmail(text != '' ? text : '');
                    }}
                  />
                </View>
              </View>

              <View style={styles.bottonCardBottomView}>
                <TouchableOpacity
                  style={styles.bottonCardBottom}
                  onPress={() => createAccount()}>
                  <View style={styles.bottonCardContainer}>
                    <View>
                      <Aicon />
                    </View>
                    <Text style={styles.bottonCardContainerText}>
                      Create Account
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppInitialSignUpContainer>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputMainContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },

  backBtnContainer: {
    marginTop: height * 0.03,
    marginLeft: width * 0.05,
    width: 20,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 26,
    color: '#004F71',
    marginTop: height * 0.02,
    fontWeight: 'bold',
  },

  topRowContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  mainTitleExplore: {
    fontSize: 12,
    color: '#89B2C4',
    fontFamily: 'Poppins-Bold',
  },
  bottomCard: {
    width: 364,
    height: 617,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  bottomCardView: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  userCard: {
    width: 332,
    height: 39,
    backgroundColor: '#EEFAFF',
    borderColor: '#89B2C4',
    borderWidth: 0.1,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerToggle: {
    width: 43,
    height: 24,
    borderColor: '#89B2C4',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    marginLeft: 115,
  },
  userIconView: {
    marginLeft: 15,
  },
  userText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    color: '#212322',
    marginLeft: 5,
  },
  gateUpdateXBDropDown: {
    width: 153,
    height: 39,
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    justifyContent: 'center',
  },
  residenceText: {
    fontSize: 16,
    color: '#C8C8C8',
    fontFamily: 'Poppins-Bold',
  },
  residenceTextMainView: {
    marginLeft: 15,
    marginTop: height * 0.05,
    marginBottom: height * 0.01,
    flexDirection: 'row',
  },

  inputText: {
    fontSize: 16,
    color: 'red',
  },
  referenceNote: {
    width: 332,
    height: 23,
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    color: '#C8C8C8',
    fontFamily: 'Poppins',
  },
  bottonCardBottom: {
    width: 331,
    height: 51,
    borderRadius: 16,
    backgroundColor: '#197B9A',
    justifyContent: 'center',
  },
  bottonCardBottomView: {
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  bottonCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottonCardContainerText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    marginLeft: 15,
  },
  inputw: {
    marginTop: height * 0.03,
  },
  residenMainview: {
    marginRight: 90,
  },
  inputDateView: {
    marginTop: height * 0.03,
    flexDirection: 'row',
  },
  referenceNoteView: {
    width: 300,
    height: 23,
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    color: '#C8C8C8',
    fontFamily: 'Poppins',
  },
  inputDateicon: {
    marginLeft: 12,
  },
  referenceNoteEmail: {
    width: 332,
    height: 23,
    borderColor: '#FFFFFF',
    borderBottomWidth: 1,
    color: '#C8C8C8',
    fontFamily: 'Poppins',
  },
});

export default AddTenant;
