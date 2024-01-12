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
 
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};

const saveUnitTicket = async (dataParams) => {
  try {  
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.post(
      `${apiUrl}/api/v1/tickets`,
      dataParams
    );
    return apartmentUnitsData;
  } catch (err) {
    throw err;
  }
};


export {
  getApartmentComplexesApi,
  getApartmentComplex,
  saveUnitTicket};
