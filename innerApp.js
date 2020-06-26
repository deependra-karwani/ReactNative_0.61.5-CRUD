import React from 'react';

import AppContainer from './src/navigators/container';

import { saveFCM } from './src/actions/session';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import { ActivityIndicator, Modal, View } from 'react-native';

console.disableYellowBox = true;

class InnerApp extends React.Component {
	componentDidMount() {
		// firebase.messaging().getToken().then( (fcm) => {
		// 	this.props.saveFCM({fcm});
		// });

		// firebase.messaging().onTokenRefresh( (fcm) => {
	    // 	this.props.saveFCM({fcm});
	    // });
	}

	render() {
		return (
			<>
				<Modal animationType="fade" transparent={true} visible={this.props.loading}>
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<ActivityIndicator size={70} color="cyan" />
					</View>
				</Modal>
				<AppContainer />
			</>
		);
	}
};

const mapStateToProps = (state) => ({
	loading: state.common.loading
});

const mapDispatchToProps = (dispatch) => ({
	saveFCM: (data) => {dispatch(saveFCM(data));}
});

export default connect(mapStateToProps, mapDispatchToProps)(InnerApp);