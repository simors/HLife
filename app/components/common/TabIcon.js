/**
 * Created by zachary on 2016/12/9.
 */
import React, {
  PropTypes,
  Component,
} from 'react'
import {
  Text,
  Image,
  View,
  StyleSheet,
	TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native'
import {connect} from 'react-redux'
import THEME from '../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class TabIcon extends Component {
  render() {
    return (
      <View>
        {this.publish(this.props.title, this.props.selected, this.props.number, this.props.onPress, this.props.isLogin)}
      </View>
    )
  }
  publish=(title, selected, index, onPressd, isLogin) =>{
    return (
      <TouchableWithoutFeedback onPress={()=> {
          onPressd({isLogin: isLogin, index: index})
        }}>
        <View style={styles.container}>
          {this.getImage(index, selected)}
          {this.getTitle(title, selected)}
          <View style={styles.topLine}/>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  getTitle=(title, selected) =>{
    return (
      <Text
        style={{color: selected ? THEME.colors.green : THEME.colors.gray, fontSize: 10, marginTop: 4}}
      >
        {title}
      </Text>
    )
  }

  getImage=(index, selected)=> {
    let imageSource = undefined
    switch (index) {
      case 0:
        imageSource = selected ? require("../../assets/images/home_select.png"): require("../../assets/images/home_unselect.png")
        break

      case 1:
        imageSource = selected ? require("../../assets/images/local_select.png"): require("../../assets/images/local_unselect.png")
        break

      case 2:
        imageSource = selected ? require("../../assets/images/find_select.png"): require("../../assets/images/find_unselect.png")
        break

      case 3:
        imageSource = selected ? require("../../assets/images/mine_select.png"): require("../../assets/images/mine_unselect.png")
        break
      default:
    }

    return(
      <View>
        <Image source={imageSource} />
        {this.renderRedDot(index)}
      </View>
    )
  }

  renderRedDot = (index) => {
    switch (index) {
      case 0:
        return <View />
      case 1:
        return <View />
      case 2:
        return <View />
      case 3:
        return <View />
      default:
    }
  }
}

const mapStateToProps = (state)=> {
  return {}
}

export default connect(mapStateToProps, null)(TabIcon)



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    height: 50,
    width: PAGE_WIDTH / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PAGE_WIDTH / 4,
    height: 0.5,
    backgroundColor: '#ededed',
  },
  redDotStyle: {
    position:'absolute',
    top:-1,
    right:-7,
    width:10,
    height:10,
    borderRadius:5,
    backgroundColor:'#FD5F5F'
  }
})
