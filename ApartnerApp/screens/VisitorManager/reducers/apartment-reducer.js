import {
  SET_APARTMENT_UNIT_PENDING,
  SET_APARTMENT_UNIT_SUCCESS,
  SET_APARTMENT_UNIT_ERROR,
  SET_SELETED_APARTMENT,
  SET_SELETED_UNIT,
  GET_VISITOR_DETAILS_CHANGE,
} from '../actions/apartment-action';

const initialState = {
  seleletedApatment: {},
  selectedUnit: {},
  apartmentUnitLoadSuccess: false,
  apartmentUnitLoadPending: false,
  apartmentUnitLoadError: null,
  getVisitorChangeDetails: false,
  apartmentUnits: [],
};

const apartmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APARTMENT_UNIT_PENDING:
      return {
        ...state,
        apartmentUnitLoadPending: action.apartmentUnitLoadPending,
      };
    case SET_APARTMENT_UNIT_SUCCESS:
      return {
        ...state,
        apartmentUnitLoadSuccess: action.apartmentUnitLoadSuccess,
        apartmentUnits: action.apartmentUnits,
      };
    case SET_APARTMENT_UNIT_ERROR:
      return {...state, apartmentUnitLoadError: action.apartmentUnitLoadError};
    case SET_SELETED_APARTMENT:
      return {
        ...state,
        seleletedApatment: action.seletedApartment,
      };
    case SET_SELETED_UNIT:
      return {
        ...state,
        selectedUnit: action.selectedUnit,
      };
    case GET_VISITOR_DETAILS_CHANGE:
      return {
        ...state,
        getVisitorChangeDetails: action.status,
      };

    default:
      return state;
  }
};

export default apartmentReducer;
