import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const getUserProfileData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getUserProfileData`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

export const updateUserProfileData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/userDataRouter/updateUserDetails`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const saveUserPassword = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/userDataRouter/saveUserPassword`,
      dataParams,
    );

    return userData;
  } catch (err) {
    throw err;
  }
};

export const saveUserEmail = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/userDataRouter/saveUserEmail`,
      dataParams,
    );

    return userData;
  } catch (err) {
    throw err;
  }
};
export const saveAndSendEmailOtp = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/user/saveAndSendEmailOtp`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};

export const checkEmailOtpAvailabilityApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.post(
      `${apiUrl}/api/v1/user/checkEmailOtp`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};
