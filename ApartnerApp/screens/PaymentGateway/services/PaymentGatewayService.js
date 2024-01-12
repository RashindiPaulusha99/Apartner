import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

export const paymentGatewayPost = async data => {
  try {
    const paymentGatewayPostData = await axios.post(
      `https://testsecureacceptance.cybersource.com/pay`,
      data,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    );
    return paymentGatewayPostData;
  } catch (err) {
    return err;
    // throw err;
  }
};
