import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

const getParcelDetailsData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const parcelDetailsData = await axios.get(
      `${apiUrl}/api/v1/mobile/parcelDetails/getParcelDetailsData`,
      {
        params: dataParams,
      },
    );
    return parcelDetailsData;
  } catch (err) {
    throw err;
  }
};

const updateParcelDetailsData = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const parcelDetailsData = await axios.patch(
      `${apiUrl}/api/v1/mobile/parcelDetails/updateParcelDetailsData`,
      data,
    );

    return parcelDetailsData;
  } catch (err) {
    throw err;
  }
};

export const saveParcelData = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const addParcelData = await axios.post(
      `${apiUrl}/api/v1/mobile/parcelDetails/createParcelDetailsData`,
      data,
    );
    return addParcelData;
  } catch (err) {
    return err;
  }
};

export {getParcelDetailsData, updateParcelDetailsData};
