import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Register from '../components/register';
import Login from '../components/login';
import ForgotPassword from '../components/forgotPass';
import { NavigationBackStructure } from './structures';

const Stack = createStackNavigator();

const unauthScreenOptions = {
	gestureEnabled: false,
	headerMode: 'screen',
	animationEnabled: true,
	animationTypeForReplace: 'push',
	headerShown: false
};

const loginStackOptions = ({ navigation }) => ({
	title: 'Login'
});

const registerStackOptions = ({ navigation }) => ({
	title: '',
	headerLeft: () => <NavigationBackStructure navigationProps={navigation} />
});

const forgotStackOptions = ({ navigation }) => ({
	title: '',
	headerLeft: () => <NavigationBackStructure navigationProps={navigation} />
});

const UnauthNav = () => (
	<Stack.Navigator initialRouteName="login" screenOptions={unauthScreenOptions}> 
		<Stack.Screen name="login" component={Login} options={loginStackOptions} />
		<Stack.Screen name="register" component={Register} options={registerStackOptions} />
		<Stack.Screen name="forgot" component={ForgotPassword} options={forgotStackOptions} />
	</Stack.Navigator>
);

export default UnauthNav;