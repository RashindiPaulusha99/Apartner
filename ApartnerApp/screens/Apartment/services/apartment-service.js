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
export const callGetApartmentFacilityApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityData = await axios.get(
      `${apiUrl}/api/v1/recreationalLocations/active`,
      {
        params: dataParams,
      },
    );
    return facilityData;
  } catch (err) {
    throw err;
  }
};
export const callGetApartmentFacilityItemsApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityData = await axios.get(
      `${apiUrl}/api/v1/recreationalLocations`,
      {
        params: dataParams,
      },
    );
    return facilityData;
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

export const getApartmentsListOfUserApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getUserApartmentComplexes`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

export const addComplexLastVisitTimeOfUserApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.post(
      `${apiUrl}/api/v1/mobile/apartment/addComplexLastVisitTimeOfUser`,
      dataParams,
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};
