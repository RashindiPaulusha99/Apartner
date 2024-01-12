import {callLoginApi} from '../services/signIn-service';
import AsyncStorage from '@react-native-community/async-storage';

export const SET_LOGIN_PENDING = 'SET_LOGIN_PENDING';
export const SET_LOGIN_SUCCESS = 'SET_LOGIN_SUCCESS';
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR';

export const SET_LOGOUT_PENDING = 'SET_LOGOUT_PENDING';
export const SET_LOGOUT_SUCCESS = 'SET_LOGOUT_SUCCESS';
export const SET_LOGOUT_ERROR = 'SET_LOGOUT_ERROR';

export const RESET_SIGN_IN_STATE = 'RESET_SIGN_IN_STATE';

export const RESET_SIGN_IN_ERROR_STATE = 'RESET_SIGN_IN_ERROR_STATE';

const setLoginPending = isLoginPending => ({
  type: SET_LOGIN_PENDING,
  isLoginPending,
});

const setLoginSuccess = (
  isLoginSuccess,
  userData,
  validUser,
  token,
  apartments,
) => ({
  type: SET_LOGIN_SUCCESS,
  isLoginSuccess,
  userData: userData,
  validUser,
  token,
  apartments,
});

const setLoginError = loginError => ({
  type: SET_LOGIN_ERROR,
  loginError,
});

const setLogOutPending = isLogOutPending => ({
  type: SET_LOGOUT_PENDING,
  isLogOutPending,
});

const setLogOutSuccess = () => ({
  type: SET_LOGOUT_SUCCESS,
});

const setLogOutError = logOutError => ({
  type: SET_LOGOUT_ERROR,
  logOutError,
});

const resetSignInState = () => ({
  type: RESET_SIGN_IN_STATE,
});

export const loginAction = loginData => {
  return async dispatch => {
    dispatch(setLoginPending(true));
    dispatch(setLoginSuccess(false));
    dispatch(setLoginError(null));
    try {
      dispatch(setLoginPending(false));
      const response = await callLoginApi(loginData);
      if (response.data.message === 'success') {
        await AsyncStorage.setItem('token', response.data.body.token);
        dispatch(
          setLoginSuccess(
            true,
            response.data.body.data,
            response.data.body.validUser,
            response.data.body.token,
            response.data.body.complexData,
          ),
        );
      } else {
        dispatch(
          setLoginError({
            message: 'Incorrect username/password . Please try again',
          }),
        );
      }
    } catch (err) {
      dispatch(setLoginError({message: 'Network error'}));
    }
  };
};

export const signInErrorResetAction = () => ({
  type: RESET_SIGN_IN_ERROR_STATE,
});

export const logOutAction = () => {
  return async dispatch => {
    dispatch(setLogOutPending(true));
    dispatch(setLogOutSuccess(false));
    dispatch(setLogOutError(null));

    try {
      dispatch(setLogOutPending(false));
      const response = true;
      if (response) {
        dispatch(setLogOutSuccess());
      } else {
        dispatch(setLogOutError({message: 'User logout fail'}));
      }
    } catch (err) {
      dispatch(setLogOutError({message: 'Network error'}));
    }
  };
};

export const resetSignInStateAction = () => {
  return async dispatch => {
    dispatch(resetSignInState());
  };
};
