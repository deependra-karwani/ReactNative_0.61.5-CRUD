import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getAllUsersReq } from '../config/httpRoutes';
import toast from '../config/toast';
import { withNavigationFocus } from '@react-navigation/compat';

class Users extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: null
		};
	}

	fetchData = () => {
		this.props.startLoading();
		let { userid } = this.props;
		getAllUsersReq({userid})
		.then( (res) => {
			let { users, message } = res.data;
			message && toast(message);
			this.setState({users});
		}).catch( (err) => {
			if(err.response) {
				toast(err.response.data.message || "Unexpected Error has Occurred");
			} else {
				toast("Server has Timed Out");
			}
		}).finally( () => {
			this.props.stopLoading();
		});
	}

	componentDidMount() {
		this.fetchData();
	}

	componentDidUpdate(prevProps) {
		if(this.props.isFocused && !prevProps.isFocused) {
			this.fetchData();
		}
	}

	navigateDetails = () => {
		this.props.navigation.navigate("userDetails", {params: {userid}});
	}

	render() {
		let { users } = this.state;
		return (
			<></>
		);
	}
}

const mapStateToProps = (state) => ({
	userid: state.session.userid
});

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
});

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Users));