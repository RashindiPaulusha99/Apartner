import {SET_VISITOR_LIST} from '../actions/visitor-actions';

const initialState = {
  visitorsDataList: [],
};

const visitorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VISITOR_LIST:
      return {
        ...state,

        visitorsDataList: action.visitorsDataList,
      };

    default:
      return state;
  }
};

export default visitorReducer;
