import {
  SET_APARTMENT_UNIT_PENDING,
  SET_APARTMENT_UNIT_SUCCESS,
  SET_APARTMENT_UNIT_ERROR,
  SET_SELETED_APARTMENT,
  SET_SELETED_UNIT,
  GET_APARTMENT_FACILITY_PENDING,
  GET_APARTMENT_FACILITY_SUCCESS,
  GET_APARTMENT_FACILITY_ERROR,
  GET_APARTMENT_FACILITY_ITEMS_PENDING,
  GET_APARTMENT_FACILITY_ITEMS_SUCCESS,
  GET_APARTMENT_FACILITY_ITEMS_ERROR,
  APARTMENT_COMPLEX_SELECTION_PENDING,
} from '../actions/apartment-action';

import {SET_SELECTED_PARCEL} from '../../VisitorManager/actions/apartment-action';

const initialState = {
  seleletedApatment: {},
  selectedUnit: {},
  selectedParcel: {},
  apartmentUnitLoadPending: false,
  apartmentUnitLoadSuccess: false,
  apartmentUnitLoadError: null,
  apartmentUnits: [],
  apartmentFacilityLoadPending: false,
  apartmentFacilityLoadSuccess: false,
  apartmentFacilityLoadError: null,
  apartmentFacilities: [],
  apartmentFacilityItemsLoadPending: false,
  apartmentFacilityItemsLoadSuccess: false,
  apartmentFacilityItemsLoadError: null,
  apartmentFacilitiyItems: [],
  apartmentComplexSelectionPending: false,
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
    case GET_APARTMENT_FACILITY_PENDING:
      return {
        ...state,
        apartmentFacilityLoadPending: action.apartmentFacilityLoadPending,
      };
    case GET_APARTMENT_FACILITY_SUCCESS:
      return {
        ...state,
        apartmentFacilityLoadSuccess: action.apartmentFacilityLoadSuccess,
        apartmentFacilities: action.apartmentFacility,
      };
    case GET_APARTMENT_FACILITY_ERROR:
      return {
        ...state,
        apartmentFacilityLoadError: action.apartmentFacilityLoadError,
      };
    case GET_APARTMENT_FACILITY_ITEMS_PENDING:
      return {
        ...state,
        apartmentFacilityItemsLoadPending:
          action.apartmentFacilityItemsLoadPending,
      };
    case GET_APARTMENT_FACILITY_ITEMS_SUCCESS:
      return {
        ...state,
        apartmentFacilityItemsLoadSuccess:
          action.apartmentFacilityItemsLoadSuccess,
        apartmentFacilityItems: action.apartmentFacilityItems,
      };
    case GET_APARTMENT_FACILITY_ITEMS_ERROR:
      return {
        ...state,
        apartmentFacilityItemsLoadError: action.apartmentFacilityItemsLoadError,
      };
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
    case SET_SELECTED_PARCEL:
      return {
        ...state,
        selectedParcel: action.selectedParcel,
      };
    case APARTMENT_COMPLEX_SELECTION_PENDING:
      return {
        ...state,
        apartmentComplexSelectionPending: action.status,
      };
    default:
      return state;
  }
};

export default apartmentReducer;
