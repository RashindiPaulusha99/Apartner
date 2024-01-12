import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';



export const updateUserFirstTimeLogin = async dataParams => {
 
    try {
      const apiUrl = configConstants.apiUrlWithPort;
      const userData = await axios.patch(
        `${apiUrl}/api/v1/mobile/userDataRouter/updateUserFirstTimeLogin`,
        dataParams,
      );
      return userData;
    } catch (err) {
      throw err;
    }
  };

