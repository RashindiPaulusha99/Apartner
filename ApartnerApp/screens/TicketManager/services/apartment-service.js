import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';
import axiosMain from 'axios';

export const callGetApartmentUnitApi = async dataParams => {
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

export const getDuePayments = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getDuePaymentsForUnit`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const saveTenantDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.post(
      `${apiUrl}/api/v1/mobile/apartment/tenant`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return unitData;
  } catch (err) {
    return err;
  }
};

export const updateMemberDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axiosMain.patch(
      `${apiUrl}/api/v1/mobile/apartment/member`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
export const updateIsEnabledUser = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axiosMain.patch(
      `${apiUrl}/api/v1/mobile/apartment/updateIsEnabledUser`,
      dataParams,
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};


export const getMemberDataApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/userDataRouter/getMemberAndTenentProfile`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const deleteTenantData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const tenantData = await axios.delete(
      `${apiUrl}/api/v1/mobile/apartment/deleteTenantData`,
      {params: dataParams},
    );

    return tenantData;
  } catch (err) {
    throw err;
  }
};

export const deleteMemberData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const memberDeleteStateData = await axios.delete(
      `${apiUrl}/api/v1/mobile/apartment/deleteTenantData`,
      {params: dataParams},
    );

    return memberDeleteStateData;
  } catch (err) {
    throw err;
  }
};
