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
      <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: userInfo.id})}>
        <View style={styles.container}>
           <Image style={styles.avatarStyle}
                source={userInfo.avatar ? {uri: userInfo.avatar} : require("../../../assets/images/default_portrait.png")}/>
            <View style={styles.rightWrap}>
              <View style={styles.row}>
                {userInfo.shopInfo
                  ? <Image style={{marginRight:10,marginBottom:10}} source={require("../../../assets/images/personal_shop_16.png")}/>
                  : null
                }
                <Text numberOfLines={1} style={styles.titleTxt}>{userInfo.nickname}</Text>
              </View>
              {userInfo.latestTopic
                ?  <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.subTxt}>最新发布：</Text>
                    <Text numberOfLines={1} style={[styles.subTxt, {flex:1}]}>{userInfo.latestTopic.abstract}</Text>
                  </View>
                : null
              }
              
              <View style={styles.row}>
                <View style={styles.locationBox}>
                  <Image style={{marginRight:4}} source={require("../../../assets/images/writer_loaction.png")}/>
                  <Text style={styles.assistTxt}>{userInfo.geoCity || '未知'}</Text>
                </View>
                <Text style={[styles.assistTxt, styles.lastLoginDuration]}>{userInfo.lastLoginDuration + '来过'}</Text>
                <Text style={styles.assistTxt}>粉丝: {userInfo.followersCounts || 0}</Text>
              </View>
            </View>
        </View>
      </TouchableOpacity>
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
    padding: 15,
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarStyle: {
    height: 44,
    width: 44,
    borderRadius: 22,
  },
  rightWrap: {
    flex: 1,
    marginLeft: 10
  },
  titleTxt: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: "#5a5a5a",
    marginBottom: 10,
  },
  subTxt: {
    fontSize: 12,
    color: '#5a5a5a',
    marginBottom: 10,
  },
  assistTxt: {
    fontSize: 12,
    color: '#b6b6b6',
  },
  lastLoginDuration: {
    marginLeft: 30,
    marginRight: 30
  }
})