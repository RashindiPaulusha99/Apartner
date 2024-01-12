import {
  callGetApartmentUnitApi,
  callGetApartmentFacilityApi,
  callGetApartmentFacilityItemsApi,
  getApartmentsListOfUserApi,
} from '../services/apartment-service';

export const SET_APARTMENT_UNIT_PENDING = 'SET_APARTMENT_UNIT_PENDING';
export const SET_APARTMENT_UNIT_SUCCESS = 'SET_APARTMENT_UNIT_SUCCESS';
export const SET_APARTMENT_UNIT_ERROR = 'SET_APARTMENT_UNIT_ERROR';

export const GET_APARTMENT_FACILITY_PENDING = 'GET_APARTMENT_FACILITY_PENDING';
export const GET_APARTMENT_FACILITY_SUCCESS = 'GET_APARTMENT_FACILITY_SUCCESS';
export const GET_APARTMENT_FACILITY_ERROR = 'GET_APARTMENT_FACILITY_ERROR';

export const GET_APARTMENT_FACILITY_ITEMS_PENDING =
  'GET_APARTMENT_FACILITY_ITEMS_PENDING';
export const GET_APARTMENT_FACILITY_ITEMS_SUCCESS =
  'GET_APARTMENT_FACILITY_ITEMS_SUCCESS';
export const GET_APARTMENT_FACILITY_ITEMS_ERROR =
  'GET_APARTMENT_FACILITY_ITEMS_ERROR';

export const SET_SELETED_APARTMENT = 'SET_SELETED_APARTMENT';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';

export const GET_USER_APARTMENT_LIST_PENDING =
  'GET_USER_APARTMENT_LIST_PENDING';
export const GET_USER_APARTMENT_LIST_SUCCESS =
  'GET_USER_APARTMENT_LIST_SUCCESS';
export const GET_USER_APARTMENT_LIST_ERROR = 'GET_USER_APARTMENT_LIST_ERROR';

export const APARTMENT_COMPLEX_SELECTION_PENDING =
  'APARTMENT_COMPLEX_SELECTION_PENDING';

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

const getApartmentFacilityPending = apartmentFacilityLoadPending => ({
  type: GET_APARTMENT_FACILITY_PENDING,
  apartmentFacilityLoadPending,
});

const getApartmentFacilitySuccess = (apartmentFacilityLoadSuccess, data) => ({
  type: GET_APARTMENT_FACILITY_SUCCESS,
  apartmentFacilityLoadSuccess,
  apartmentFacility: data,
});

const getApartmentFacilityError = apartmentFacilityLoadError => ({
  type: GET_APARTMENT_FACILITY_ERROR,
  apartmentFacilityLoadError,
});

const getApartmentFacilityItemsPending = apartmentFacilityItemsLoadPending => ({
  type: GET_APARTMENT_FACILITY_ITEMS_PENDING,
  apartmentFacilityItemsLoadPending,
});

const getApartmentFacilityItemsSuccess = (
  apartmentFacilityItemsLoadSuccess,
  data,
) => ({
  type: GET_APARTMENT_FACILITY_ITEMS_SUCCESS,
  apartmentFacilityItemsLoadSuccess,
  apartmentFacilityItems: data,
});

const getApartmentFacilityItemsError = apartmentFacilityItemsLoadError => ({
  type: GET_APARTMENT_FACILITY_ITEMS_ERROR,
  apartmentFacilityItemsLoadError,
});

const getUserApartmentListPending = status => ({
  type: GET_USER_APARTMENT_LIST_PENDING,
  status,
});

const getUserApartmentListSuccess = (status, data = []) => ({
  type: GET_USER_APARTMENT_LIST_SUCCESS,
  status,
  data,
});

const getUserApartmentListError = status => ({
  type: GET_USER_APARTMENT_LIST_ERROR,
  status,
});

export const setSelectedApartmentAction = seletedApartment => ({
  type: SET_SELETED_APARTMENT,
  seletedApartment,
});

export const setSelectedUnitAction = selectedUnit => ({
  type: SET_SELETED_UNIT,
  selectedUnit,
});
export const setApartmentUnitAction = (dataParams, successCallback) => {
  return async dispatch => {
    dispatch(setApartmentUnitPending(true));
    dispatch(setApartmentUnitSuccess(false, []));
    dispatch(setApartmentUnitError(null));

    try {
      dispatch(setApartmentUnitPending(false));
      const response = await callGetApartmentUnitApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(setApartmentUnitSuccess(true, response.data.body));
        successCallback(response.data.body[0]);
      } else {
        dispatch(setApartmentUnitError({message: 'Apartment unit load fail'}));
      }
    } catch (err) {
      dispatch(setApartmentUnitError({message: 'Network error'}));
    }
  };
};
export const getApartmentFacilityAction = (dataParams, callBack = null) => {
  return async dispatch => {
    dispatch(getApartmentFacilityPending(true));
    dispatch(getApartmentFacilitySuccess(false, []));
    dispatch(getApartmentFacilityError(null));

    try {
      dispatch(getApartmentFacilityPending(false));
      const response = await callGetApartmentFacilityApi(dataParams);
      if (response.data.message == 'success') {
        dispatch(
          getApartmentFacilitySuccess(true, response.data.body.dataList),
        );
        if (callBack) {
          callBack();
        }
      } else {
        dispatch(
          getApartmentFacilityError({
            message: 'Apartment facilities load fail',
          }),
        );
      }
    } catch (err) {
      dispatch(getApartmentFacilityError({message: 'Network error'}));
    }
  };
};
export const getApartmentFacilityItemsAction = dataParams => {
  return async dispatch => {
    dispatch(getApartmentFacilityItemsPending(true));
    dispatch(getApartmentFacilityItemsSuccess(false, []));
    dispatch(getApartmentFacilityItemsError(null));

    try {
      dispatch(getApartmentFacilityItemsPending(false));
      const response = await callGetApartmentFacilityItemsApi(dataParams);

      if (response.data.message === 'success') {
        dispatch(
          getApartmentFacilityItemsSuccess(true, response.data.body.dataList),
        );
      } else {
        dispatch(
          getApartmentFacilityItemsError({
            message: 'Apartment facility Items load fail',
          }),
        );
      }
    } catch (err) {
      dispatch(getApartmentFacilityItemsError({message: 'Network error'}));
    }
  };
};
export const setApartmentSelectionPendingState = status => ({
  type: APARTMENT_COMPLEX_SELECTION_PENDING,
  status,
});

export const getUserApartmentsListAction = (dataParams, successCallback) => {
  return async dispatch => {
    dispatch(getUserApartmentListPending(true));
    dispatch(getUserApartmentListSuccess(false, []));
    dispatch(getUserApartmentListError(null));

    try {
      dispatch(getUserApartmentListPending(false));
      const response = await getApartmentsListOfUserApi(dataParams);
      if (response.data.message === 'success') {
        dispatch(getUserApartmentListSuccess(true, response.data.body));
        dispatch(setApartmentSelectionPendingState(false));
        successCallback(response.data.body);
      } else {
        dispatch(
          getUserApartmentListError({message: 'User apartment list load fail'}),
        );
      }
    } catch (err) {
      dispatch(getUserApartmentListError({message: 'Network error'}));
    }
  };
};
