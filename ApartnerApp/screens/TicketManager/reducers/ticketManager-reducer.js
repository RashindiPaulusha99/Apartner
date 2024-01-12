import {
  GET_CURRENT_TICKET_DETAILS,
  SET_TICKET_LIST_CHANGE,
} from '../actions/ticketManager-action';

const initialState = {
  currentTicketDetails: {},
  getTicketStatusChange: false,
};

const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CURRENT_TICKET_DETAILS:
      return {
        ...state,
        currentTicketDetails: action.payload,
      };
    case SET_TICKET_LIST_CHANGE:
      return {
        ...state,
        getTicketStatusChange: action.status,
      };
    default:
      return state;
  }
};

export default ticketReducer;
