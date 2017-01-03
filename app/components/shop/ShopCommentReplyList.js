/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'

import Triangle from '../common/Triangle'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCommentReplyList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    return (
      <View style={styles.replyWrap}>
        <Triangle width={8} height={5} color="rgba(0,0,0,0.05)" style={[styles.triangle]} direction="up"/>
        <View style={styles.upReplyContainer}>
          <View style={styles.upUsersContainer}>
            <Image style={{width:10,height:10,marginRight:5}} source={require('../../assets/images/artical_like_unselect.png')}/>
            <TouchableOpacity style={styles.upUserBox}>
              <Text style={styles.upUser}>左凯</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.upUserBox}>
              <Image style={{width:12,height:12}} source={require('../../assets/images/artical_like_unselect.png')}/>
            </TouchableOpacity>
          </View>

          <View style={styles.replyContainer}>
            <View style={styles.replyInnerContainer}>
              <View style={styles.replyTitleWrap}>
                <TouchableOpacity style={styles.replyUserBox}>
                  <Text style={styles.replyUser}>左凯</Text>
                </TouchableOpacity>
                <Text style={styles.replyWord}>回复</Text>
                <TouchableOpacity style={styles.replyUserBox}>
                  <Text style={styles.replyUser}>杨阳</Text>
                </TouchableOpacity>
                <Text style={styles.replyWord}>:</Text>

                <View style={styles.replyContentWrap}>
                  <Text style={styles.replyContent}>回复哈师大发生大火发哈收到回复哈佛哈多喝水</Text>
                </View>
              </View>

            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopCommentReplyList)

const styles = StyleSheet.create({
  replyWrap: {
    backgroundColor: '#fff'
  },
  upReplyContainer: {
    height:100,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  triangle: {
    marginLeft:6
  },
  upUsersContainer: {
    flexDirection: 'row',
    padding:10,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: THEME.colors.lighterA
  },
  upUserBox: {
    marginRight:8
  },
  upUser: {
    fontSize: em(10),
    color: '#8f8e94',
  },
  replyTitleWrap: {
    flex:1,
    flexDirection: 'row',
  },
  replyContainer: {
    flexDirection: 'row',
    padding:10,
  },
  replyInnerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  replyUserBox: {

  },
  replyUser: {
    fontSize: em(10),
    color: THEME.colors.green,
  },
  replyWord: {
    fontSize: em(10),
    color: '#8f8e94',
  },
  replyContentWrap: {
    flex: 1,
  },
  replyContent: {
    fontSize: em(12),
    color: '#8f8e94',
  }

})