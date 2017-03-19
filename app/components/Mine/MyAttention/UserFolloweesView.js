/**
 * Created by yangyang on 2017/3/18.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

class UserFolloweesView extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let userInfo = this.props.userInfo
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: userInfo.id})}>
            <Image style={styles.avatarStyle}
                   source={userInfo.avatar ? {uri: userInfo.avatar} : require("../../../assets/images/default_portrait.png")}/>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: userInfo.id})}>
              <Text style={styles.userNameStyle}>{userInfo.nickname}</Text>
            </TouchableOpacity>
            <View style={styles.timeLocationStyle}>
              <Text style={styles.timeTextStyle}>
                粉丝: 3
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserFolloweesView)

const styles = StyleSheet.create({
  container: {
    marginTop: normalizeH(12),
    marginBottom: normalizeH(12),
    backgroundColor: '#ffffff',
  },
  avatarStyle: {
    height: normalizeH(44),
    width: normalizeW(44),
    marginLeft: normalizeW(12),
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: 1,
    marginLeft: 10,
    color: "#4a4a4a"
  },
  timeLocationStyle: {
    marginLeft: normalizeW(11),
    marginTop: normalizeH(9),
    flexDirection: 'row'
  },
  timeTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
})