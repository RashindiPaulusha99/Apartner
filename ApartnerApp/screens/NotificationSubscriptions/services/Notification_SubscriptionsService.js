import axios from '../../../config/axiosInstance';
import configConstants from '../../../config/constants';

const saveUserNotificationSubscription = async data => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const notificationSubscriptionsData = await axios.post(
      `${apiUrl}/api/v1/mobile/notificationSubscriptions`,
      data,
    );
    return notificationSubscriptionsData;
  } catch (err) {
    throw err;
  }
};

const getNotificationSubscriptionData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const notificationSubscriptionsData = await axios.get(
      `${apiUrl}/api/v1/mobile/notificationSubscriptions/getNotificationSubscriptionData`,
      {
        params: dataParams,
      },
    );
    return notificationSubscriptionsData;
  } catch (err) {
    throw err;
  }
};

export const getUserNotificationSubscriptionData = async dataParams => {
  try {
    const apiUrl = configConstants.apiUrlWithPort;
    const notificationSubscriptionsData = await axios.get(
      `${apiUrl}/api/v1/mobile/notificationSubscriptions/getUserNotificationSubscriptionData`,
      {
        params: dataParams,
      },
    );
    return notificationSubscriptionsData;
  } catch (err) {
    throw err;
  }
};
export {saveUserNotificationSubscription, getNotificationSubscriptionData};
