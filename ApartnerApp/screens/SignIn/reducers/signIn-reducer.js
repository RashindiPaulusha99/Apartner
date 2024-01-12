import {
  SET_LOGIN_PENDING,
  SET_LOGIN_SUCCESS,
  SET_LOGIN_ERROR,
  SET_LOGOUT_PENDING,
  SET_LOGOUT_SUCCESS,
  SET_LOGOUT_ERROR,
  RESET_SIGN_IN_STATE,
} from '../actions/signIn-action';

import {
  SET_OTP_VALIDATED_USER_DATA,
  USER_PASSWORD_LOGIN_ERROR,
  USER_PASSWORD_LOGIN_PENDING,
  USER_PASSWORD_LOGIN_SUCCESS

} from '../../SignUp/actions/signUp-action';

import {
  GET_USER_APARTMENT_LIST_ERROR,
  GET_USER_APARTMENT_LIST_PENDING,
  GET_USER_APARTMENT_LIST_SUCCESS,
} from '../../Apartment/actions/apartment-action';

const initialState = {
  isLoginSuccess: false,
  isLoginPending: false,
  loginError: null,
  userData: {},
  validUser: false,
  token: null,
  isLogOutSuccess: false,
  isLogOutPending: false,
  logOutError: null,
  userApartments: [],
};

const signInReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_PASSWORD_LOGIN_PENDING:
      return {...state, isLoginPending: action.payload};
    case USER_PASSWORD_LOGIN_ERROR:
      return {...state, loginError: action.payload};
    case USER_PASSWORD_LOGIN_SUCCESS:
      return {...state, isLoginSuccess: action.payload};
    case SET_LOGOUT_PENDING:
      return {...state, isLogOutPending: action.isLogOutPending};
    case SET_LOGOUT_SUCCESS:
      return {
        ...state,
        isLoginSuccess: false,
        userData: {},
      };
    case SET_LOGOUT_ERROR:
      return {...state, logOutError: action.logOutError};
    case GET_USER_APARTMENT_LIST_SUCCESS:
      return {
        ...state,
        userApartments: action.data,
      };
    case RESET_SIGN_IN_STATE:
      return {...initialState};
    case SET_OTP_VALIDATED_USER_DATA:
      return {
        ...state,
        isLoginSuccess: true,
        userData: action.data,
      };
    default:
      return state;
  }
};

export default signInReducer;
