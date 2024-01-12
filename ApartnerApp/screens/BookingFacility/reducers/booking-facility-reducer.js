import {
  SELECTED_BOOKING_FACILITY,
  SET_SELETED_UNIT,
  GET_BOOKING_HISTORY_PENDING,
  GET_BOOKING_HISTORY_SUCCESS,
  GET_BOOKING_HISTORY_ERROR,
  GET_BOOKING_HISTORY_CHANGE,
} from '../actions/booking-facility-action';

const initialState = {
  selectedBookingFacility: {},
  bookingHistoryLoadPending: false,
  bookingHistoryLoadSuccess: false,
  bookingHistoryData: [],
  bookingHistoryLoadError: null,
  getBookingHistoryChangeDetails : false,
};

const bookingFacilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECTED_BOOKING_FACILITY:
      return {
        ...state,
        selectedBookingFacility: action.selectedBookingFacility,
      };
    case SET_SELETED_UNIT:
      return {
        ...state,
        selectedUnit: action.selectedUnit,
      };
    case GET_BOOKING_HISTORY_PENDING:
      return {
        ...state,
        bookingHistoryLoadPending: action.BookingHistoryLoadPending,
      };
    case GET_BOOKING_HISTORY_SUCCESS:
      return {
        ...state,
        bookingHistoryLoadSuccess: action.BookingHistoryLoadSuccess,
        bookingHistoryData: action.BookingHistory,
      };
    case GET_BOOKING_HISTORY_ERROR:
      return {
        ...state,
        bookingHistoryLoadError: action.BookingHistoryLoadError,
      };
      case GET_BOOKING_HISTORY_CHANGE:
      return {
        ...state,
        getBookingHistoryChangeDetails: action.status,
      };
    default:
      return state;
  }
};
export default bookingFacilityReducer;
