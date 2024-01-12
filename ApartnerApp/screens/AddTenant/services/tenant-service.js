import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

// const getApartmentComplex = async (id) => {
//   try {
//     const apiUrl = configConstants.apiUrlWithPort;
//     const apartmentUnitsData = await axios.get(
//       `${apiUrl}/api/v1/apartmentComplex/${id}`
//       // {
//       //   params: dataParams,
//       // }
//     );
//     return apartmentUnitsData;
//   } catch (err) {
//     throw err;
//   }
// };

export const saveTenantUser = async (dataParams) => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const apartmentUnitsData = await axios.post(
      `${apiUrl}/api/v1/user/`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return apartmentUnitsData;
  } catch (err) {
    console.log(err, 'ERERRR!');
    throw err;
  }
};
