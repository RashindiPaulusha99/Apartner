import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

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
const getParcelsAccourdingToStatusApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const visiterParcelData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getParcelDataWithStatus`,
      {
        params: dataParams,
      },
    );
    return visiterParcelData;
  } catch (err) {
    throw err;
  }
};

export {updateParcelDetailsData, getParcelsAccourdingToStatusApi};
