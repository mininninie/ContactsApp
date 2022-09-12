import * as React from 'react';

import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import { NavigationContainer } from '@react-navigation/native';
import ContactStackNavigator from './source/navigations/ContactStack';

import contactListReducer from './source/stores/reducers/contactListReducer';

const rootReducer = combineReducers({
    contactList: contactListReducer
});

const store = legacy_createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContactStackNavigator />
      </NavigationContainer>
    </Provider>
    
  );
}