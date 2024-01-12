import {callGetApartmentUnitApi} from '../services/apartment-service';

export const SET_APARTMENT_UNIT_PENDING = 'SET_APARTMENT_UNIT_PENDING';
export const SET_APARTMENT_UNIT_SUCCESS = 'SET_APARTMENT_UNIT_SUCCESS';
export const SET_APARTMENT_UNIT_ERROR = 'SET_APARTMENT_UNIT_ERROR';

export const SET_SELETED_APARTMENT = 'SET_SELETED_APARTMENT';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';


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
