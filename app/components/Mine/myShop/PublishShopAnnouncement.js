/**
 * Created by zachary on 2017/1/13.
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
  InteractionManager,
  TextInput
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../../common/Header'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import ImageInput from '../../common/Input/ImageInput'
import ImageGroupViewer from '../../common/Input/ImageGroupViewer'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'
import * as Toast from '../../common/Toast'
import Symbol from 'es6-symbol'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../../action/authActions'
import {fetchShopAnnouncements, } from '../../../action/shopAction'
import MultilineText from '../../common/Input/MultilineText'
import dismissKeyboard from 'react-native-dismiss-keyboard'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

let commonForm = Symbol('commonForm')
const announcementContentInput = {
  formKey: commonForm,
  stateKey: Symbol('announcementContentInput'),
  type: 'announcementContentInput'
}

const announcementCoverInput = {
  formKey: commonForm,
  stateKey: Symbol('announcementCoverInput'),
  type: 'announcementCoverInput'
}


class PublishShopAnnouncement extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{

    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }

  publishAnnouncement() {
    if(this.props.shopAnnouncementId) {
      this.props.submitFormData({
        formKey: commonForm,
        shopAnnouncementId: this.props.shopAnnouncementId,
        submitType: INPUT_FORM_SUBMIT_TYPE.UPDATE_ANNOUNCEMENT,
        success: ()=>{this.submitSuccessCallback(this, '更新成功')},
        error: ()=>{this.submitErrorCallback(this, '更新失败')}
      })
    }else {
      this.props.submitFormData({
        formKey: commonForm,
        id: this.props.id,
        submitType: INPUT_FORM_SUBMIT_TYPE.PUBLISH_ANNOUNCEMENT,
        success: ()=>{this.submitSuccessCallback(this, '发布成功')},
        error: ()=>{this.submitErrorCallback(this, '发布失败')}
      })
    }
  }

  submitSuccessCallback(context, message) {
    dismissKeyboard()
    this.props.fetchShopAnnouncements({
      id: context.props.id,
      isRefresh: true
    })
    Toast.show(message, {
      duration: 1000,
      onHidden: ()=>{
        Actions.pop()
      }
    })
  }

  submitErrorCallback(context, message) {
    Toast.show(message, {duration: 1000})
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftType="text"
          leftText="取消"
          leftPress={() => Actions.pop()}
          leftStyle={styles.headerLeftStyle}
          headerContainerStyle={styles.headerContainerStyle}
          title="发布公告"
          titleStyle={styles.headerTitleStyle}
          rightType="text"
          rightText='完成'
          rightPress={()=>{this.publishAnnouncement()}}
          rightStyle={styles.headerRightStyle}
        />
        <View style={styles.body}>
          <KeyboardAwareScrollView>
            <View>
              <MultilineText
                containerStyle={{backgroundColor: '#fff'}}
                placeholder="输入公告内容，关于店铺的动态、活动等，（100字以内）"
                inputStyle={{height: normalizeH(232)}}
                initValue={this.props.shopAnnouncementContent}
                {...announcementContentInput}/>
            </View>
            <View style={styles.bottomWrap}>
              <View style={{}}>
                <ImageInput
                  containerStyle={{width: 80, height: 80,borderWidth:0}}
                  addImageBtnStyle={{top:0, left: 0, width: 80, height: 80}}
                  choosenImageStyle={{width: 80, height: 80}}
                  {...announcementCoverInput}
                  addImage={require('../../../assets/images/upload_picture.png')}
                  initValue={this.props.shopAnnouncementCover}
                />
              </View>
              <Text style={styles.noticeTip}>选择一张图片做为公告封面</Text>
            </View>
          </KeyboardAwareScrollView>

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
  submitFormData,
  submitInputData,
  fetchShopAnnouncements
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishShopAnnouncement)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  headerContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: THEME.colors.green,
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64
      },
      android: {
        height: 44
      }
    }),
  },
  headerLeftStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  headerTitleStyle: {
    color: '#fff',
  },
  headerRightStyle: {
    color: '#fff',
    fontSize: em(17)
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: 64,
      },
      android: {
        marginTop: 44
      }
    }),
    flex: 1,
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH,
  },
  bottomWrap: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  noticeTip: {
    marginLeft: normalizeW(12),
    fontSize: em(12),
    color: '#BEBEBE'
  }


})