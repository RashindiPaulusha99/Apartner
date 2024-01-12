import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const getBookingHistory = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const bookingHistoryData = await axios.get(
      `${apiUrl}/api/v1/recreationalLocationsBooking`,
      {params: dataParams},
    );
    return bookingHistoryData;
  } catch (err) {
    throw err;
  }
};
export const getFacilityList = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityList = await axios.get(
      `${apiUrl}/api/v1/recreationalLocations/facilityLocations`,
      {params: dataParams},
    );
    return facilityList;
  } catch (err) {
    throw err;
  }
};
export const getBookingDataList = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityBookingList = await axios.get(
      `${apiUrl}/api/v1/mobile/facilityBooking`,
      {params: dataParams},
    );
    return facilityBookingList;
  } catch (err) {
    throw err;
  }
};

export const bookingFacility = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityBookingList = await axios.post(
      `${apiUrl}/api/v1/mobile/facilityBooking`,
      dataParams,
    );
    return facilityBookingList;
  } catch (err) {
    throw err;
  }
};

export const bookingCancelFacility = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const facilityBookingList = await axios.patch(
      `${apiUrl}/api/v1/mobile/facilityBooking/cancel`,
      dataParams,
    );
    return facilityBookingList;
  } catch (err) {
    throw err;
  }
};
