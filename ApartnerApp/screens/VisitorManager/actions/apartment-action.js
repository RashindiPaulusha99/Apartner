import {
  callGetApartmentUnitApi,
  setParcelFlagApi,
} from '../services/apartment-service';

export const SET_APARTMENT_UNIT_PENDING = 'SET_APARTMENT_UNIT_PENDING';
export const SET_APARTMENT_UNIT_SUCCESS = 'SET_APARTMENT_UNIT_SUCCESS';
export const SET_APARTMENT_UNIT_ERROR = 'SET_APARTMENT_UNIT_ERROR';

export const SET_PARCEL_FLAG_PENDING = 'SET_PARCEL_FLAG_PENDING';
export const SET_PARCEL_FLAG_SUCCESS = 'SET_PARCEL_FLAG_SUCCESS';
export const SET_PARCEL_FLAG_ERROR = 'SET_PARCEL_FLAG_ERROR';

export const SET_SELETED_APARTMENT = 'SET_SELETED_APARTMENT';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';
export const SET_SELECTED_PARCEL = 'SET_SELECTED_PARCEL';
export const GET_VISITOR_DETAILS_CHANGE = 'GET_VISITOR_DETAILS_CHANGE';

const setApartmentUnitPending = apartmentUnitLoadPending => ({
  type: SET_APARTMENT_UNIT_PENDING,
  apartmentUnitLoadPending,
});

const setApartmentUnitSuccess = (apartmentUnitLoadSuccess, data) => ({
  type: SET_APARTMENT_UNIT_SUCCESS,
  apartmentUnitLoadSuccess,
  apartmentUnits: data,
});

const setApartmentUnitError = apartmentUnitLoadError => ({
  type: SET_APARTMENT_UNIT_ERROR,
  apartmentUnitLoadError,
});

const getVisitorChangeDetails = status => ({
  type: GET_VISITOR_DETAILS_CHANGE,
  status,
});

export const changeVisitorAction = dataParams => {
  return async dispatch => {
    try {
      dispatch(getVisitorChangeDetails(dataParams));
    } catch (err) {}
  };
};

export const setApartmentUnitAction = dataParams => {
  return async dispatch => {
    dispatch(setApartmentUnitPending(true));
    dispatch(setApartmentUnitSuccess(false, []));
    dispatch(setApartmentUnitError(null));

    try {
      dispatch(setApartmentUnitPending(false));
      const response = await callGetApartmentUnitApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(setApartmentUnitSuccess(true, response.data.body));
      } else {
        dispatch(setApartmentUnitError({message: 'Apartment unit load fail'}));
      }
    } catch (err) {
      dispatch(setApartmentUnitError({message: 'Network error'}));
    }
  };
};

export const setParcelFlagUpdatedAction = dataParams => {
  return async dispatch => {
    dispatch(setApartmentUnitPending(true));
    dispatch(setApartmentUnitSuccess(false, []));
    dispatch(setApartmentUnitError(null));

    try {
      dispatch(setApartmentUnitPending(false));
      const response = await setParcelFlagApi(dataParams);
      if (response.status === 200) {
        dispatch(setApartmentUnitSuccess(true, []));
      } else {
        dispatch(
          setApartmentUnitError({message: 'Parcel flag is not updated'}),
        );
      }
    } catch (err) {
      dispatch(setApartmentUnitError({message: 'Network error'}));
    }
  };
};

export const setSelectedApartmentAction = seletedApartment => ({
  type: SET_SELETED_APARTMENT,
  seletedApartment,
});

export const setSelectedUnitAction = selectedUnit => ({
  type: SET_SELETED_UNIT,
  selectedUnit,
});

export const setSelectedParcelAction = selectedParcel => ({
  type: SET_SELECTED_PARCEL,
  selectedParcel,
});
