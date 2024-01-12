import {
  callGetApartmentUnitApi,
  getMemberDataApi
} from '../services/apartment-service';

export const SET_APARTMENT_UNIT_PENDING = 'SET_APARTMENT_UNIT_PENDING';
export const SET_APARTMENT_UNIT_SUCCESS = 'SET_APARTMENT_UNIT_SUCCESS';
export const SET_APARTMENT_UNIT_ERROR = 'SET_APARTMENT_UNIT_ERROR';

export const SET_SELETED_APARTMENT = 'SET_SELETED_APARTMENT';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';

export const GET_MEMBER_DETAILS_PENDING = 'GET_MEMBER_DETAILS_PENDING';
export const GET_MEMBER_DETAILS_SUCCESS = 'GET_MEMBER_DETAILS_SUCCESS';
export const GET_MEMBER_DETAILS_ERROR = 'GET_MEMBER_DETAILS_ERROR';

export const GET_MEMBER_DETAILS_CHANGE = 'GET_MEMBER_DETAILS_CHANGE';
export const GET_TENANT_DETAILS_CHANGE = 'GET_TENANT_DETAILS_CHANGE';

const setApartmentUnitPending = (apartmentUnitLoadPending) => ({
  type: SET_APARTMENT_UNIT_PENDING,
  apartmentUnitLoadPending,
});

const setApartmentUnitSuccess = (apartmentUnitLoadSuccess, data) => ({
  type: SET_APARTMENT_UNIT_SUCCESS,
  apartmentUnitLoadSuccess,
  apartmentUnits : data
});

const setApartmentUnitError = (apartmentUnitLoadError) => ({
  type: SET_APARTMENT_UNIT_ERROR,
  apartmentUnitLoadError,
});

const getMemberDetailsPending = (status) => ({
  type: GET_MEMBER_DETAILS_PENDING,
  status,
});

const getMemberDetailsSuccess = (status, data) => ({
  type: GET_MEMBER_DETAILS_SUCCESS,
  status,
  data
});

const getMemberDetailsError = (error) => ({
  type: GET_MEMBER_DETAILS_ERROR,
  error,
});

const getTenantChangeDetails = (status) => ({
  type: GET_TENANT_DETAILS_CHANGE,
  status
});

export const changeTenantAction = (dataParams, successCallback) => {
  return async (dispatch) => {
    try {
        dispatch(getTenantChangeDetails(dataParams));
        successCallback();
    } catch (err) {
    }
  };
};

export const setApartmentUnitAction = (dataParams) => {
  return async (dispatch) => {
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

export const setSelectedApartmentAction = (seletedApartment) => ({
  type: SET_SELETED_APARTMENT,
  seletedApartment,
});

export const setSelectedUnitAction = (selectedUnit) => ({
  type: SET_SELETED_UNIT,
  selectedUnit,
});

export const getMemberDetailsAction = (dataParams, successCallback) => {
  return async (dispatch) => {
    dispatch(getMemberDetailsPending(true));
    dispatch(getMemberDetailsSuccess(false, []));
    dispatch(getMemberDetailsError(null));

    try {
      const response = await getMemberDataApi(dataParams);
      dispatch(getMemberDetailsPending(false));
      if (response.data.message === 'success') {
        dispatch(getMemberDetailsSuccess(true, response.data.body.dataList[0]));
        successCallback();
      } else {
        dispatch(getMemberDetailsError({message: 'Member details load fail'}));
      }
    } catch (err) {
      dispatch(getMemberDetailsPending(false));
      dispatch(getMemberDetailsError(err));
    }
  };
};

const getMemberChangeDetails = (status) => ({
  type: GET_MEMBER_DETAILS_CHANGE,
  status
});

export const changeMemberAction = (dataParams, successCallback) => {
  return async (dispatch) => {
    try {
        dispatch(getMemberChangeDetails(dataParams));
        successCallback();
    } catch (err) {
    }
  };
};