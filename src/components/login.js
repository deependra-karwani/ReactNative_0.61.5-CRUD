import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { usernameRE, passwordRE } from '../config/RegEx';
import { loginReq } from '../config/httpRoutes';
import { saveToken } from '../config/AsyncStorage';
import toast from '../config/toast';
import { Container, Content, Form, Item, Label, Input, Button, Text } from 'native-base';
import { View } from 'react-native';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};
	}

	handleChange = (key, value) => {
		this.setState({[key]: value});
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { username, password } = this.state;
			loginReq({username, password})
			.then( async (res) => {
				let { userid, message } = res.data;
				toast(message || "Login Successful");
				this.props.login({userid});
				await saveToken(res.headers.token);
				this.setState({
					username: '',
					password: ''
				});
				this.props.navigation.reset({
					index: 0,
					routes: [{ name: "users" }]
				});
			}).catch( (err) => {
				if(err.response) {
					toast(err.response.data.message || "Unexpected Error has Occurred");
				} else {
					toast("Server has Timed Out");
				}
			}).finally( () => {
				this.props.stopLoading();
			});;
		}
	}

	validate = () => {
		let { username, password } = this.state;
		return usernameRE.test(username) && passwordRE.test(password);
	}

	render() {
		let { handleChange, handleSubmit, validate, state: { username, password } } = this;
		return (
			<Container>
				<Content contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>
					<Form>
						<Item floatingLabel>
							<Label>Username</Label>
							<Input value={username} onChangeText={(val) => {handleChange("username", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Password</Label>
							<Input secureTextEntry value={password} onChangeText={(val) => {handleChange("password", val)}} />
						</Item>
					</Form>
					<Button info block style={{marginTop: 20, marginBottom: 15}} onPress={handleSubmit} disabled={!validate()}>
						<Text style={{color: 'white'}}>Login</Text>
					</Button>
					<View style={{flexDirection: 'row'}}>
						<Button primary block style={{flex: 1}} onPress={() => {this.props.navigation.navigate('register')}}>
							<Text>Create Account</Text>
						</Button>
						<Button primary bordered block style={{flex: 1, marginLeft: 10}} onPress={() => {this.props.navigation.navigate('forgot')}}>
							<Text>Forgot Password?</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	login: (data) => {dispatch(login(data));}
});

export default connect(null, mapDispatchToProps)(Login);