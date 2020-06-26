import React from 'react';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { store, persistor } from './src/config/store';
import SplashScreen from 'react-native-splash-screen';
import InnerApp from './innerApp';

console.disableYellowBox = true;

class App extends React.Component {
	componentDidMount() {
		SplashScreen.hide();
	}

	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<InnerApp />
				</PersistGate>
			</Provider>
		);
	}
};

export default App;