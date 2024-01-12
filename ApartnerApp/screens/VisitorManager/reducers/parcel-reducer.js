import {
  GET_PARCEL_DATA_PENDING,
  GET_PARCEL_DATA_SUCCESS,
  GET_PARCEL_DATA_ERROR,
  SET_PARCEL_PENDING,
  SET_PARCEL_SUCCESS,
  SET_PARCEL_ERROR,
} from '../actions/parcel-actions';

const initialState = {
  parcelListDataLoadPending: false,
  parcelListDataLoadSuccess: false,
  parcelListDataLoadError: null,
  updateParcelDataPending: false,
  updateParcelDataSuccess: false,
  updateParcelDataError: null,
  parcelsDataList: [],
  visitorsDataList: [],
};

const parcelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PARCEL_DATA_PENDING:
      return {
        ...state,
        parcelListDataLoadPending: action.getParcelDataLoadPending,
      };
    case GET_PARCEL_DATA_SUCCESS:
      return {
        ...state,
        parcelListDataLoadSuccess: action.getParcelDataLoadSuccess,
        parcelsDataList: action.parcelsDataList,
      };
    case GET_PARCEL_DATA_ERROR:
      return {
        ...state,
        parcelListDataLoadError: action.getParcelLoadError,
      };

    case SET_PARCEL_PENDING:
      return {
        ...state,
        updateParcelDataPending: action.updateParcelLoadPending,
      };
    case SET_PARCEL_SUCCESS:
      return {
        ...state,
        updateParcelDataSuccess: action.updateParcelLoadSuccess,
      };
    case SET_PARCEL_ERROR:
      return {
        ...state,
        updateParcelDataError: action.updateParcelLoadError,
      };

    default:
      return state;
  }
};

export default parcelReducer;
