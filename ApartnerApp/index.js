/**
 * @format
 */
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import 'react-native-gesture-handler';

const RNRedux = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(RNRedux));
