import {getBookingHistory} from '../services/booking-service';

export const SELECTED_BOOKING_FACILITY = 'SELECTED_BOOKING_FACILITY';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';

export const GET_BOOKING_HISTORY_PENDING = 'GET_BOOKING_HISTORY_PENDING';
export const GET_BOOKING_HISTORY_SUCCESS = 'GET_BOOKING_HISTORY_SUCCESS';
export const GET_BOOKING_HISTORY_ERROR = 'GET_BOOKING_HISTORY_ERROR';
export const GET_BOOKING_HISTORY_CHANGE = 'GET_BOOKING_HISTORY_CHANGE';

export const selectedBookingFacilityAction = selectedBookingFacility => ({
  type: SELECTED_BOOKING_FACILITY,
  selectedBookingFacility,
});
export const setSelectedUnitAction = selectedUnit => ({
  type: SET_SELETED_UNIT,
  selectedUnit,
});

const getBookingHistoryPending = BookingHistoryLoadPending => ({
  type: GET_BOOKING_HISTORY_PENDING,
  BookingHistoryLoadPending,
});

const getBookingHistorySuccess = (BookingHistoryLoadSuccess, data) => ({
  type: GET_BOOKING_HISTORY_SUCCESS,
  BookingHistoryLoadSuccess,
  BookingHistory: data,
});

const getBookingHistoryError = BookingHistoryLoadError => ({
  type: GET_BOOKING_HISTORY_ERROR,
  BookingHistoryLoadError,
});

export const getBookingHistoryAction = dataParams => {
  return async dispatch => {
    dispatch(getBookingHistoryPending(true));
    dispatch(getBookingHistorySuccess(false, []));
    dispatch(getBookingHistoryError(null));

    try {
      dispatch(getBookingHistoryPending(false));
      const response = await getBookingHistory(dataParams);

      if (response.data.message === 'success') {
        dispatch(getBookingHistorySuccess(true, response.data.body.dataList));
      } else {
        dispatch(
          getBookingHistoryError({
            message: 'Booking history load fail',
          }),
        );
      }
    } catch (err) {
      dispatch(getBookingHistoryError({message: 'Network error'}));
    }
  };
};
  const getBookingHistoryChangeDetail = status => ({
    type: GET_BOOKING_HISTORY_CHANGE,
    status,
  });

  export const getBookingHistoryChangeDetails = (
    dataParams,
    successCallback,
  ) => {
    return async dispatch => {
      try {
        dispatch(getBookingHistoryChangeDetail(dataParams));
        successCallback();
      } catch (err) {}
    };
  };
export const geUpdateBookingHistory = dataParams => {
  return async dispatch => {
    dispatch(getBookingHistorySuccess(true, dataParams));
  };
};
