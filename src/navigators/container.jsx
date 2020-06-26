import React from 'react';
import AuthNav from './auth';
import UnauthNav from './unauth';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

class AppContainer extends React.Component{
	render() {
		userid = Boolean(this.props.userid);
		return(
			<NavigationContainer>
				{userid ?
					<AuthNav />
				:
					<UnauthNav />
				}
			</NavigationContainer>
		);
	}
}

const mapStateToProps = (state) => ({
	userid: state.session.userid
});

export default connect(mapStateToProps)(AppContainer);