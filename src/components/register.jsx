import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { nameRE, emailRE, mobileRE, usernameRE, passwordRE } from '../config/RegEx';
import { registerReq } from '../config/httpRoutes';
import { saveToken } from '../config/AsyncStorage';
import toast from '../config/toast';

class Register extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			email: '',
			mobile: '',
			username: '',
			password: '',
			confPass: '',
			prof: null
		};
	}

	handleChange = (key, value) => {
		this.setState({[key]: value});
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { name, email, mobile, username, password, prof } = this.state;
			let formData = new FormData();
			formData.append('name', name);
			formData.append('email', email);
			formData.append('mobile', mobile);
			formData.append('username', username);
			formData.append('password', password);
			formData.append('prof', prof);
			registerReq(formData)
			.then( async (res) => {
				let { userid, message } = res.data;
				toast(message || "Registration Successful");
				this.props.login({userid});
				await saveToken(res.headers.token);
				this.props.history.push("/users");
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
	}

	validate = () => {
		let { name, email, mobile, username, password, confPass } = this.state;
		return nameRE.test(name) && emailRE.test(email) && mobileRE.test(mobile) && usernameRE.test(username) && passwordRE.test(password) && password === confPass;
	}

	render() {
		let { name, email, mobile, username, password, confPass, prof } = this.state;
		return (
			<></>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	login: (data) => {dispatch(login(data));}
});

export default connect(null, mapDispatchToProps)(Register);