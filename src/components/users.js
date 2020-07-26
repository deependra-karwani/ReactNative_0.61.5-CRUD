import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getAllUsersReq } from '../config/httpRoutes';
import toast from '../config/toast';
// import { withNavigationFocus } from '@react-navigation/compat';
import { Container, Card, CardItem, Left, Thumbnail, Body, Right } from 'native-base';
import { Text } from 'react-native';

class Users extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: null,
			allUsers: null
		};
	}

	fetchData = () => {
		this.props.startLoading();
		let { userid } = this.props;
		getAllUsersReq({userid})
		.then( (res) => {
			let { users, message } = res.data;
			message && toast(message);
			this.setState({allUsers: users, users: users.slice(0, 10)});
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
		// if(this.props.isFocused && !prevProps.isFocused) {
		if(this.props.navigation.isFocused() && !prevProps.navigation.isFocused()) {
			this.fetchData();
		}
	}

	navigateDetails = (userid) => {
		this.props.navigation.navigate("userDetails", {params: {userid}});
	}

	renderUsers = ({ item:user }) => {
		let { navigateDetails } = this;
		return (
			<Card>
				<CardItem onPress={() => {navigateDetails(user.id)}}>
					<Left>
						<Thumbnail large source={{uri: user.profpic || 'asset:/noImage.png', cache: 'force-cache'}} />
					</Left>
					<Body>
						<Text style={{fontWeight: 'bold', fontSize: 20}}>{user.username}</Text>
						<Text style={{fontSize: 18}}>{user.name}</Text>
					</Body>
					<Right></Right>
				</CardItem>
			</Card>
		)
	}

	extendList = () => {
		let { users: { length }, allUsers } = this.state;
		if(length < allUsers.length) {
			this.setState({ users: [...users, allUsers[length]] });
		}
	}

	render() {
		let { renderUsers, extendList, state: { users } } = this;
		return (
			<Container>
				{Array.isArray(users) ?
					users.length > 0 ?
						<FlatList
							data={users}
							numColumns={1}
							initialNumToRender={10}
							keyExtractor={(item, index) => index}
							renderItem={renderUsers}
							onEndReachedThreshold={0.5}
							onEndReached={extendList}
						/>
					:
						<Text style={{alignSelf: 'center', textAlignVertical: 'center', marginTop: '65%'}}>No other users have registered yet</Text>
				:
					<></>
				}
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
});

// export default withNavigationFocus(connect(mapStateToProps, mapDispatchToProps)(Users));
export default connect(mapStateToProps, mapDispatchToProps)(Users);