import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const callGetApartmentUnitApi = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getUserApartmentUnits`,
      {
        params : dataParams
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const getDuePayments = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getDuePaymentsForUnit`,
      {
        params : dataParams
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const getNotices = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/notification/getNotificationsForUsers`,
      {
        params : dataParams
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
