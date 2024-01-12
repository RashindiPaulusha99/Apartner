import React, {useState, useEffect} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import UpArrow from '../../../assets/icons/arrow-up.svg';
import DownArrow from '../../../assets/icons/arrow-down.svg';
const {width, height} = Dimensions.get('window');

function CollapseContent({navigation}) {
  const [activeSections, setActiveSections] = useState([]);
  const [userEmail, setUserEmail] = useState();
  const setSections = sections => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const PersonalInformationContent = () => (
    <View style={styles.form}>
      <View style={styles.innerContainer}>
        <View>
          <Text>First Name</Text>
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholderTextColor={'gray'}
            lable={'First Name'}
            labelStyle={styles.inputLableField}
          />
        </View>
        <View>
          <Text />
          <Input
            inputContainerStyle={styles.inputContainerField}
            inputStyle={styles.inputField}
            placeholderTextColor={'gray'}
            lable={'Last Name'}
            labelStyle={styles.inputLableField}
          />
        </View>
      </View>
    </View>
  );
  const CONTENT = [
    {
      id: 0,
      title: [{name: 'Personal Information'}],
      content: [{component: <PersonalInformationContent />}],
    },
    {
      id: 2,
      title: [{name: 'Apartment & Unit Information'}],
      content: [{component: <PersonalInformationContent />}],
    },
    {
      id: 3,
      title: [{name: 'Other Information'}],
      content: [{component: <PersonalInformationContent />}],
    },
  ];
  const renderHeader = (section, _, isActive) => (
    <View style={styles.collapseHeader}>
      {section.title.map((item, id) => (
        <Text key={item.id} style={styles.contentHeaderText}>
          {item.name}
        </Text>
      ))}

      {isActive ? (
        <DownArrow width={20} height={20} />
      ) : (
        <UpArrow width={20} height={20} />
      )}
    </View>
  );
  const renderContent = (section, _, isActive) => (
    <View style={styles.collapseContent}>
      {section.content.map((item, id) => (
        <View key={item.key} style={styles.collapseSortContentSection}>
          <View style={styles.collapseSortTextRow}>{item.component}</View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView>
      <View style={styles.bottomContiner}>
        <ScrollView>
          <View style={styles.page}>
            <View style={styles.section}>
              <Accordion
                activeSections={activeSections}
                sections={CONTENT}
                touchableComponent={TouchableOpacity}
                touchableProps={{activeOpacity: 1}}
                expandMultiple={false}
                renderHeader={renderHeader}
                renderContent={renderContent}
                duration={400}
                onChange={setSections}
              />
            </View>
            <View style={styles.confirmBtnContainer}>
              <TouchableOpacity style={styles.confirmBtnOverlay}>
                <View style={styles.cancelBtn}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.confirmBtn}>
                  <Text style={styles.confirmBtnText}>Confirm</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: width,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  section: {
    width: '100%',
  },

  collapseHeader: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: '8%',
    marginBottom: 10,
  },

  contentHeaderText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#23366A',
  },

  collapseSortTextRow: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  collapseSort: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#212F3C',
  },
  collapseSortText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
    color: '#212F3C',
  },
  collapseContent: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: '8%',
  },
  collapseContentTitle: {
    fontFamily: 'Lato-Bold',
    fontSize: 14,
    color: '#212F3C',
    marginBottom: 20,
  },
  confirmBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '8%',
  },
  confirmBtnOverlay: {marginLeft: 10},
  cancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 100,
  },
  confirmBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 110,
    borderRadius: 30,
    backgroundColor: '#4C84FF',
  },
  cancelBtnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: '#182850',
    borderBottomWidth: 1,
    borderBottomColor: '#182850',
  },
  confirmBtnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'white',
  },

  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  innerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default CollapseContent;
