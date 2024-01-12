import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import reducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(
  persistedReducer,
  {},
  process.env.NODE_ENV !== 'production'
    ? // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunk, logger)) : applyMiddleware(thunk));
      applyMiddleware(thunk, logger)
    : applyMiddleware(thunk),
);
export const persistor = persistStore(store);
