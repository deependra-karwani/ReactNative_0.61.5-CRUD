import { AsyncStorage } from "react-native";

export const saveToken = async (token) => {
	await AsyncStorage.setItem('token', token);
}

export const removeToken = async () => {
	await AsyncStorage.removeItem('token');
}

export const getToken = async () => {
	return await AsyncStorage.getItem('token');
}

// export const isLoggedIn = async () => {
// 	return Boolean(await AsyncStorage.getItem('token'));
// }