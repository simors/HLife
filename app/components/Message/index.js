/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class MessageBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="消息通知"
        />
        <View style={styles.itemContainer}>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>我的服务</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>我的私信</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>文章评论</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>店铺评论</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>文章点赞</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>店铺点赞</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>我的关注</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <TouchableOpacity style={styles.selectItem} onPress={() => Actions.CHATROOM()}>
              <Image source={require('../../assets/images/mine_collection.png')}></Image>
              <Text style={[styles.textStyle, {marginLeft: normalizeW(20)}]}>店铺关注</Text>
              <View style={{flex: 1}}></View>
              <View style={styles.noticeTip}></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#F7F7F7',
    alignItems: 'center',
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(45),
    paddingLeft: normalizeW(25),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(2),
    marginTop: normalizeH(5),
  },
  textStyle: {
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  noticeTip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 20,
  },
})