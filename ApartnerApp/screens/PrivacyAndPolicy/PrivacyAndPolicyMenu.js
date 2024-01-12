import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import AppInitialSignUpContainer from '../../components/containers/AppInitialSignNew';
import BackImage from '../../assets/icons/new_ui/ic_arrow_back_24px_dark.svg';
import CountinueBtn from '../../assets/images/countinueBtn.svg';
import Apartnerlogo from '../../assets/images/Apartner-logo.svg';
import apartnerLogo from '../../assets/images/new_images/Logo_with_Tagline_statusbar3x.png';
import {color} from 'react-native-reanimated';
import {connect} from 'react-redux';
import RightIcone from '../../assets/images/check.png';
import DownloadIcon from '../../assets/images/file_download_black_24dp.svg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {updateUserFirstTimeLogin} from './services/privacyAndPolicy-service';
import {setUpdatedUserDataAction} from '../SignUp/actions/signUp-action';
import LoadingDialogue from '../../components/containers/LoadingDialogue';
import {userLoginWithPasswordAction} from '../SignUp/actions/signUp-action';

import {
  getUserApartmentsListAction,
  setSelectedApartmentAction,
} from '../Apartment/actions/apartment-action';

const {width, height} = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight;

const PrivacyAndPolicyMenu = ({
  navigation,
  loggedInUserData,
  setUpdatedUserData,
  getUserApartmentsList,
  userLoginWithPassword,
}) => {
  const [checked, setChecked] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const navigateToBack = () => {
    navigation.goBack();
  };

  const navigateToApartmentSelection = async () => {
    setSpinner(true);

    try {
      const response = await updateUserFirstTimeLogin({
        userId: loggedInUserData.user_id,
        userRowId: loggedInUserData.user_row_id,
      });

      getUserApartmentsList(
        {
          userId: loggedInUserData.user_id,
        },

        async responseData => {
          const response = await updateUserFirstTimeLogin(
            loggedInUserData.user_id,
          );
          if (response.data.body) {
            navigation.navigate('ApartmentSelection');
            setSpinner(false);
          } else {
            setSpinner(false);
          }
        },
      );
    } catch (error) {
      setSpinner(false);
    }
  };

  const TopRowContainer = () => {
    return (
      <View style={styles.topRowContainer}>
        <TouchableOpacity
          onPress={navigateToBack}
          style={styles.backBtnContainer}>
          <MaterialIcon name="arrow-back" size={24} color="#26272C" />
        </TouchableOpacity>

        <View style={styles.apartnerTextContainer}>
          <Image style={styles.logoImg} source={apartnerLogo} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <SafeAreaView style={{flex: 1}}>
        <View style={styles.topCard}>
          <View style={styles.topRowmainContainer}>
            <TopRowContainer />
            <View style={styles.mainTopConatainer}>
              <View style={styles.headerTextContainer}>
                <View style={styles.topHeaderPrivacyText}>
                  <Text style={styles.headerMainText}>Privacy Policy</Text>
                </View>

                <View style={styles.documentContainer}>
                  <ScrollView>
                    <Text style={styles.agreementTextSpaces}>
                      This Privacy Policy is between APARTNER PRIVATE LIMITED,
                      (“Service Provider”), and User (“User”) governing User's
                      use of the host of Products and Services of the Service
                      Provider (“Product”). This Privacy Policy constitutes a
                      legal agreement between you, as a user of the platform and
                      the company, as the provider of the product. You must be a
                      natural person who is at least 18 years of age.
                    </Text>

                    <Text style={styles.agreementTextSpaces}>
                      1. Introduction and applicability of the Privacy Policy:
                    </Text>

                    <Text style={styles.agreementTextSpaces}>
                      1.1. The Service Provider is strongly committed to
                      respecting User’s online privacy and recognize the need
                      for appropriate protection and management of any personal
                      information collected and/or collated by us.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      1.2. The purpose of this Privacy Policy is to ensure that
                      there is a framework to collect, use and protect any
                      personal and/or sensitive data collected by us. This
                      Policy defines our procedure for collection, usage,
                      processing, disclosure and protection of any information
                      obtained by Service Provider through the Platform.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      2. Disclaimer:
                    </Text>
                    <Text>
                      2.1. Please be advised that any Information (as defined
                      herein below) procured by us, shall be:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      a. processed fairly and lawfully for rendering the
                      Services;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      b. obtained only for specified and lawful purposes, and
                      not be used in any manner which is against the law or
                      policy in force (“Applicable Law”);
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      c. adequate, relevant and not excessive in relation to the
                      purpose for which it is required;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      d. able to be reviewed by the User, from time to time and
                      updated-if need arises; and
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      e. not kept longer than for the time which it is required
                      or the purpose for which it is required or as required by
                      the applicable law.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      2.2. By using the Product, User explicitly accepts,
                      without limitation or qualification, the collection, use
                      and transfer of the data in the manner described herein.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      2.3. Please read this privacy policy carefully as it
                      affects User's rights and liabilities under law.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      3. User's consent:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      3.1. Please note that by providing the Information (as
                      enumerated upon herein below), User provides User's
                      consent and authorizes Service Provider to collect, use or
                      disclose such Information for the business and research
                      purposes and as stated in this Privacy Policy, the Terms
                      of Service and as permitted or required by applicable law.
                      Moreover, the User understands and hereby consents that
                      this Information may be transferred to any third- party
                      user for the purpose of providing services through the
                      Platform or to any third-party providers for rendering
                      Services (as defined in the Terms of Service), any jointly
                      developed or marketed services, payment processing, order
                      fulfilment, customer services, data analysis, information
                      technology services and such other services which enable
                      Service Provider to provide Services through the Platform.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      3.2. This Privacy Policy shall be enforceable in the same
                      manner as any other written agreement. By visiting or
                      accessing the Platform and voluntarily providing Service
                      Provider with Information (including Personal Data), User
                      is consenting to Service Provider's use of Information, in
                      accordance with this Privacy Policy. If User do not agree
                      with this Privacy Policy, User may refuse or withdraw
                      User's consent any time, or alternatively choose to not
                      provide Service Provider with any Personal Information.
                      Under such circumstance, Service Provider may be unable to
                      render Services.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      3.3. Such an intimation to withdraw User's consent can be
                      sent to info@apartner.lk. The same shall be processed in
                      accordance to our Data Processing Agreement.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      4. Types of information collected by Service Provider:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      4.2. “Technical Information” means and includes any
                      Information gathered through various technologies that may
                      employ cookies, web beacons, or similar technologies to
                      automatically record certain information from User's
                      device through which User uses the Platform. This
                      technical information may include User's Internet Protocol
                      (IP) address, device or browser type, Internet service
                      provider (ISP), referring or exit pages, clickstream data,
                      operating system. This data includes usage information and
                      user statistics.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      4.3. “Locational Information” shall mean and include the
                      information obtained through GPS or other means, such as
                      the geographical location of the User.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      4.4. “Non-Personal Information” means and includes any
                      information that does not reveal User's specific identity,
                      such as, browser information, information collected
                      through Cookies (as defined below), pixel tags and other
                      technologies, demographic information, etc. As is true
                      with most websites, Service Provider gathers some
                      information automatically when User visits the Platform.
                      When User uses the Platform, Service Provider may collect
                      certain information about User's computer or mobile to
                      facilitate, evaluate and verify User's use of the
                      Platform. For example, Service Provider may store
                      environmental variables, such as browser type, operating
                      system, speed of the central processing unit (CPU),
                      referring or exit web pages, click patterns and the
                      internet protocol (IP) address of User's computer. This
                      information is generally collected in aggregate form,
                      without identifying any user individually. Non-Personal
                      Information shall also include information which is shared
                      with Service Provider to avail the Services, including,
                      but not limited to chats with Service Provider’s
                      representatives.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      (The Personal Data, Technical Information, Locational
                      Information and Non-Personal Information are collectively
                      referred to as “Information).
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      5. Purpose of Collection and Usage of this Information:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      5.1. The data collected by Service Provider shall be used
                      for maximizing the benefits availed by the User from the
                      Platform. Limited list of such functions given below:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      a. to render Services (as defined in the Terms of
                      Service);
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      b. maintaining the Platform;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      c. to evaluate the quality and competence of our
                      personnel;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      d. to resolve any complaints, User may have and ensure
                      that User receives the highest quality of Services;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      e. notifying User about changes to our Platform;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      f. allowing User to participate in interactive features of
                      our Platform when User chooses to do so;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      g. providing analysis or valuable information so that
                      Service Provider can improve the Platform;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      h. monitoring the usage of the Platform;
                    </Text>
                    <Text>
                      i. detecting, preventing and addressing technical issues.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      5.2. Business or Research Purposes: The Information saved
                      and except Personal Data, is used for business or research
                      purposes, including improving and customizing the Platform
                      for ease of use and the products and services offered by
                      us. Service Provider may archive this information to use
                      it for future communications for providing updates and/or
                      surveys.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      5.3. Aggregating Information / Anonymized data: Service
                      Provider may aggregate Information and analyse it in a
                      manner to further accentuate the level of services that
                      Service Provider offers to its customers. This Information
                      includes average number of Users of the Platform, the
                      average clicks of the services/, the features used, the
                      response rate, etc. and other such statistics regarding
                      groups or individuals. In doing so, Service Provider shall
                      not be making disclosures of any Personal Data as defined
                      above.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      6. Disclosure and Sharing of Information
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      6.1. The Service Provider does not rent, sell or disclose
                      or share any Information that Service Provider collects
                      from User, with third parties, save and except in order to
                      provide User with the Services in accordance with the
                      product functionality. In doing so Service Provider
                      adheres to the procedure prescribed by law and in
                      compliance with our legal obligations. Service Provider
                      may share User's Information in circumstances and for the
                      purposes as specified hereunder:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      a. Service Provider shall share the information to the
                      third-party service providers/ vendors, to provide User
                      with the Services as per Product Functionality;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      b. When compelled by law: Service Provider may disclose
                      any Information provided by User on the Platform as may be
                      deemed to be necessary or appropriate:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      i. under applicable law, including laws outside User's
                      country of residence; to comply with legal process;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      ii. to respond to requests from public and government
                      authorities including public and government authorities
                      including public and government authorities outside User's
                      country of residence;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      iii. to protect our operations or those of any of our
                      affiliates;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      iv. to protect our rights, privacy, safety or property,
                      and/that of our affiliates, User or others;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      v. to allow Service Provider to pursue available remedies
                      or limit the damages that Service Provider may sustain; or
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      vi. to protect against legal liability;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      vii. to protect the personal safety of Users of the
                      Platform;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      c. to prevent or investigate possible wrongdoing in
                      connection with the Platform. Merger or Acquisition:
                      Service Provider may, upon intimating User in advance,
                      share Information upon merger or acquisition of Service
                      Provider with another company. Service Provider shall
                      transmit and transfer the Information upon acquisition or
                      merger of Service Provider with another company;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      d. Employees /Agents of Service Provider: Service Provider
                      follows a strict confidentiality policy with regard to
                      disclosure of confidential information to our employees or
                      other personnel. There may be situations, where Service
                      Provider may disclose the confidential information only to
                      those of our employees and other personnel on a
                      need-to-know basis. Any breach of confidential information
                      by the employees, personnel within the Service Provider is
                      dealt stringently by us.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      6.2. Except for the Information disclosed pursuant to
                      sub-clause (a), (b), (c), (d) and (e) of Clause 6.1 above,
                      Service Provider may share Information, if User authorizes
                      Service Provider to do so.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      6.3. The Service Provider does not share Information to
                      any third party other than those specified under this
                      provision unless User's prior written consent is obtained
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      7. User's Rights
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      The User retains several rights in relation to User's
                      Personal Data as provided under applicable law. These may
                      include the rights to:
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      a. access, confirm, and review Personal Data User may have
                      provided;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      b. correct Personal Data that may be inaccurate or
                      irrelevant;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      c. deletion and erasure of User's Personal Data from the
                      publicly available pages of the Platform;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      d. receive Personal Data Service Provider holds about User
                      in a portable format;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      e. object to or restrict any form of processing User may
                      not be comfortable with;
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      In order to exercise these rights, please contact Service
                      Provider on the email address provided in Clause 3.3
                      above.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      8. Applications Used
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      9.1. The User may be availing our Services for using third
                      party mobile applications, which are not operated by us.
                      Service Provider strongly advises User to review the
                      privacy policy of every mobile application which User may
                      use.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      9.2. The Service Provider has no control over and assume
                      no responsibility for the content, privacy policies or
                      practices of any third-party mobile applications or
                      services.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      9. Children’s Privacy
                    </Text>
                    <Text>
                      If the Service Provider becomes aware that Service
                      Provider has collected Personal Data from children without
                      verification of parental consent, Service Provider takes
                      steps to remove that information from our servers.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      10. Retention of Information
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      All the Information provided by User, save and except upon
                      withdrawal or termination, shall be retained in locations
                      outside the direct control of Service Provider (for
                      instance, on servers or databases co-located with hosting
                      providers). However, Service Provider may retain such
                      portion of Information and for such periods as may be
                      required under Applicable Law. Notwithstanding anything
                      contained herein, Service Provider may retain data after
                      account deletion for reasons including but limited to the
                      following purposes: If there is an unresolved issue
                      relating to User's account, or an unresolved claim or
                      dispute; If Service Provider is required to by applicable
                      law; and/or in aggregated and/or anonymized form; or
                      Service Provider may also retain certain information if
                      necessary for its legitimate business interests, such as
                      fraud prevention and enhancing Users' safety and security.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      11. Cookies and other Tracking Technologies
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      11.1. Our Platform may utilize “cookies” and other
                      Technical Information. “Cookies” are a small text file
                      consisting of alphanumeric numbers used to collect the
                      Information about Platform activity. The Technical
                      Information helps Service Provider analyse web traffic and
                      helps User by customizing the Platform to User's
                      preferences. Cookies in no way gives Service Provider
                      access to User's computer or mobile device. In relation to
                      Cookies, User can deny access to the installation of the
                      Cookies by modifying the settings on User's web browser,
                      however, this may prevent User from taking full advantage
                      of the Platform.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      11.2. The use of Cookies and Technical Information allows
                      Service Provider to improve Platform and User's experience
                      of Platform and Services. Service Provider may also
                      analyse Technical Information that does not contain
                      Personal Data for trends and statistics.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      12. Third Party Service
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      The Service Provider may send User promotional Information
                      about third parties which, Service Provider think User may
                      find interesting. Service Provider shall not be
                      responsible for any disclosure of Information by User or
                      due to unauthorized third-party access or other acts of
                      third parties or acts or omissions beyond our reasonable
                      control and User agrees that User will not hold Service
                      Provider responsible for any breach of security unless
                      such breach has been caused as a direct result of our
                      negligence or willful default.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      13. Data Security
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      The Service Provider uses certain physical, managerial,
                      technical or operational safeguards as per industry
                      standards and established best practices to protect the
                      Information Service Provider collects. The Service
                      Provider uses reasonable security practices and procedures
                      and uses secure servers as mandated under applicable laws
                      for the protection of User's Information. Service Provider
                      reviews the Information collection, storage, and
                      processing practices, including physical security measures
                      to guard against unauthorized access to systems. However,
                      as effective as these measures are, no security system is
                      impenetrable. Service Provider cannot guarantee the
                      security of the database, nor can Service Provider
                      guarantee that the Information User supplies will not be
                      intercepted while being transmitted to Service Provider
                      over the internet. User accepts the inherent security
                      implications of data transmission over the internet and
                      the internet cannot always be guaranteed as completely
                      secure. Therefore, User's use of the Platform will be at
                      User's own risk. If User has any concerns, please feel
                      free to contact Service Provider at the details given in
                      clause 3.3.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      14. Changes and updates to Policy
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      The Service Provider may modify or revise the Privacy
                      Policy from time to time and shall accordingly notify User
                      of any changes to the Privacy Policy by posting the
                      revised Privacy Policy on the Platform with an updated
                      date of revision. Service Provider shall endeavour to
                      review, revise, update, modify, amend or correct the
                      Privacy Policy on a regular and routine basis, especially
                      whenever a significant update is made to the technology
                      employed. User must periodically review the Privacy Policy
                      for the latest information on Service Provider’s privacy
                      practices. In the event User continues to use the Platform
                      and Services after any update in the Privacy Policy,
                      User's use of the Platform shall be subject to such
                      updated privacy policy.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>15. Contact</Text>
                    <Text style={styles.agreementTextSpaces}>
                      15.1. Please feel free to reach out to Service Provider by
                      e-mail at info@apartner.lk in case of any concerns,
                      grievances, or questions relating to our privacy or data
                      related practices.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      16. Miscellaneous
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      The invalidity or unenforceability of any part of this
                      Privacy Policy shall not prejudice or affect the validity
                      or enforceability of the remainder of this Privacy Policy.
                      This Privacy Policy does not apply to any information
                      other than the information collected by Service Provider
                      through the Platform. This Privacy Policy shall be
                      inapplicable to any unsolicited information User provides
                      Service Provider through the Platform or through any other
                      means. All unsolicited information shall be deemed to be
                      non-confidential and Service Provider shall be free to use
                      and/ or disclose such unsolicited information without any
                      limitations. The rights and remedies available under this
                      Policy may be exercised as often as necessary and are
                      cumulative and not exclusive of rights or remedies
                      provided by law. Rights under this Policy may be waived
                      only in writing. Delay in exercising or non-exercise of
                      any such right or remedy does not constitute a waiver of
                      that right or remedy, or any other right or remedy.
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      18. User's acceptance of this Privacy Policy
                    </Text>
                    <Text style={styles.agreementTextSpaces}>
                      By using or visiting this Platform, user signifies user's
                      agreement of this policy. If User does not agree to any of
                      these terms, the User is advised to not use this platform
                      or services.
                    </Text>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
        <LoadingDialogue visible={spinner} />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTopConatainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '90%',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  mainContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: '#ffffff',
  },

  topCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topRowmainContainer: {
    flex: 4,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },

  topCardMaincontainer: {
    flex: 4,
    alignItems: 'center',
    marginTop: statusBarHeight,
  },
  bottomAcceptText: {
    fontSize: 14,
    color: '#087395',
    fontFamily: 'Roboto-Regular',
  },
  bottomAcceptContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
    paddingLeft: 25,
    alignItems: 'center',
  },

  mainTextHeaderContainer: {
    height: '25%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnContinueContainer: {
    alignItems: 'center',
  },
  iconCheckBoxContainer: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderColor: '#0E9CC9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadIcon: {
    width: 24,
    height: 24,

    zIndex: 10,
  },

  signInWith: {
    color: '#26272C',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Light',
    lineHeight: 28,
  },
  agreementTextSpaces: {
    paddingBottom: 4,
  },
  textEmail: {
    fontSize: 26,
    color: '#26272C',
    textAlign: 'center',
    fontFamily: 'Roboto-Black',
    lineHeight: 28,
    marginBottom: 5,
  },

  backBtnContainer: {
    width: 24,
    height: 24,
    position: 'absolute',
    zIndex: 10,
  },
  apartnerTextContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 0,
  },
  topHeaderPrivacyText: {
    paddingBottom: 20,
  },

  logoImg: {
    width: 80,
    height: 20,
  },

  mainTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: 'black',
    width: '70%',
  },
  toggleContainer: {
    paddingRight: 10,
  },

  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.08,
    paddingHorizontal: 10,
    borderBottomColor: '#FAFAFA',
    borderBottomWidth: 1,
    marginHorizontal: width * 0.05,
    backgroundColor: '#ffffff',
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerMainText: {
    fontSize: 26,
    color: '#26272C',
    fontFamily: 'Roboto-Bold',
  },
  documentContainer: {
    height: height * 0.78,
  },

  continueBtn: {
    alignItems: 'center',
    flex: 1,
  },

  apartnerLogo: {
    height: height * 0.2,
    paddingTop: 80,
    alignItems: 'center',
  },

  buttonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
    backgroundColor: '#0E9CC9',
    borderRadius: 20,
  },

  btnTextContainerEnable: {
    backgroundColor: '#0E9CC9',
    borderColor: '#087395',
    width: width * 0.93,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnTextContainerDisable: {
    backgroundColor: '#96BAC6',
    borderColor: '#96BAC6',
    width: width * 0.93,
    height: 42,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueArrow: {
    marginHorizontal: 10,
    position: 'absolute',
    right: '10%',
    height: 24,
    width: 24,
  },

  textContinue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  overlay: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    shadowColor: '#182850',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

const mapStateToProps = state => ({
  userApartments: state.signInState.userApartments,
  selectedApartmentData: state.apartmentState.seleletedApatment,
  loggedInUserData: state.signInState.userData,
  apartmentUnitsList: state.apartmentState.apartmentUnits,
});
const mapDispatchToProps = dispatch => ({
  setSelectedUnit: payload => dispatch(setSelectedUnitAction(payload)),
  setUpdatedUserData: payload => dispatch(setUpdatedUserDataAction(payload)),
  getUserApartmentsList: (payload, callback) =>
    dispatch(getUserApartmentsListAction(payload, callback)),
  userLoginWithPassword: (payload, callback) =>
    dispatch(userLoginWithPasswordAction(payload, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivacyAndPolicyMenu);
