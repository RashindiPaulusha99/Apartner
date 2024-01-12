import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';


export const getEmergencyContactDetails = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getEmergencyContactDetails`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const updateEmergencyContactDetails = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/apartment/updateEmergencyContactDetails`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};
