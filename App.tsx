import { Provider } from 'react-redux';
import AppNavigator from './app/navigation/AppNavigator';
import { persistor, store } from './app/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { RootSiblingParent } from 'react-native-root-siblings';

const App = () => (
  <RootSiblingParent>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  </RootSiblingParent>
);

export default App;
