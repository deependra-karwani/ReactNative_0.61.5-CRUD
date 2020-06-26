import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import UserDetails from '../components/userDetails';
import Users from '../components/users';
import { NavigationBackStructure } from './structures';

const Stack = createStackNavigator();

const authScreenOptions = {
	gestureEnabled: false,
	headerMode: 'screen',
	animationEnabled: true,
	animationTypeForReplace: 'push',
	headerShown: false
};

const usersStackOptions = ({ navigation }) => ({
	title: 'Users'
});

const userDetailsStackOptions = ({ navigation }) => ({
	title: '',
	headerLeft: () => <NavigationBackStructure navigationProps={navigation} />
});

const AuthNav = () => (
	<Stack.Navigator initialRouteName="users" screenOptions={authScreenOptions}> 
		<Stack.Screen name="users" component={Users} options={usersStackOptions} />
		<Stack.Screen name="userDetails" component={UserDetails} options={userDetailsStackOptions} />
	</Stack.Navigator>
);

export default AuthNav;