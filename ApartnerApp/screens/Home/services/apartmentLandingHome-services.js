import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

const getVisitersParcelApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const visiterParcelData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getVisiterParcelData`,
      {
        params: dataParams,
      },
    );
    return visiterParcelData;
  } catch (err) {
    throw err;
  }
};

export const getUnitsAndApartments = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getUserApartmentUnits`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const getApartmentUpdatesPanelData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getApartmentUnitUpdates`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
export const getNoticeData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/noticeDataRouter/getNoticesForUser`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
export const getUnitsSummeryDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/unitDataRouter/getUnitsDetails`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export {getVisitersParcelApi};
