export const SET_APARTNER_ACCESS_PENDING = 'SET_APARTNER_ACCESS_PENDING';
export const SET_APARTNER_ACCESS_SUCCESS = 'SET_APARTNER_ACCESS_SUCCESS';
export const SET_APARTNER_ACCESS_ERROR = 'SET_APARTNER_ACCESS_ERROR';
export const RESET_APARTNER_ACCESS_LOGIN = 'RESET_APARTNER_ACCESS_LOGIN';
export const RESET_APARTNER_ACCESS = 'RESET_APARTNER_ACCESS';

export const setApartnerAccessSuccess = (payload, dataType) => ({
  type: SET_APARTNER_ACCESS_SUCCESS,
  payload,
  dataType
});

export const setApartnerAccessError = (payload) => ({
  type: SET_APARTNER_ACCESS_ERROR,
  payload,
});

export const resetApartnerAccessLogin = () => ({
  type: RESET_APARTNER_ACCESS_LOGIN,
});

export const resetApartnerAccess = () => ({
  type: RESET_APARTNER_ACCESS,
});

