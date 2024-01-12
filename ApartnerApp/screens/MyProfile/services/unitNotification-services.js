import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

const getNotificationCountApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/notification/notificationCount`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};
const getNotificationImagesApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/notificationDocument/notificationDocument`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const getApartmentComplex = async id => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/apartmentComplex/${id}`,
      // {
      //   params: dataParams,
      // }
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const saveMemberOfUnitApi = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.post(
      `${apiUrl}/api/v1/mobile/apartment/member`,
      data,
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const getVisitorNotication = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/visitors/notification`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const getApartmentUnitsRelationsShipOfUser = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getApartmentUnitsRelationsShipOfUser`,
      {
        params: dataParams,
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};
export {
  getApartmentUnitsRelationsShipOfUser,
  getNotificationCountApi,
  getApartmentComplex,
  saveMemberOfUnitApi,
  getNotificationImagesApi,
  getVisitorNotication,
};
