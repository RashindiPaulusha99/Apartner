export const SET_VISITOR_LIST = 'SET_VISITOR_LIST';

const setVisitorDataList = visitorsDataList => ({
  type: SET_VISITOR_LIST,

  visitorsDataList,
});

export const setVisitorDataListAction = dataParams => {
  return async dispatch => {
    dispatch(setVisitorDataList(dataParams));
  };
};
