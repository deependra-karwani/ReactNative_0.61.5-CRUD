import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers/index';
import { AsyncStorage } from 'react-native';

const persistConfig = {
	key: 'SampleCRUD',
	storage: AsyncStorage,
	// Whitelist (Save Specific Reducers)
	whitelist: [
		'session',
	],
	// Blacklist (Don't Save Specific Reducers)
	blacklist: [
		'common'
	],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);