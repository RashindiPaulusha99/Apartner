import {
  getApartmentUpdatesPanelData,
  getNoticeData,
  getUnitsSummeryDataApi,
} from '../services/apartmentLandingHome-services';

export const GET_UNIT_UPDATES_PENDING = 'GET_UNIT_UPDATES_PENDING';
export const GET_UNIT_UPDATES_SUCCESS = 'GET_UNIT_UPDATES_SUCCESS';
export const GET_UNIT_UPDATES_ERROR = 'GET_UNIT_UPDATES_ERROR';

export const GET_UNIT_UPDATES_CHANGE = 'GET_MEMBER_DETAILS_CHANGE';

export const GET_USER_NOTICES = 'GET_USER_NOTICES';
export const GET_USER_Ticket = 'GET_USER_Ticket';

const getUnitUpdatesPending = status => ({
  type: GET_UNIT_UPDATES_PENDING,
  status,
});

const getUserNotices = (status, payload) => ({
  type: GET_USER_NOTICES,
  status,
  userNotices: payload,
});
const getUserTicket = (status, payload) => ({
  type: GET_USER_Ticket,
  status,
  userTickets: payload,
});

const getUnitUpdatesSuccess = (status, payload) => ({
  type: GET_UNIT_UPDATES_SUCCESS,
  status,
  unitUpdates: payload,
});

const getUnitUpdatesError = status => ({
  type: GET_UNIT_UPDATES_ERROR,
  status,
});

const getUnitUpdatesChange = status => ({
  type: GET_UNIT_UPDATES_CHANGE,
  status,
});

export const getUserNoticesAction = dataParams => {
  return async dispatch => {
    try {
      const response = await getNoticeData(dataParams);

      dispatch(getUserNotices(true, response.data.body.newDataCount));
    } catch (err) {
      throw err;
    }
  };
};
export const getUserTicketAction = dataParams => {
  return async dispatch => {
    try {
      const response = await getUnitsSummeryDataApi(dataParams);
      dispatch(getUserTicket(true, response.data.body.noOfTicketsUnReads));
    } catch (err) {
      throw err;
    }
  };
};

export const getUnitUpdatesAction = (dataParams, callback) => {
  return async dispatch => {
    dispatch(getUnitUpdatesPending(true));
    dispatch(getUnitUpdatesSuccess(false, {}));
    dispatch(getUnitUpdatesError(null));

    try {
      const response = await getApartmentUpdatesPanelData(dataParams);
      dispatch(getUnitUpdatesPending(false));
      if (response.data.message === 'success') {
        dispatch(getUnitUpdatesSuccess(true, response.data.body));
        callback();
      } else {
        dispatch(getUnitUpdatesError({message: 'Member details load fail'}));
      }
    } catch (err) {
      dispatch(getUnitUpdatesPending(false));
      dispatch(getUnitUpdatesError(err));
    }
  };
};

export const changeUnitUpdatesAction = (dataParams, successCallback) => {
  return async dispatch => {
    try {
      dispatch(getUnitUpdatesChange(dataParams));
      successCallback();
    } catch (err) {}
  };
};
