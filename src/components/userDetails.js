import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getUserDetailsReq, updateProfileReq, deleteAccountReq, logoutReq } from '../config/httpRoutes';
import toast from '../config/toast';
import { nameRE, mobileRE, usernameRE } from '../config/RegEx';
import { logout } from '../actions/session';
import { removeToken } from '../config/AsyncStorage';
import { withNavigationFocus } from '@react-navigation/compat';
import ImagePicker from 'react-native-image-picker';
import { Container, Content, Form, Thumbnail, Item, Label, Input, Button, Text } from 'native-base';
import { TouchableOpacity, Alert } from 'react-native';

class UserDetails extends React.Component {
	constructor(props) {
		super(props);

		if(!this.props.route.params.userid) {
			this.props.navigation.goBack();
		}

		this.state = {
			profpic: '',
			name: '',
			username: '',
			email: '',
			mobile: '',
			isUser: false
		};
	}

	fetchData = () => {
		this.props.startLoading();
		let { userid } = this.props.route.params;
		let isUser = this.props.userid === this.props.route.params.userid;
		getUserDetailsReq({userid})
		.then( (res) => {
			let { user, message } = res.data;
			message && toast(message);
			this.setState({...user, isUser});
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

	handleChange = (key, value ) => {
		this.setState({[key]: value});
	}

	validate = () => {
		let { name, mobile, username } = this.state;
		return nameRE.test(name) && mobileRE.test(mobile) && usernameRE.test(username) && this.props.userid === this.props.route.params.userid;
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { name, username, mobile, prof } = this.state;
			let { userid } = this.props;
			formData.append('name', name);
			formData.append('username', username);
			formData.append('mobile', mobile);
			formData.append('userid', userid);
			if(prof) {
				formData.append('prof', {
					name: prof.fileName,
					type: prof.type,
					uri: Platform.OS === "android" ? prof.uri : prof.uri.replace("file://", "")
				});
			}
			updateProfileReq(formData)
			.then( (res) => {
				toast(res.data.message || "Profile Updated Successfully");
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

	confDelProf = () => {
		Alert.alert(
			"Are you sure?",
			"This action is not reversible",
			[
				{
					text: "Cancel",
					onPress: () => null,
					style: "cancel"
				},
				{
					text: "OK",
					onPress: () => this.delProf
				}
			]
		);
	}

	delProf = () => {
		if(this.props.userid === this.props.route.params.userid && window.confirm("Are you sure? This action is irreversible")) {
			this.props.startLoading();
			let { userid } = this.props;
			deleteAccountReq({userid})
			.then( async (res) => {
				toast(res.data.message || "Account Removed Successfully");
				this.props.logout();
				await removeToken();
				this.props.navigation.navigate("register");
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

	confLogout = () => {
		Alert.alert(
			"Are you sure you want to Logout?",
			"",
			[
				{
					text: "Cancel",
					onPress: () => null,
					style: "cancel"
				},
				{
					text: "OK",
					onPress: this.logout
				}
			]
		);
	}

	logout = () => {
		if(this.props.userid === this.props.route.params.userid) {
			this.props.startLoading();
			let { userid } = this.props;
			logoutReq({userid})
			.then( async (res) => {
				toast(res.data.message || "Logout Successful");
				this.props.logout();
				await removeToken();
				this.props.navigation.navigate("login");
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
					prof: response,
					profpic: response.uri
				});
			}
		});
	}

	render() {
		let { handleChange, handleFile, handleSubmit, confDelProf, confLogout, state: { profpic, name, username, email, mobile, isUser } } = this;
		return (
			<Container>
				<Content contentContainerStyle={{paddingTop: 30, paddingHorizontal: 20}}>
					<TouchableOpacity style={{alignSelf: 'center', minHeight: 180, width: '60%'}} onPress={() => {handleFile()}}>
						<Thumbnail large source={{uri: profpic || 'asset:/noImage.png', cache: 'force-cache'}} style={{alignSelf: 'center', minHeight: 180, width: '100%'}} />
					</TouchableOpacity>
					<Form>
						<Item floatingLabel>
							<Label>Name</Label>
							<Input value={name} editable={isUser} onChangeText={(val) => {handleChange("name", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>Username</Label>
							<Input value={username} editable={isUser} onChangeText={(val) => {handleChange("username", val)}} />
						</Item>
						<Item floatingLabel>
							<Label>E-mail</Label>
							<Input value={email} editable={false} />
						</Item>
						<Item floatingLabel>
							<Label>Mobile</Label>
							<Input value={mobile} editable={isUser} onChangeText={(val) => {handleChange("mobile", val)}} />
						</Item>
					</Form>
					<Button primary block style={{marginTop: 20, marginBottom: 15}} onPress={handleSubmit()}>
						<Text style={{color: 'white'}}>Save Changes</Text>
					</Button>
					<View style={{flexDirection: 'row'}}>
						<Button warning block style={{flex: 1}} onPress={() => {confLogout()}}>
							<Text>Logout</Text>
						</Button>
						<Button danger bordered block style={{flex: 1, marginLeft: 10}} onPress={() => {confDelProf()}}>
							<Text>Delete Profile</Text>
						</Button>
					</View>
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	userid: state.session.userid
});

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	logout: () => {dispatch(logout());}
});

export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(UserDetails));