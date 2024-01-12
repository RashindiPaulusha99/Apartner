import axios from "../../../config/axiosInstance";
import configConstants from "../../../config/constants";

const getApartmentComplexesApi = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/apartmentComplex`,
      {
        params: dataParams,
      }
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const getApartmentComplex = async (id) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/apartmentComplex/${id}`
      // {
      //   params: dataParams,
      // }
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};
const getUnitMembersData = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getUnitMembers`,
      {
          params: dataParams,
        }
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};


const saveMemberOfUnitApi = async (data) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.post(
      `${apiUrl}/api/v1/mobile/apartment/member`,
      data
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};


export {
  getApartmentComplexesApi,
  getApartmentComplex,
  saveMemberOfUnitApi,
  getUnitMembersData
};
