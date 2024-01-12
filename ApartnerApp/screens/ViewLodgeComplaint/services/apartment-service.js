import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const saveTicketData = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const addVisitorData = await axios.post(
      `${apiUrl}/api/v1/mobile/ticketDataRouter/saveTicketData`,
      data,
    );
    return addVisitorData;
  } catch (err) {
    return err;
  }
};
