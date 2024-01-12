import {
  SET_SEND_VERIFY_CODE_PENDING,
  SET_SEND_VERIFY_CODE_SUCCESS,
  SET_SEND_VERIFY_CODE_ERROR,
  SET_CONFIRM_VERIFY_CODE_PENDING,
  SET_CONFIRM_VERIFY_CODE_SUCCESS,
  SET_CONFIRM_VERIFY_CODE_ERROR,
  SET_RESET_PASSWORD_PENDING,
  SET_RESET_PASSWORD_SUCCESS,
  SET_RESET_PASSWORD_ERROR,
  RESET_SIGN_UP_STATE,
  PHONE_NUMBER_STATE,
  CHECK_USER_PHONE_NUMBER_AVAILABILITY_ERROR,
  CHECK_USER_PHONE_NUMBER_AVAILABILITY_PENDING,
  CHECK_USER_PHONE_NUMBER_AVAILABILITY_SUCCESS,
  CHECK_USER_OTP_AVAILABILITY_PENDING,
  CHECK_USER_OTP_AVAILABILITY_ERROR,
  CHECK_USER_OTP_AVAILABILITY_SUCCESS,
  CHECK_USER_ID_PENDING,
  CHECK_USER_ID_ERROR,
  CHECK_USER_ID_SUCCESS,
} from '../actions/signUp-action';

const initialState = {
  sendVerifyCodePending: false,
  sendVerifyCodeSuccess: false,
  sendVerifyCodeError: null,
  confirmVerifyCodePending: false,
  confirmVerifyCodeSuccess: false,
  confirmVerifyCodeError: null,
  resetPasswordPending: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  phoneNumber:null,
  emailOrMobile: null,
  emailOrMobileType: null,
  signUpUserId: null,
  userPhoneNumberAlreadyRegistered: null,
  userPhoneNumberAvailabilityCheckPending: false,
  userPhoneNumberAvailabilityCheckSuccess: false,
  userPhoneNumberAvailabilityCheckError: false,

  userOtpAvailabilityCheckError: false,
  userOtpAvailabilityCheckSuccess: false,
  userOtpAvailabilityCheckPending: false,

  userIdAvailabilityCheckError: false,
  userIdAvailabilityCheckSuccess: false,
  userIdAvailabilityCheckPending: false,
};

const signUpReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEND_VERIFY_CODE_PENDING:
      return {...state, sendVerifyCodePending: action.payload};
    case SET_SEND_VERIFY_CODE_SUCCESS:
      return {
        ...state,
        sendVerifyCodeSuccess: action.payload,
        emailOrMobile: action.data ? action.data.emailOrMobile : null,
        emailOrMobileType: action.data ? action.data.type : null,
      };
    case SET_SEND_VERIFY_CODE_ERROR:
      return {...state, sendVerifyCodeError: action.payload};

    case SET_CONFIRM_VERIFY_CODE_PENDING:
      return {...state, confirmVerifyCodePending: action.payload};
    case SET_CONFIRM_VERIFY_CODE_SUCCESS:
      return {
        ...state,
        confirmVerifyCodeSuccess: action.payload,
        signUpUserId: action.signUpUserId,
      };
    case SET_CONFIRM_VERIFY_CODE_ERROR:
      return {...state, confirmVerifyCodeError: action.payload};

    case SET_RESET_PASSWORD_PENDING:
      return {...state, resetPasswordPending: action.payload};
    case SET_RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordSuccess: action.payload,
      };
    case SET_RESET_PASSWORD_ERROR:
      return {...state, resetPasswordError: action.payload};
    case RESET_SIGN_UP_STATE:
      return {...initialState};

    case PHONE_NUMBER_STATE:
      return {...state,
        phoneNumber:action.data
      };

    case CHECK_USER_PHONE_NUMBER_AVAILABILITY_PENDING:
      return {
        ...state,
        userPhoneNumberAvailabilityCheckPending: action.payload,
      };
    case CHECK_USER_PHONE_NUMBER_AVAILABILITY_ERROR:
      return {
        ...state,
        userPhoneNumberAvailabilityCheckError: action.payload,
      };
    case CHECK_USER_PHONE_NUMBER_AVAILABILITY_SUCCESS:
      return {
        ...state,
        userPhoneNumberAvailabilityCheckSuccess: action.payload,
        userPhoneNumberAlreadyRegistered:
          action.data && typeof action.data.userExists !== 'undefined'
            ? action.data.userExists
            : null,
      };

    case CHECK_USER_OTP_AVAILABILITY_PENDING:
      return {
        ...state,
        userOtpAvailabilityCheckPending: action.payload,
      };
    case CHECK_USER_OTP_AVAILABILITY_ERROR:
      return {
        ...state,
        userOtpAvailabilityCheckError: action.payload,
      };
    case CHECK_USER_OTP_AVAILABILITY_SUCCESS:
      return {
        ...state,
        userOtpAvailabilityCheckSuccess: action.payload,
      };


      case CHECK_USER_ID_PENDING:
        return{
          ...state,
          userIdAvailabilityCheckPending: action.payload,
        };

        case CHECK_USER_ID_ERROR:
          return{
            ...state,
            userIdAvailabilityCheckError: action.payload,
          };

          case CHECK_USER_ID_SUCCESS:
            return{
              ...state,
              userIdAvailabilityCheckSuccess: action.payload,
            };


    default:
      return state;
  }
};

export default signUpReducer;
