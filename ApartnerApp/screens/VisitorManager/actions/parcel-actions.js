import {
  getParcelsAccourdingToStatusApi,
  updateParcelDetailsData,
} from '../services/parcel-services';

export const GET_PARCEL_DATA_PENDING = 'GET_PARCEL_DATA_PENDING';
export const GET_PARCEL_DATA_SUCCESS = 'GET_PARCEL_DATA_SUCCESS';
export const GET_PARCEL_DATA_ERROR = 'GET_PARCEL_DATA_ERROR';

export const SET_PARCEL_PENDING = 'SET_PARCEL_PENDING';
export const SET_PARCEL_SUCCESS = 'SET_PARCEL_SUCCESS';
export const SET_PARCEL_ERROR = 'SET_PARCEL_ERROR';

const getParcelDataPending = getParcelDataLoadPending => ({
  type: GET_PARCEL_DATA_PENDING,
  getParcelDataLoadPending,
});

const getParcelDataSuccess = (getParcelDataLoadSuccess, data) => ({
  type: GET_PARCEL_DATA_SUCCESS,
  getParcelDataLoadSuccess,
  parcelsDataList: data,
});

const getParcelDataError = getParcelLoadError => ({
  type: GET_PARCEL_DATA_ERROR,
  getParcelLoadError,
});

const updateParcelPending = updateParcelLoadPending => ({
  type: SET_PARCEL_PENDING,
  updateParcelLoadPending,
});

const updateParcelSuccess = updateParcelLoadSuccess => ({
  type: SET_PARCEL_SUCCESS,
  updateParcelLoadSuccess,
});

const updateParcelError = updateParcelLoadError => ({
  type: SET_PARCEL_ERROR,
  updateParcelLoadError,
});

export const getParcelDataAction = dataParams => {
  return async dispatch => {
    dispatch(getParcelDataPending(true));
    dispatch(getParcelDataSuccess(false, []));
    dispatch(getParcelDataError(null));

    try {
      const response = await getParcelsAccourdingToStatusApi(dataParams);
      if (response.status === 200) {
        dispatch(getParcelDataSuccess(true, response.data.body.dataList));
      } else {
        dispatch(
          getParcelDataError({message: 'Get parcel data successfully.'}),
        );
      }
    } catch (err) {
      dispatch(getParcelDataError({message: 'Network error'}));
    }finally{
      dispatch(getParcelDataPending(false));
    }
  };
};

export const setParcelFlagUpdatedAction = (dataParams, callback) => {
  return async dispatch => {
    dispatch(updateParcelPending(true));
    dispatch(updateParcelSuccess(false));
    dispatch(updateParcelError(null));

    try {
      dispatch(updateParcelPending(true));
      const response = await updateParcelDetailsData(dataParams);
      if (response.data.message === 'success') {
        dispatch(updateParcelPending(false));
        dispatch(updateParcelSuccess(true));
        dispatch(getParcelDataSuccess(true, response.data.body.dataList));
        callback();
      } else {
        dispatch(updateParcelError({message: 'Parcel flag is not updated'}));
      }
    } catch (err) {
      dispatch(updateParcelError({message: err}));
    }
  };
};
