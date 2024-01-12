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
export const updateTicketStatus = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.patch(
      `${apiUrl}/api/v1/mobile/ticketDataRouter/updateTicketDetails`,
      {
        dataParams: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
