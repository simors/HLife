/**
 * Created by zachary on 2016/12/13.
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
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import * as Toast from '../common/Toast'
import ImageGroupInput from '../common/Input/ImageGroupInput'
import MultilineText from '../common/Input/MultilineText'
import ScoreInput from '../common/Input/ScoreInput'
import * as authSelector from '../../selector/authSelector'
import Symbol from 'es6-symbol'
import {submitShopComment, fetchShopCommentList, fetchShopCommentTotalCount} from '../../action/shopAction'
import {submitFormData,INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const scoreInput = {
  formKey: commonForm,
  stateKey: Symbol('scoreInput'),
  type: 'score'
}
const commentInput = {
  formKey: commonForm,
  stateKey: Symbol('contentInput'),
  type: 'content'
}
const imageGroupInput = {
  formKey: commonForm,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}

class PublishShopComment extends Component {
  constructor(props) {
    super(props)
    this.isPublishing = false
    this.imgList = []
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentWillReceiveProps(nextProps) {
  }

  submitShopComment() {
    if(!this.props.isUserLogined) {
      Actions.LOGIN()
      return
    }
    this.publishShopComment()
  }

  publishShopComment() {
    if (this.isPublishing) {
      Toast.show('正在发表评论，请稍后')
      return
    }
    this.isPublishing = true
    this.props.submitFormData({
      formKey: commonForm,
      id: this.props.id,
      shopOwnerId: this.props.shopOwnerId,
      submitType: INPUT_FORM_SUBMIT_TYPE.PUBLISH_SHOP_COMMENT,
      success: ()=>{
        this.props.fetchShopCommentList({isRefresh: true, id: this.props.id})
        this.props.fetchShopCommentTotalCount({id: this.props.id})
        Toast.show('恭喜您,发表评论成功', {
          duration: 1000,
          onHidden: ()=> {
            Actions.pop()
          }
        })
        this.isPublishing = false
      },
      error: (err)=>{
        Toast.show(err.message || '发表评论失败')
        this.isPublishing = false
      }
    })
  }

  rightComponent() {
    return (
      <TouchableOpacity style={[styles.rightContainer]}
                        onPress={() => this.submitShopComment()}>
        <View style={styles.commentBtnWrap}>
          <Text style={styles.commentBtn}>发  表</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发表评价"
          rightType="text"
          rightText="发表"
          rightPress={() => this.submitShopComment()}
        />
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.CommentWrap}>
              <View style={styles.contentWrap}>
                <MultilineText
                  containerStyle={{backgroundColor: '#fff'}}
                  placeholder="对店铺的服务、环境等的综合评价"
                  inputStyle={{height: normalizeH(232),borderTopWidth:0,borderBottomWidth:0}}
                  {...commentInput}/>
              </View>
              <View style={styles.ImageInputWrap}>
                <ImageGroupInput
                  {...imageGroupInput}
                  number={9}
                  imageLineCnt={3}
                  getImageList={(imgList)=>{this.imgList = imgList}}
                />
              </View>
            </View>
          </ScrollView>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)

  return {
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
  fetchShopCommentList,
  fetchShopCommentTotalCount,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopComment)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    backgroundColor: '#fff'
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 12
  },
  commentBtnWrap: {
    paddingTop: normalizeH(8),
    paddingBottom: normalizeH(8),
    paddingLeft: normalizeW(16),
    paddingRight: normalizeW(16),
    backgroundColor: THEME.colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalizeBorder(),
    borderColor: THEME.colors.green,
    borderRadius: 5
  },
  commentBtn: {
    color: '#fff',
    fontSize: em(15)
  },
  scoreWrap: {
    marginTop: normalizeH(24),
    paddingLeft: 6,
    paddingRight: 6,
    paddingBottom: 15,
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#e6e6e6'
  },
  contentWrap: {

  },
  ImageInputWrap: {

  }

})