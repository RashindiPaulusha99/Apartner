import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const callVerifyCodeSendApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/auth/sendVerifyCode`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const callConfirmVerifyCodeApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/auth/confirmVerifyCode`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const callResetPasswordApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/auth/resetPassword`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const checkPhoneNumberAvailabilityApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.get(
      `${apiUrl}/api/v1/mobile/auth/checkPhoneNumberAvailability`,
      {
        params: dataParams,
      },
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const checkOtpAvailabilityApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/mobile/auth/checkLoginOtp`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const checkPasswordAvailabilityApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.get(
      `${apiUrl}/api/v1/mobile/auth/checkPasswordAvailability`,
      {
        params: dataParams,
      },
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const confirmPasswordApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/auth/savePassword`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const resetPasswordApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/auth/resetForgetPassword`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};
export const checkPasswordValidApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/auth/login`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const sendForgotPasswordEmail = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/user/sendForgotPasswordEmail`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const getCountryCodes = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.get(
      `${apiUrl}/api/v1/mobile/constantRouter/getCountries`,
      {
        params: dataParams,
      },
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const saveUserLoginDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/mobile/userDataRouter/saveUserLoginData`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const getUserPolicyAcceptedData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/mobile/userDataRouter/getUserPolicyAcceptedData`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

export const getIsNewUser = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/mobile/userDataRouter/getIsNewUser`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

export const updateCheckIsNewUser = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/userDataRouter/updateCheckIsNewUser`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};
