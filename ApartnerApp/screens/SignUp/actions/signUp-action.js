import AsyncStorage from '@react-native-community/async-storage';
import {
  callVerifyCodeSendApi,
  callConfirmVerifyCodeApi,
  callResetPasswordApi,
  checkPhoneNumberAvailabilityApi,
  checkOtpAvailabilityApi,
  checkPasswordValidApi,
} from '../services/signUp-service';

export const SET_SEND_VERIFY_CODE_PENDING = 'SET_SEND_VERIFY_CODE_PENDING';
export const SET_SEND_VERIFY_CODE_SUCCESS = 'SET_SEND_VERIFY_CODE_SUCCESS';
export const SET_SEND_VERIFY_CODE_ERROR = 'SET_SEND_VERIFY_CODE_ERROR';

export const SET_CONFIRM_VERIFY_CODE_PENDING =
  'SET_CONFIRM_VERIFY_CODE_PENDING';
export const SET_CONFIRM_VERIFY_CODE_SUCCESS =
  'SET_CONFIRM_VERIFY_CODE_SUCCESS';
export const SET_CONFIRM_VERIFY_CODE_ERROR = 'SET_CONFIRM_VERIFY_CODE_ERROR';

export const SET_RESET_PASSWORD_PENDING = 'SET_RESET_PASSWORD_PENDING';
export const SET_RESET_PASSWORD_SUCCESS = 'SET_RESET_PASSWORD_SUCCESS';
export const SET_RESET_PASSWORD_ERROR = 'SET_RESET_PASSWORD_ERROR';

export const RESET_SIGN_UP_STATE = 'RESET_SIGN_UP_STATE';
export const PHONE_NUMBER_STATE = 'PHONE_NUMBER_STATE';

export const CHECK_USER_PHONE_NUMBER_AVAILABILITY_PENDING =
  'CHECK_USER_PHONE_NUMBER_AVAILABILITY_PENDING';
export const CHECK_USER_PHONE_NUMBER_AVAILABILITY_SUCCESS =
  'CHECK_USER_PHONE_NUMBER_AVAILABILITY_SUCCESS';
export const CHECK_USER_PHONE_NUMBER_AVAILABILITY_ERROR =
  'CHECK_USER_PHONE_NUMBER_AVAILABILITY_ERROR';

export const CHECK_USER_OTP_AVAILABILITY_PENDING =
  'CHECK_USER_OTP_AVAILABILITY_PENDING';
export const CHECK_USER_OTP_AVAILABILITY_SUCCESS =
  'CHECK_USER_OTP_AVAILABILITY_SUCCESS';
export const CHECK_USER_OTP_AVAILABILITY_ERROR =
  'CHECK_USER_OTP_AVAILABILITY_ERROR';

export const SET_OTP_VALIDATED_USER_DATA = 'SET_OTP_VALIDATED_USER_DATA';

export const USER_PASSWORD_LOGIN_PENDING = 'USER_PASSWORD_LOGIN_PENDING';
export const USER_PASSWORD_LOGIN_SUCCESS = 'USER_PASSWORD_LOGIN_SUCCESS';
export const USER_PASSWORD_LOGIN_ERROR = 'USER_PASSWORD_LOGIN_ERROR';

const sendVerifyCodePending = sendVerifyStatus => ({
  type: SET_SEND_VERIFY_CODE_PENDING,
  payload: sendVerifyStatus,
});

const sendVerifyCodeSuccess = (sendVerifyStatus, data) => ({
  type: SET_SEND_VERIFY_CODE_SUCCESS,
  payload: sendVerifyStatus,
  data,
});

const sendVerifyCodeError = sendVerifyStatus => ({
  type: SET_SEND_VERIFY_CODE_ERROR,
  payload: sendVerifyStatus,
});

const confirmVerifyCodePending = confirmVerifyStatus => ({
  type: SET_CONFIRM_VERIFY_CODE_PENDING,
  payload: confirmVerifyStatus,
});

const confirmVerifyCodeSuccess = (confirmVerifyStatus, signUpUserId) => ({
  type: SET_CONFIRM_VERIFY_CODE_SUCCESS,
  payload: confirmVerifyStatus,
  signUpUserId,
});

