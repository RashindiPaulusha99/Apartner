import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const saveUserAddVisitor = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const addVisitorData = await axios.post(
      `${apiUrl}/api/v1/mobile/visitorDataRouter/saveVisitorData`,
      data,
    );
    return addVisitorData;
  } catch (err) {
    throw err;
  }
};
export const getVisitorData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const visitorData = await axios.get(
      `${apiUrl}/api/v1/mobile/visitorDataRouter/getVisitorData`,
      {
        params: dataParams,
      },
    );
    return visitorData;
  } catch (err) {
    throw err;
  }
};

export const updateVisitorData = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const visitorData = await axios.patch(
      `${apiUrl}/api/v1/mobile/visitorDataRouter/updateVisitorData`,
      data,
    );

    return visitorData;
  } catch (err) {
    throw err;
  }
};

export const deleteVisitorData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const visitorData = await axios.delete(
      `${apiUrl}/api/v1/mobile/visitorDataRouter/deleteVisitorData`,
      {params : dataParams}
    );

    return visitorData;
  } catch (err) {
    throw err;
  }
};

