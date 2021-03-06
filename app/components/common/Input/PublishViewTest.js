/**
 * Created by yangyang on 2016/12/10.
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

import CommonTextInput from './CommonTextInput'
import ImageInput from './ImageInput'
import CommonButton from '../CommonButton'
import RichTextInput from './RichTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
  // initValue: '\<p\>这是个初始加载内容\<\/p\>'
}

class PublishViewTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closeTips: false,
      rteFocused: false,    // 富文本获取到焦点
    }
    this.insertImages = []
  }

  getRichTextImages(images) {
    this.insertImages = images
    console.log('images list', this.insertImages)
  }

  onRteFocusChanged = (val) => {
    if (val == true) {
      // this.scrollView.scrollTo({x: 0, y: 0, animated: false})
      // this.scrollView.scrollToPosition(0, 0, false)
    }

    this.setState({
      rteFocused: val,
    })
  }

  renderRichText() {
    const shouldFocus = this.state.rteFocused
    return (
      <RichTextInput
        {...articleContent}
        onFocus={this.onRteFocusChanged}
        shouldFocus={shouldFocus}
        simplify={true}
        getImages={(images) => this.getRichTextImages(images)}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, width: PAGE_WIDTH}}>
          {/*<KeyboardAwareScrollView*/}
            {/*ref={(ref) => {*/}
              {/*this.scrollView = ref*/}
            {/*}}*/}
            {/*keyboardDismissMode='on-drag'*/}
            {/*style={[{*/}
              {/*flex: 0,*/}
              {/*width: PAGE_WIDTH, paddingTop: 0, backgroundColor: '#ffffff', borderWidth: 5, borderColor: '#11ff33'*/}
            {/*},*/}
              {/*this.state.rteFocused ? {height: 0, overflow: 'hidden', marginTop: 0} : {}*/}
            {/*]}*/}
          {/*>*/}
            <View style={[{marginTop: 20}, this.state.rteFocused ? {height: 0, overflow: 'hidden', marginTop: 0} : {}]}>
              <ImageInput containerStyle={{height: 100, width: PAGE_WIDTH - 34}} />
            </View>
            <View style={[{marginTop: 20}, this.state.rteFocused ? {height: 0, overflow: 'hidden', marginTop: 0} : {}]}>
              <CommonTextInput {...articleName} placeholder="输入文章标题" />
            </View>

          <View>
            {this.renderRichText()}
          </View>
          {/*</KeyboardAwareScrollView>*/}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishViewTest)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})