const confirmVerifyCodeError = confirmVerifyStatus => ({
  type: SET_CONFIRM_VERIFY_CODE_ERROR,
  payload: confirmVerifyStatus,
});

const resetPasswordPending = resetPasswordStatus => ({
  type: SET_RESET_PASSWORD_PENDING,
  payload: resetPasswordStatus,
});

const resetPasswordSuccess = resetPasswordStatus => ({
  type: SET_RESET_PASSWORD_SUCCESS,
  payload: resetPasswordStatus,
});

const resetPasswordError = resetPasswordStatus => ({
  type: SET_RESET_PASSWORD_ERROR,
  payload: resetPasswordStatus,
});

const resetSignUpState = () => ({
  type: RESET_SIGN_UP_STATE,
});

const phoneNumberState = (status, data) => ({
  type: PHONE_NUMBER_STATE,
  payload: status,
  data,
});

const checkUserPhoneNumberAvailabilityPending = status => ({
  type: CHECK_USER_PHONE_NUMBER_AVAILABILITY_PENDING,
  payload: status,
});

const checkUserPhoneNumberAvailabilitySuccess = (status, data = null) => ({
  type: CHECK_USER_PHONE_NUMBER_AVAILABILITY_SUCCESS,
  payload: status,
  data,
});

const checkUserPhoneNumberAvailabilityError = status => ({
  type: CHECK_USER_PHONE_NUMBER_AVAILABILITY_ERROR,
  payload: status,
});

const checkUserOtpAvailabilityPending = status => ({
  type: CHECK_USER_OTP_AVAILABILITY_PENDING,
  payload: status,
});

const checkUserOtpAvailabilitySuccess = (status, data = null) => ({
  type: CHECK_USER_OTP_AVAILABILITY_SUCCESS,
  payload: status,
  data,
});

const checkUserOtpAvailabilityError = status => ({
  type: CHECK_USER_OTP_AVAILABILITY_ERROR,
  payload: status,
});

const checkUserIdAvailabilityPending = status => ({
  type: CHECK_USER_ID_PENDING,
  payload: status,
  data,
});

const checkUserIdAvailabilitySucess = status => ({
  type: CHECK_USER_ID_SUCCESS,
  payload: status,
  data,
});

const checkUserIdAvailabilityError = status => ({
  type: CHECK_USER_ID_ERROR,
  payload: status,
  data,
});

const setOtpValidatedUserData = data => ({
  type: SET_OTP_VALIDATED_USER_DATA,
  data,
});

const userPasswordLoginPending = status => ({
  type: USER_PASSWORD_LOGIN_PENDING,
  payload: status,
});

const userPasswordLoginSuccess = (status, data) => ({
  type: USER_PASSWORD_LOGIN_SUCCESS,
  payload: status,
  data,
});

const userPasswordLoginError = status => ({
  type: USER_PASSWORD_LOGIN_ERROR,
  payload: status,
});

export const sendVerifyCodeAction = dataParams => {
  return async dispatch => {
    dispatch(sendVerifyCodePending(true));
    dispatch(sendVerifyCodeSuccess(false, null));
    dispatch(sendVerifyCodeError(null));
    try {
      dispatch(sendVerifyCodePending(false));
      const response = await callVerifyCodeSendApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(sendVerifyCodeSuccess(true, dataParams));
      } else {
        dispatch(sendVerifyCodeError({message: 'Verify code send fail'}));
      }
    } catch (err) {
      dispatch(sendVerifyCodeError({message: 'Network error'}));
    }
  };
};

export const confirmVerifyCodeAction = dataParams => {
  return async dispatch => {
    dispatch(confirmVerifyCodePending(true));
    dispatch(confirmVerifyCodeSuccess(false, null));
    dispatch(confirmVerifyCodeError(null));
    try {
      dispatch(confirmVerifyCodePending(false));
      const response = await callConfirmVerifyCodeApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(confirmVerifyCodeSuccess(true, response.data.body.userId));
      } else {
        dispatch(confirmVerifyCodeError({message: 'Verify code wrong'}));
      }
    } catch (err) {
      dispatch(confirmVerifyCodeError({message: 'Network error'}));
    }
  };
};

