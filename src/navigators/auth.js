import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserDetails from '../components/userDetails';
import Users from '../components/users';

const Tab = createBottomTabNavigator();

const authTabOptions = {
	gestureEnabled: false,
	animationEnabled: true,
	activeTintColor: 'cyan',
	inactiveTintColor: 'black',
	activeBackgroundColor: 'white',
	inactiveBackgroundColor: 'white',
	keyboardHidesTabBar: true
};

const usersStackOptions = ({ navigation }) => ({
	title: 'Users'
});

const userDetailsStackOptions = ({ navigation }) => ({
	title: 'Profile'
});

const AuthNav = () => (
	<Tab.Navigator initialRouteName="users" tabBarOptions={authTabOptions} backBehavior="history" /* tabBar={(props) => <TabComp {...props} />} */ > 
		<Stack.Screen name="users" component={Users} options={usersStackOptions} />
		<Stack.Screen name="userDetails" component={UserDetails} options={userDetailsStackOptions} />
	</Tab.Navigator>
);

export default AuthNav;