import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { AuthReducer } from './auth/auth.reducer';
import thunk from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import { ManageReducer } from './manage/manage.reducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  maxSize: null,
};

const rootReducer = combineReducers({
  auth: AuthReducer,
  manage: ManageReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer(persistConfig, rootReducer);
const middlewares = [thunk];

export const store = createStore(
  persistedReducer,
  undefined,
  applyMiddleware(...middlewares),
);

export const persistor = persistStore(store);
