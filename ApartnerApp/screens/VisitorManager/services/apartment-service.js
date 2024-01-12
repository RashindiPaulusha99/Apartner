import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

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

const setParcelFlagApi = async dataParams => {
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

export {
  getVisitersParcelApi,
  setParcelFlagApi,
  getParcelsAccourdingToStatusApi,
};
