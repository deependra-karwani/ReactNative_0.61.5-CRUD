import Toast from 'react-native-simple-toast';

export default toast = (message) => {
	Toast.show(message, Toast.SHORT);
}