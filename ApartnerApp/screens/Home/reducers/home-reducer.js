import {
  GET_UNIT_UPDATES_PENDING,
  GET_UNIT_UPDATES_SUCCESS,
  GET_UNIT_UPDATES_ERROR,
  GET_UNIT_UPDATES_CHANGE,
  GET_USER_NOTICES,
  GET_USER_Ticket,
} from '../actions/home-action';

import {
  SET_MY_UNIT_SUMMERY
} from "../../MyUnit/actions/apartment-action";

const initialState = {
  unitUpdatesLoadPending: false,
  unitUpdatesLoadSuccess: false,
  unitUpdatesLoadError: null,
  unitUpdates: {},
  unitChangesStatus: false,
  userNoticesList: null,
  userTicketList: null,
  myUnitSummery: null
};

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_UNIT_UPDATES_PENDING:
      return {
        ...state,
        unitUpdatesLoadPending: action.status,
      };
    case GET_UNIT_UPDATES_SUCCESS:
      return {
        ...state,
        unitUpdatesLoadSuccess: action.status,
        unitUpdates: action.unitUpdates,
      };
    case GET_UNIT_UPDATES_ERROR:
      return {...state, unitUpdatesLoadError: action.status};
    case GET_UNIT_UPDATES_CHANGE:
      return {
        ...state,
        unitChangesStatus: action.status,
      };
    case GET_USER_NOTICES:
      return {
        ...state,
        userNoticesList: action.userNotices,
      };
    case GET_USER_Ticket:
      return {
        ...state,
        userTicketList: action.userTickets,
      };
    case SET_MY_UNIT_SUMMERY:
      return {
        ...state,
        myUnitSummery : action.dataset,
      }
    default:
      return state;
  }
};

export default homeReducer;
