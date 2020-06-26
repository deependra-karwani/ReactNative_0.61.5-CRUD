import { LOGIN, LOGOUT, SAVE_FCM } from './types';

export const login = (data) => ({
	type: LOGIN,
	data
});

export const logout = () => ({
	type: LOGOUT
});

export const saveFCM = (data) => ({
	type: SAVE_FCM,
	data
});