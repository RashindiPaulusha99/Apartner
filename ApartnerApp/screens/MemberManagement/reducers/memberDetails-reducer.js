import {
  GET_MEMBER_DETAILS_ERROR,
  GET_MEMBER_DETAILS_PENDING,
  GET_MEMBER_DETAILS_SUCCESS,
  GET_MEMBER_DETAILS_CHANGE,
  GET_TENANT_DETAILS_CHANGE
} from '../actions/apartment-action';

const initialState = {
  getMemberProfileDetailsPending: false,
  getMemberProfileDetailsSuccess: false,
  getMemberProfileDetailsError: false,
  getMemberDetailsChange: false,
  getTenantChangeDetails : false,
  currentMemberProfileDetails: {},
};

const memberReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MEMBER_DETAILS_PENDING:
      return {
        ...state,
        getMemberProfileDetailsPending: action.status,
      };
    case GET_MEMBER_DETAILS_SUCCESS:
      return {
        ...state,
        getMemberProfileDetailsSuccess: action.status,
        currentMemberProfileDetails: action.data,
      };
    case GET_MEMBER_DETAILS_ERROR:
      return {
        ...state,
        getMemberProfileDetailsError: action.error,
      };
    case GET_MEMBER_DETAILS_CHANGE:
      return {
        ...state,
        getMemberDetailsChange: action.status,
      };
      case GET_TENANT_DETAILS_CHANGE:
      return {
        ...state,
        getTenantChangeDetails: action.status,
      };
    default:
      return state;
  }
};

export default memberReducer;
