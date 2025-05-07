import { Provider } from 'react-redux';
import AppNavigator from './app/navigation/AppNavigator';
import { store } from './app/store/store';
import { RootSiblingParent } from 'react-native-root-siblings';

const App = () => (
  <RootSiblingParent>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  </RootSiblingParent>
);

export default App;
