export const GET_CURRENT_TICKET_DETAILS = 'GET_CURRENT_TICKET_DETAILS';
export const SET_SELETED_UNIT = 'SET_SELETED_UNIT';
export const SET_TICKET_LIST_CHANGE = 'SET_TICKET_LIST_CHANGE';

const setCurrentTicketData = ticketData => ({
  type: GET_CURRENT_TICKET_DETAILS,
  payload: ticketData,
});

export const setTicketDataAction = dataParams => {
  return async dispatch => {
    dispatch(setCurrentTicketData(dataParams));
  };
};

export const setSelectedUnitAction = selectedUnit => ({
  type: SET_SELETED_UNIT,
  selectedUnit,
});

export const setTicketListAction = status => ({
  type: SET_TICKET_LIST_CHANGE,
  status,
});
