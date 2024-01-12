import {
 SET_SELECTED_DUE_INVOICE
} from '../actions/myDues-action';

const initialState = {
  selectedDueInvoice : {}
};

const apartmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_DUE_INVOICE:
      return {
        ...state,
        selectedDueInvoice: action.selectedDueInvoiceData,
      };  

    default:
      return state;
  }
};

export default apartmentReducer;
