import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { emailRE, passwordRE } from '../config/RegEx';
import { forgotPasswordReq } from '../config/httpRoutes';
import toast from '../config/toast';
import { Container, Content, Form, Item, Label, Input, Button, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			confPass: ''
		};
	}

	handleChange = (key, value) => {
		this.setState({[key]: value});
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { email, password } = this.state;
			forgotPasswordReq({email, password})
			.then( (res) => {
				toast(res.data.message || "Password Changed Successfully");
				this.setState({email: '', password: '', confPass: ''});
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
		let { email, password, confPass } = this.state;
		return emailRE.test(email) && passwordRE.test(password) && password === confPass;
	}

	render() {
		let { handleChange, handleSubmit, validate, state: { email, password, confPass } } = this;
		return (
			<Container>
				<Content contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>
					<Form>
						<Item floatingLabel>
							<Label>E-mail</Label>
							<Input value={email} onChangeText={(val) => {handleChange("email", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Password</Label>
							<Input secureTextEntry value={password} onChangeText={(val) => {handleChange("password", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Confirm Password</Label>
							<Input secureTextEntry value={confPass} onChangeText={(val) => {handleChange("confPass", val)}} />
						</Item>
					</Form>
					<Button primary block style={{marginTop: 20, marginBottom: 15}} onPress={handleSubmit} disabled={!validate()}>
						<Text style={{color: 'white'}}>Change Password</Text>
					</Button>
					<View>
						<Button bordered block onPress={() => {this.props.navigation.navigate('login')}}>
							<Text>Log In</Text>
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
});

export default connect(null, mapDispatchToProps)(ForgotPassword);