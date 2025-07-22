import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './src/navigations/AuthNavigator';
import {Provider} from 'react-redux';
import {store} from './src/app/redux/store';
import CustomStatusBar from './src/components/CustomStatusBar';

export default function App() {
  return (
    <Provider store={store}>
      <CustomStatusBar />
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>
  );
}
