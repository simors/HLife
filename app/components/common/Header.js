import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH} from '../../util/Responsive'

export default class Header extends Component {
  constructor(props) {
    super(props)
  }

  renderLeft() {
  	if(this.props.leftType == 'icon'){
  		return (
        <View style={[styles.leftContainer, this.props.leftContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.leftPress()}>
            <Icon          
		          name={this.props.leftIconName}
		          style={[styles.left, this.props.leftStyle]} />
          </TouchableOpacity>
        </View>
      )
  	}else if(this.props.leftType == 'image') {
			return (
        <View style={[styles.leftContainer, this.props.leftContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.leftPress()}>
            <Image source={require(this.props.imageSource)} style={[styles.left, this.props.leftStyle]}></Image>
          </TouchableOpacity>
        </View>
      )
  	}else if(this.props.leftType == 'text') {
			return (
        <View style={[styles.leftContainer, this.props.leftContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.leftPress()}>
          	<Text style={[styles.left, this.props.leftStyle]}>{this.props.leftText}</Text>  
          </TouchableOpacity>
        </View>
      )
  	}else {
      return (
        <View />
      )
    }
  }

  renderRight() {
  	if(this.props.rightType == 'icon'){
  		return (
        <View style={[styles.rightContainer, this.props.rightContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.rightPress()}>
            <Icon          
		          name={this.props.rightIconName}
		          style={[styles.right, this.props.rightStyle]} />
          </TouchableOpacity>
        </View>
      )
  	}else if(this.props.rightType == 'image') {
			return (
        <View style={[styles.rightContainer, this.props.rightContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.rightPress()}>
            <Image source={require(this.props.imageSource)} style={[styles.right, this.props.rightStyle]}></Image>
          </TouchableOpacity>
        </View>
      )
  	}else if(this.props.rightType == 'text') {
			return (
        <View style={[styles.rightContainer, this.props.rightContainerStyle]}>
          <TouchableOpacity onPress={() => this.props.rightPress()}>
          	<Text style={[styles.right, this.props.rightStyle]}>{this.props.rightText}</Text>  
          </TouchableOpacity>
        </View>
      )
  	}else {
      return (
        <View />
      )
    }
  }

  render() {
    return (
      <View style={styles.header}>
      	{this.renderLeft()}
        <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>  
        {this.renderRight()}
      </View>
    )
  }

}

Header.defaultProps = {
	leftType: 'icon',
	leftIconName: 'ios-arrow-back',
	title: '登录',
	rightType: 'text',
	rightText: '快速注册'
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f3f3f3',
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#B2B2B2'
  },
  leftContainer: {
  	position: 'absolute',
    left: 9,
    bottom: 14,
    width: 13,
    height: 21,
    zIndex: 10
  },
  left: {
    fontSize: em(24),
    color: '#50E3C2',
  },
  title: {
    flex: 1,
    lineHeight: 44,
    fontSize: em(17),
    color: '#030303',
    textAlign: 'center'
  },
  rightContainer: {
    position: 'absolute',
    right: 9,
    bottom: 14,
    zIndex: 10,
  },
  right: {
    fontSize: em(17),
    color: '#50E3C2',
    textAlign: 'right',
  }
})