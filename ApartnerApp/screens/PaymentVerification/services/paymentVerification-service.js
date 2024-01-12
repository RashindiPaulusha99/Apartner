import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const callAddPaymentConfirmationApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const paymentData = await axios.post(
      `${apiUrl}/api/v1/payments/addInvoicePaymentConfirmation`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return paymentData;
  } catch (err) {
    throw err;
  }
};

export const callPaymentConfirmationApi = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const paymentData = await axios.post(
      `${apiUrl}/api/v1/payments/payementConfirmation`,
      dataParams,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return paymentData;
  } catch (err) {
    throw err;
  }
};
