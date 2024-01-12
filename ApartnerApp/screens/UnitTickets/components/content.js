import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

const DuePayments = () => {
  const [activeSections, setActiveSections] = useState([]);

  const SECTIONS = [
    {
      title: 'Personal Information',
    },
    {
      title: 'Apartment & Unit Information',
    },
    {
      title: 'Other Information',
    },
  ];

  const _onPressButton = () => {
    alert('You tapped the button!');
  };

  const _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };
  const _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  const _renderContent = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
        <View style={styles.innerContainer}>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="First Name"
            placeholderTextColor={'gray'}
            lable={'First Name'}
            labelStyle={styles.inputLableField}
            onChangeText={text => {
              setUserEmail(text != '' ? text : false);
            }}
          />
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="Last Name"
            placeholderTextColor={'gray'}
            lable={'Last Name'}
            labelStyle={styles.inputLableField}
            onChangeText={text => {
              setUserEmail(text != '' ? text : false);
            }}
          />
        </View>
        <View style={styles.innerContainer}>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="Birthday"
            placeholderTextColor={'gray'}
            lable={'First Name'}
            labelStyle={styles.inputLableField}
            onChangeText={text => {
              setUserEmail(text != '' ? text : false);
            }}
          />
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholder="NIC Number"
            placeholderTextColor={'gray'}
            lable={'Last Name'}
            labelStyle={styles.inputLableField}
            onChangeText={text => {
              setUserEmail(text != '' ? text : false);
            }}
          />
        </View>
      </View>
    );
  };

  const _updateSections = activeSections => {
    setActiveSections(activeSections);
  };

  return (
    <View style={styles.duePaymentView}>
      <View style={styles.memberTypeView}>
        <Text>Member Type</Text>
        <Button style={styles.button} onPress={_onPressButton} title="Family" />
        <Button style={styles.button} onPress={_onPressButton} title="Tenant" />
      </View>
      <View style={styles.personalInformationView}>
        <Accordion
          sections={SECTIONS}
          activeSections={activeSections}
          renderSectionTitle={_renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  duePaymentView: {
    flex: 1,
    width: '100%',
    height: '85%',
  },
  memberTypeView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  personalInformationView: {
    flex: 2,
  },
  otherInformationView: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  button: {
    marginBottom: 30,
    width: '50%',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderRadius: 12,
    padding: 20,
    height: '25%',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: 'white',
  },
  inputNameContainer: {
    top: 200,
    width: 320,

    marginLeft: 32,
  },
  inputContainerField: {
    flex: 1,
    width: 320,

    borderBottomColor: 'white',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    fontFamily: 'Roboto-Bold',
    color: 'white',
    fontSize: 16,
  },
  inputLableField: {
    fontFamily: 'Roboto-Regular',
    color: 'blue',
    fontSize: 16,
    marginLeft: 10,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  innerContainer: {
    width: '50%',
    flexDirection: 'row',
  },
});

export default DuePayments;
