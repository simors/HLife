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
  type: 'articleContent'
}

class InputTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closeTips: false,
      rteFocused: false,    // 富文本获取到焦点
    }
  }

  onRteFocusChanged = (val) => {
    if (val == true) {
      // this.scrollView.scrollTo({x: 0, y: 0, animated: false})
      this.scrollView.scrollToPosition(0, 0, false)
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
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, width: PAGE_WIDTH}}>
          <KeyboardAwareScrollView
            ref={(ref) => {
              this.scrollView = ref
            }}
            keyboardDismissMode='on-drag'
            style={{
              flex: 0,
              width: PAGE_WIDTH, paddingTop: 0, backgroundColor: '#ffffff'
            }}
          >
            {/*<View style={[{marginTop: 20}, this.state.rteFocused ? {height: 0, overflow: 'hidden'} : {}]}>*/}
            <View style={{marginTop: 20}}>
              <ImageInput containerStyle={{height: 100, width: PAGE_WIDTH - 34}} />
            </View>
            {/*<View style={[{marginTop: 20}, this.state.rteFocused ? {height: 0, overflow: 'hidden'} : {}]}>*/}
            <View style={{marginTop: 20}}>
              <CommonTextInput {...articleName} placeholder="输入文章标题" />
            </View>
            <View style={{flex: 1, marginTop: 20}}>
              {this.renderRichText()}
            </View>
          </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(InputTest)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})