export const resetPasswordAction = dataParams => {
  return async dispatch => {
    dispatch(resetPasswordPending(true));
    dispatch(resetPasswordSuccess(false));
    dispatch(resetPasswordError(null));
    try {
      dispatch(resetPasswordPending(false));
      const response = await callResetPasswordApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(resetPasswordSuccess(true));
      } else {
        dispatch(resetPasswordError({message: 'Verify code wrong'}));
      }
    } catch (err) {
      dispatch(resetPasswordError({message: 'Network error'}));
    }
  };
};

export const resetSignUpStateAction = () => {
  return async dispatch => {
    dispatch(resetSignUpState());
  };
};

export const phoneNumberStateAction = payload => {
  return async dispatch => {
    dispatch(phoneNumberState(true, payload));
  };
};

export const setUpdatedUserDataAction = payload => {
  return async dispatch => {
    dispatch(setOtpValidatedUserData(payload));
  };
};

export const checkUserPhoneNumberAvailabilityAction = (
  dataParams,
  callback,
) => {
  return async dispatch => {
    dispatch(checkUserPhoneNumberAvailabilityPending(true));
    dispatch(checkUserPhoneNumberAvailabilitySuccess(false));
    dispatch(checkUserPhoneNumberAvailabilityError(null));
    try {
      dispatch(checkUserPhoneNumberAvailabilityPending(false));
      const response = await checkPhoneNumberAvailabilityApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(
          checkUserPhoneNumberAvailabilitySuccess(true, response.data.body),
        );
        callback(response.data.body);
      } else {
        dispatch(
          checkUserPhoneNumberAvailabilityError({message: 'Verify code wrong'}),
        );
      }
    } catch (err) {
      dispatch(checkUserPhoneNumberAvailabilityPending(false));
      dispatch(
        checkUserPhoneNumberAvailabilityError({message: 'Network error'}),
      );
      throw Error(err);
    }
  };
};

export const checkUserOtpAvailabilityAction = (dataParams, callback) => {
  return async dispatch => {
    dispatch(checkUserOtpAvailabilityPending(true));
    dispatch(checkUserOtpAvailabilitySuccess(false));
    dispatch(checkUserOtpAvailabilityError(null));
    try {
      dispatch(checkUserOtpAvailabilityPending(false));

      const response = await checkOtpAvailabilityApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(checkUserOtpAvailabilitySuccess(true, response.data.body));

        if (response.data.body.otpMatch) {
          dispatch(setOtpValidatedUserData(response.data.body.userData));
        }

        callback(response.data.body);
      } else {
        dispatch(checkUserOtpAvailabilityError({message: 'OTP code wrong'}));
      }
    } catch (err) {
      dispatch(checkUserOtpAvailabilityPending(false));
      dispatch(checkUserOtpAvailabilityError({message: 'Network error'}));
    }
  };
};

export const userLoginWithPasswordAction = (
  dataParams,
  loginSuccessCallback,
) => {
  return async dispatch => {
    dispatch(userPasswordLoginPending(true));
    dispatch(userPasswordLoginSuccess(false, null));
    dispatch(userPasswordLoginError(null));
    try {
      dispatch(userPasswordLoginPending(false));

      const response = await checkPasswordValidApi(dataParams);
      if (response.data.message === 'success') {
        AsyncStorage.setItem('token', response.data.body.token);
        dispatch(userPasswordLoginSuccess(true, response.data.body));
        dispatch(setOtpValidatedUserData(response.data.body.data[0]));
        loginSuccessCallback(response.data.body.data[0]);
      } else {
        dispatch(
          userPasswordLoginError({
            message: 'Password doesn’t match. Please try again',
          }),
        );
      }
    } catch (err) {
      dispatch(userPasswordLoginPending(false));
      dispatch(userPasswordLoginSuccess(false, null));
      dispatch(userPasswordLoginError({message: 'Network error'}));
    }
  };
};
