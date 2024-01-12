import React, {useEffect, useState, useRef} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from 'react-native';
import TopSnackBar from 'rn-snackbar-component';
import PopupSuccessIcon from '../../assets/images/feather-check-circle-blue.svg';
import PopupErrorIcon from '../../assets/images/feather-error-circle-red.svg';
import PopupWarningIcon from '../../assets/images/feather-info-circle-yellow.svg';

const {height, width} = Dimensions.get('window');

const POPUP_AUTO_HIDE_TIME = 5000;
const POPUP_SPACE = StatusBar.currentHeight + height * 0.1;

const PopUpTopNotification = ({
  visible, 
  message,
  navigation,
  type
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setIsPopupVisible(visible);
  }, [visible]);

  if(type == "error"){
    return (
      <TopSnackBar
        visible={isPopupVisible}
        containerStyle={{
          flex : 1,
          backgroundColor: 'transparent',
          width: '100%',
          justifyContent: "center",
        }}
        message={
          <>        
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setIsPopupVisible(false);
              }}
              style={{
                backgroundColor: '#FFF3F5',
                //  marginVertical : 40,
                height: 52,
                borderRadius: 10,
                borderColor: '#F23B4E',
                borderWidth: 1,
                width: width * 0.9,
                justifyContent: 'center',
                paddingHorizontal: width * 0.05,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <PopupErrorIcon
                  style={{
                    color: '#F23B4E',
                    marginRight: 15,
                  }}
                />
  
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    lineHeight: 16,
                    color: '#F23B4E',
                    marginTop: 2,
                  }}>
                  {message}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        }
        autoHidingTime={POPUP_AUTO_HIDE_TIME}
        position="top"
        top={POPUP_SPACE}
        native={false}
      />
    );
  }else if(type == "warning"){
    return (
      <TopSnackBar
        visible={isPopupVisible}
        containerStyle={{
          flex : 1,
          backgroundColor: 'transparent',
          width: '100%',
          justifyContent: "center",
        }}
        message={
          <>        
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setIsPopupVisible(false);
              }}
              style={{
                backgroundColor: '#FFF8F2',
                //  marginVertical : 40,
                height: 52,
                borderRadius: 10,
                borderColor: '#F68D2E',
                borderWidth: 1,
                width: width * 0.9,
                justifyContent: 'center',
                paddingHorizontal: width * 0.05,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <PopupWarningIcon
                  style={{
                    color: '#F68D2E',
                    marginRight: 15,
                  }}
                />
  
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    lineHeight: 16,
                    color: '#F68D2E',
                    marginTop: 2,
                  }}>
                  {message}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        }
        autoHidingTime={POPUP_AUTO_HIDE_TIME}
        position="top"
        top={POPUP_SPACE}
        native={false}
      />
    );
  }else if(type == "success"){
    // the success notification
    return (
      <TopSnackBar
        visible={isPopupVisible}
        containerStyle={{
          flex : 1,
          backgroundColor: 'transparent',
          width: '100%',
          justifyContent: "center",
        }}
        message={
          <>        
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                setIsPopupVisible(false);
              }}
              style={{
                backgroundColor: '#EEFAFF',
                //  marginVertical : 40,
                height: 52,
                borderRadius: 10,
                borderColor: '#197B9A',
                borderWidth: 1,
                width: width * 0.9,
                justifyContent: 'center',
                paddingHorizontal: width * 0.05,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <PopupSuccessIcon
                  style={{
                    color: 'blue',
                    marginRight: 15,
                  }}
                />
  
                <Text
                  style={{
                    fontFamily: 'Poppins-Medium',
                    fontSize: 14,
                    lineHeight: 16,
                    color: '#004F71',
                    marginTop: 2,
                  }}>
                  {message}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        }
        autoHidingTime={POPUP_AUTO_HIDE_TIME}
        position="top"
        top={POPUP_SPACE}
        native={false}
      />
    );
  }else{
    return null;
  }
};

export default PopUpTopNotification;
