import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, TouchableHighlight } from 'react-native';

export class NavigationBackStructure extends Component {
	render() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableHighlight style={{marginLeft: 10}} onPress={() => {this.props.navigationProps.goBack(null)}}>
					<Icon name="md-arrow-back" size={28} />
				</TouchableHighlight>
			</View>
		);
	}
}