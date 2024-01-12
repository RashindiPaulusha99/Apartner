import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const saveUserAddVisitor = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const addVisitorData = await axios.post(
      `${apiUrl}/api/v1/mobile/apartment/member`,
      data,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return addVisitorData;
  } catch (err) {
    return err;
  }
};

export const updateMemberDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.patch(
      `${apiUrl}/api/v1/mobile/apartment/updateMemberTenantEnableUser`,
      dataParams,
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
