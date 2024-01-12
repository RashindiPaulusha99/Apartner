import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-picker';
// import {captureProflieAvitar} from '../../actions';
import ImageIcon from '../../assets/images/ImagePickerIcon.svg';
var RNUploader = NativeModules.RNUploader;
class PhotoUploader extends Component {
  state = {
    avatarSource: null,
    imgBase64: [],
  };
  componentDidMount() {
    // upload progress
    DeviceEventEmitter.addListener('RNUploaderProgress', data => {
      const bytesWritten = data.totalBytesWritten;
      const bytesTotal = data.totalBytesExpectedToWrite;
      const progress = data.progress;
      console.log(bytesWritten, bytesTotal);
      console.log('upload progress: ' + progress + '%');
    });
  }

  selectPhotoTapped() {
    const options = {
      quality: 0.75,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source;
        // You can display the image using either:
        source = {
          uri: 'data:image/jpeg;base64,' + response.data,
          isStatic: true,
        };

        const temp = response.data;

        //Or:
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        this.setState({
          avatarSource: source,
          imgBase64: temp,
        });
      }
    });
  }

  doUpload() {
    const files = {
      filepath: `data:image/png;base64,${this.state.imgBase64}`,
    };
    const opts = {
      url:
        'https://central.tipflip.co?apior=MYAPIKEY&tfReqID3031&tfUserID=1&tfImage=',
      files,
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    };

    RNUploader.upload(opts, (err, response) => {
      if (err) {
        console.log(err);
        return;
      }
      const status = response.status;
      const responseString = response.data;
      const json = JSON.parse(responseString);
      console.log('upload complete with status ' + status);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            {this.state.avatarSource === null ? (
              <View style={styles.containerImage}>
                <ImageIcon />
              </View>
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    borderColor: '#707070',
    borderWidth: 2 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 88,
    height: 88,
  },
  containerImage: {},
});
export default connect(
  null,
  //   {captureProflieAvitar},
)(PhotoUploader);
