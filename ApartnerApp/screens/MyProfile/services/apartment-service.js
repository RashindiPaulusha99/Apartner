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

export const getDuePaymentsForUnit = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/payments/getDuePaymentsOfUnit`,
      {
        params: dataParams,
      },
    );
    return unitData;
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
