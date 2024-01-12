import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';


export const getApartmentRelationshipData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const unitData = await axios.get(
      `${apiUrl}/api/v1/mobile/apartment/getApartmentRelationshipData`,
      {
        params: dataParams,
      },
    );
    return unitData;
  } catch (err) {
    throw err;
  }
};

