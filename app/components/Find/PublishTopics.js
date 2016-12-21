/**
 * Created by wuxingyu on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {publishTopicFormData, TOPIC_FORM_SUBMIT_TYPE} from '../../action/topicActions'
import * as Toast from '../common/Toast'

import CommonTextInput from '../common/Input/CommonTextInput'
import RichTextInput from '../common/Input/RichTextInput'
import {Actions} from 'react-native-router-flux'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

let articleForm = Symbol('articleForm')
const articleName = {
  formKey: articleForm,
  stateKey: Symbol('articleName'),
  type: "articleName",
}

const articleContent ={
  formKey: articleForm,
  stateKey: Symbol('articleContent'),
  type: 'articleContent',
  initValue: '\<p\>输入正文...\<\/p\>'
}

class PublishTopics extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closeTips: false,
      rteFocused: false,    // 富文本获取到焦点
    }
  }

  onButtonPress = () => {
    this.props.publishTopicFormData({
      formKey: articleForm,
      categoryId: this.props.topicId.objectId,
      submitType: TOPIC_FORM_SUBMIT_TYPE.PUBLISH_TOPICS,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  onRteFocusChanged = (val) => {
    if (val == true) {
    }

    this.setState({
      rteFocused: val,
    })
  }

  submitSuccessCallback() {
    Toast.show('发表成功')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show('发表失败')
    Actions.pop()
  }

  renderRichText() {
    const shouldFocus = this.state.rteFocused
    return (
      <RichTextInput
        {...articleContent}
        onFocus={this.onRteFocusChanged}
        shouldFocus={shouldFocus}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerContainerStyle={[this.state.rteFocused ? {height: 0, overflow: 'hidden', marginTop: 0} : {}]}
          leftPress={() => Actions.pop()}
          title="发表文章"
          rightType="text"
          rightText="发表"
          rightPress={() => this.onButtonPress()}
        />
        <View style={this.state.rteFocused?styles.bodyFocus:styles.body}>
            <View style={[{marginTop: 20}, this.state.rteFocused ? {height: 0, overflow: 'hidden', marginTop: 0} : {}]}>
              <CommonTextInput {...articleName} placeholder="输入文章标题" />
            </View>

          <View>
            {this.renderRichText()}
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishTopicFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishTopics)

const styles = StyleSheet.create({
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    width: PAGE_WIDTH
  },
  bodyFocus:{
    flex: 1,
    width: PAGE_WIDTH
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})