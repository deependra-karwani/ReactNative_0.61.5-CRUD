import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { nameRE, emailRE, mobileRE, usernameRE, passwordRE } from '../config/RegEx';
import { registerReq } from '../config/httpRoutes';
import { saveToken } from '../config/AsyncStorage';
import toast from '../config/toast';
import ImagePicker from 'react-native-image-picker';
import { Platform } from 'react-native';
import { Container, Content, Form, Item, Thumbnail, Label, Input, Button, Text } from 'native-base';
import { TouchableOpacity, View } from 'react-native';

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
			if(prof) {
				formData.append('prof', {
					name: prof.fileName,
					type: prof.type,
					uri: Platform.OS === "android" ? prof.uri : prof.uri.replace("file://", "")
				});
			}
			registerReq(formData)
			.then( async (res) => {
				let { userid, message } = res.data;
				toast(message || "Registration Successful");
				this.props.login({userid});
				await saveToken(res.headers.token);
				this.setState({
					name: '',
					email: '',
					mobile: '',
					username: '',
					password: '',
					confPass: '',
					prof: null
				});
				this.props.navigation.navigate("users");
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

	handleFile = () => {
		const options = {
			title: 'Select Profile Picture',
			storageOptions: {
				skipBackup: true,
				// path: 'images',
			},
			mediaType: 'photo'
		};
		ImagePicker.showImagePicker(options, (response) => {
			if (response.error) {
				toast('Error Encountered! Try another file if the Error Persists.');
			} else {
				// const base64 = response.data;

				this.setState({
					prof: response
				});
			}
		});
	}

	render() {
		let { handleChange, handleFile, handleSubmit, validate, state: { name, email, mobile, username, password, confPass, prof } } = this;
		return (
			<Container>
				<Content contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>
					<TouchableOpacity style={{alignSelf: 'center', minHeight: 180, width: '60%'}} onPress={handleFile}>
						<Thumbnail large source={{uri: prof ? prof.uri : 'asset:/noImage.png', cache: 'force-cache'}} style={{alignSelf: 'center', minHeight: 180, width: '100%'}} />
					</TouchableOpacity>
					<Form>
						<Item floatingLabel>
							<Label>Name</Label>
							<Input value={name} onChangeText={(val) => {handleChange("name", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Username</Label>
							<Input value={username} onChangeText={(val) => {handleChange("username", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>E-mail</Label>
							<Input value={email} onChangeText={(val) => {handleChange("email", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Mobile</Label>
							<Input value={mobile} onChangeText={(val) => {handleChange("mobile", val)}} />
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
						<Text style={{color: 'white'}}>Register</Text>
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
	login: (data) => {dispatch(login(data));}
});

export default connect(null, mapDispatchToProps)(Register);