/**
 * Created by yangyang on 2016/12/8.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Keyboard
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import RNFS from 'react-native-fs'
import WebViewBridge from 'react-native-webview-bridge'

var toolDefault = [
  require('../../../assets/images/indent.png'),
  require('../../../assets/images/bold.png'),
  require('../../../assets/images/blockquote.png'),
  require('../../../assets/images/publish_tool_image.png'),
]

var toolSelect = [
  require('../../../assets/images/indent.png'),
  require('../../../assets/images/bold_sel.png'),
  require('../../../assets/images/blockquote_sel.png'),
  require('../../../assets/images/publish_tool_image.png'),
]

var tools = [
  {type: 'indent', icon: toolDefault[0]},
  {type: 'bold', icon: toolDefault[1]},
  {type: 'blockquote', icon: toolDefault[2]},
  {type: 'image', icon: toolDefault[3]},
]

const GET_FOCUS = 'GET_FOCUS'
const LOSE_FOCUS = 'LOSE_FOCUS'
const LOAD_DRAFT = 'LOAD_DRAFT'
const COUNTER = 'COUNTER'
const CONTENTS = 'CONTENTS'
const HEIGHT = 'HEIGHT'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height
const MIN_RTE_HEIGHT = 200
// const navBarPadding = (Platform.OS == 'android' ? 50 : 64)
const navBarPadding = 0

class RichTextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closeTips: {height: 0},
      toolSelect: tools.map((tool, index) => {
        return {select: false, index: index}
      }),
      webViewHeight: MIN_RTE_HEIGHT,
      keyboardPadding: 0,
    }
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  keyboardWillShow = (e) => {
    console.log("keyboard event: ", e)
    console.log("page height: ", Dimensions)
    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.setState({
      keyboardPadding: 0,
    })
  }

  renderWebView() {
    const source = Platform.OS == 'ios' ?
    {uri: RNFS.MainBundlePath + "/richTextEdit.html"} : {uri: "file:///android_asset/richTextEdit.html"}

    // const height = PAGE_HEIGHT - navBarPadding - this.state.keyboardPadding - (Platform.OS == 'android' ? 20 : 0)
    const height = this.state.webViewHeight
    console.log('richtext height: ' + height + ", when page height: " + PAGE_HEIGHT)

    return (
      <View style={{flex: 1, height: height, paddingTop: 10}}>
        <WebViewBridge
          ref={(web) => {
            this.webView = web
          }}
          onBridgeMessage={this.onBridgeMessage.bind(this)}
          injectedJavaScript={injectedJavaScript}
          hideKeyboardAccessoryView={true}
          automaticallyAdjustContentInsets={true}
          source={source}
        />
      </View>
    )
  }

  renderHideEditToolView = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{width: 1, backgroundColor: '#eeeeee'}}/>
        <TouchableOpacity style={styles.editToolKeyboardHide} onPress={() => {
          this.webView.sendToBridge('keyboard_hide')
        }}>
          <Image source={require('../../../assets/images/keyboad_down.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderEditToolView() {
    return (
      <View style={[styles.editToolView,
        {
          position: 'absolute',
          left: 0,
          bottom: this.state.keyboardPadding + 40,
        }]}
      >
        <View style={{flexDirection: 'row', width: PAGE_WIDTH}}>
          <View style={{flexDirection: 'row', flex: 4}}>
            {tools.map((tool, index) => {
              return (
                <EditToolView
                  key={"tool_" + index}
                  click={() => {
                    this.toolToBridge(tool.type, index)
                  }}
                  icon={this.state.toolSelect[index].select ?
                    toolSelect[index] : toolDefault[index]
                  }
                />
              )
            })}
          </View>
          {Platform.OS == 'ios' ? this.renderHideEditToolView() : <View />}
        </View>
      </View>
    )
  }

  render() {
    const styleFocused = styles.mainContainerFocused
    const styleNormal = styles.mainContainer
    return (
      <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
        <View style={this.props.shouldFocus ? styleFocused : styleNormal}>
          {this.renderWebView()}
        </View>
        {this.props.shouldFocus ? this.renderEditToolView() : <View />}
      </View>
    )
  }

  onBridgeMessage(message) {
    console.log(message)
    switch (message) {
      case GET_FOCUS:
        this.props.onFocus(true)
        this.setState({
          closeTips: {height: 0}
        })
        break
      case LOSE_FOCUS:
        this.props.onFocus(false)
        break
      case LOAD_DRAFT:
        // this.loadDraft()
        break
      default:
        if (message.indexOf(COUNTER) == 0) {
          let number = message.substr(message.lastIndexOf('_') + 1, message.length)
          // this.inputOnChangeWithPayload({wordCount: number})
        } else if (message.indexOf(CONTENTS) == 0) {
          let content = message.substr(message.lastIndexOf('_') + 1, message.length)
          // this.inputOnChangeWithPayload({content: content})
        } else if (message.indexOf(HEIGHT) == 0) {
          const height = message.substr(message.lastIndexOf('_') + 1, message.length)
          this.setState({
            webViewHeight: MIN_RTE_HEIGHT < parseInt(height) ? parseInt(height) + 100 : MIN_RTE_HEIGHT,
          })
        }
        break
    }
  }

  toolToBridge = (type, toolIndex) => {
    this.setState({
      toolSelect: this.state.toolSelect.map((toolSel, index) => {
        if (toolIndex == index) {
          toolSel.select = !toolSel.select
        }
        return toolSel
      })
    })
    if (toolIndex == tools.length - 1) {
      this.webView.sendToBridge("preInsertImg_")
      // selectPhotoTapped({
      //   start: this.pickAvatarStart,
      //   failed: this.pickAvatarFailed,
      //   cancelled: this.pickAvatarCancelled,
      //   succeed: this.pickImageSucceed
      // })
    } else {
      this.webView.sendToBridge(type)
    }
  }

  pickAvatarStart = () => {
  }

  pickAvatarFailed = () => {
  }

  pickAvatarCancelled = () => {
  }

  pickImageSucceed = (source) => {
    this.uploadImg(source)
  }

  uploadImg = (source) => {
    // let fileUri = ''
    // if (Platform.OS === 'ios') {
    //   fileUri = fileUri.concat('file://')
    // }
    // fileUri = fileUri.concat(source.uri)
    //
    // let fileName = source.uri.split('/').pop()
    // let uploadPayload = {
    //   fileUri: fileUri,
    //   fileName: fileName
    // }
    // uploadFile(uploadPayload).then((saved) => {
    //   let leanImgUrl = saved.savedPos
    //   var imgDom = leanImgUrl
    //   this.webView.sendToBridge('editImg_' + imgDom)
    // }).catch((error) => {
    //   console.log('upload failed:', error)
    // })
  }
}

class EditToolView extends Component {

  render() {
    return (
      <View style={styles.editToolImgView}>
        <TouchableOpacity
          onPress={() => {
            this.props.click()
          }}
        >
          <Image
            style={styles.editToolImg}
            source={this.props.icon}>
          </Image>
        </TouchableOpacity>
      </View>
    )
  }
}

const injectedJavaScript = `
    $(document).ready(function(event) {
        setTimeout(function(){
          if (WebViewBridge) {
            WebViewBridge.onMessage = function (message) {
              if(message == 'keyboard_hide'){
                lose_focus();
              }else if(message.indexOf('editImg_') == 0){
                var editImg = message.substr(message.indexOf('_') + 1, message.length);
                set_editImg(editImg);
              }else if(message.indexOf('editStr_') == 0){
                var editStr = message.substr(message.indexOf('_') + 1, message.length);
                set_editStr(editStr);
              }else if(message.indexOf('preInsertImg_') == 0){
                lostFocus();
              }else{
                set_any(message);
              }
            };
            WebViewBridge.send('LOAD_DRAFT');
          } else {
            setTimeout(function(){
              if (WebViewBridge) {
                WebViewBridge.onMessage = function (message) {
                  if(message == 'keyboard_hide'){
                    set_blur();
                  }else if(message.indexOf('editImg_') == 0){
                    var editImg = message.substr(message.indexOf('_') + 1, message.length);
                    set_editImg(editImg);
                  }else if(message.indexOf('editStr_') == 0){
                    var editStr = message.substr(message.indexOf('_') + 1, message.length);
                    set_editStr(editStr);
                  }else{
                    set_any(message);
                  }
                };
                WebViewBridge.send('LOAD_DRAFT');
              }
            }, 3000)
          }
        }, 300)
      });
`;

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RichTextInput)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContainerFocused: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  editToolView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    paddingTop: 5,
    paddingBottom: 5,
    height: 30,
  },
  editToolImgView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editToolImg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editToolKeyboardHide: {
    alignItems: "center",
    justifyContent: 'center',
  }
})