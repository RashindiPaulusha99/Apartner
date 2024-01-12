import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const getApartmentRelationshipData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getApartmentRelationshipData`,
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
export const saveNoticeLogData = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const addVisitorData = await axios.post(
      `${apiUrl}/api/v1/mobile/noticeDataRouter/addLogNotice`,
      data,
    );
    return addVisitorData;
  } catch (err) {
    throw err;
  }
};
