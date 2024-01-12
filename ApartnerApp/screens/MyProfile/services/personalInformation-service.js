import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';


export const getPersonalInformation = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getPersonalInformation`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const updatePersonalInformation = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const userData = await axios.patch(
      `${apiUrl}/api/v1/mobile/apartment/updatePersonalInformation`,
      dataParams,
    );
    return userData;
  } catch (err) {
    throw err;
  }
};
