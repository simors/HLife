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
  Keyboard,
  ScrollView,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import RNFS from 'react-native-fs'
import WebViewBridge from 'react-native-webview-bridge'
import {selectPhotoTapped} from '../../../util/ImageSelector'
import {uploadFile} from '../../../api/leancloud/fileUploader'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

var toolDefault = [
  require('../../../assets/images/bold.png'),
  require('../../../assets/images/italics.png'),
  require('../../../assets/images/underline.png'),
  require('../../../assets/images/insert_picture.png'),
]

var toolSelect = [
  require('../../../assets/images/bold_selected.png'),
  require('../../../assets/images/italics_selected.png'),
  require('../../../assets/images/underline_selected.png'),
  require('../../../assets/images/insert_picture.png'),
]

var tools = [
  {type: 'bold', icon: toolDefault[0]},
  {type: 'italic', icon: toolDefault[1]},
  {type: 'underline', icon: toolDefault[2]},
  {type: 'image', icon: toolDefault[3]},
]

const GET_FOCUS = 'GET_FOCUS'
const LOSE_FOCUS = 'LOSE_FOCUS'
const LOAD_DRAFT = 'LOAD_DRAFT'
const COUNTER = 'COUNTER'
const CONTENTS = 'CONTENTS'
const HEIGHT = 'HEIGHT'
const ABSTRACT = 'ABSTRACT'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height
const MIN_RTE_HEIGHT = 350
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
    this.abstract = ""
    this.lastText = ""
    this.lastWordCnt = 0
    this.insertImages = []
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: this.props.initValue},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
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

  articleContentChange(data) {
    let updateData = {
      text: this.lastText,
      wordCount: this.lastWordCnt,
      abstract: this.abstract,
    }
    if (data.abstract) {
      updateData.abstract = data.abstract
      this.abstract = data.abstract
    }
    if (data.text) {
      updateData.text = data.text
      this.lastText = data.text

      // 更新图片列表
      if (this.props.getImages) {
        let tmpImgs = this.insertImages
        this.insertImages = tmpImgs.filter((img) => {
          return updateData.text.indexOf(img) != -1
        })
        this.props.getImages(this.insertImages)
      }
    }
    if (data.wordCount) {
      updateData.wordCount = data.wordCount
      this.lastWordCnt = data.wordCount
    }
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: updateData
    }
    this.props.inputFormUpdate(inputForm)
  }

  loadDraft = () => {
    if (this.props.initValue) {
      this.webView.sendToBridge('editStr_' + this.props.initValue)
    }
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  keyboardWillShow = (e) => {
    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.setState({
      keyboardPadding: 0,
    })
    this.webView.sendToBridge('keyboard_hide')
  }

  renderWebView() {
    const source = Platform.OS == 'ios' ?
    {uri: RNFS.MainBundlePath + "/richTextEdit.html"} : {uri: "file:///android_asset/richTextEdit.html"}

    // const height = PAGE_HEIGHT - navBarPadding - this.state.keyboardPadding - (Platform.OS == 'android' ? 20 : 0)
    const height = this.state.webViewHeight
    // console.log("webview height: ", height)

    return (
      <ScrollView ref={(scroll) => this.scrollView = scroll}>
        <View style={{flex: 1, height: height}}>
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
      </ScrollView>
    )
  }

  renderHideEditToolView = () => {
    if (this.props.simplify) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={[
                              styles.editToolKeyboardHide,
                              {width: 60, height: 60, borderRadius: 30, backgroundColor: '#eeeeee'}
                              ]}
                            onPress={() => {this.webView.sendToBridge('keyboard_hide')}}>
            <Image style={{width: 30, height: 30}}
                   source={require('../../../assets/images/close_keyboard.png')}/>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 1, backgroundColor: '#eeeeee'}}/>
          <TouchableOpacity style={styles.editToolKeyboardHide} onPress={() => {
            this.webView.sendToBridge('keyboard_hide')
          }}>
            <Image style={{width: 30, height: 30}} source={require('../../../assets/images/close_keyboard.png')}/>
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderEditToolView() {
    if (this.props.simplify) {
      return (
        <View>
          <View style={[styles.editToolView,
            {
              position: 'absolute',
              right: 150,
              bottom: this.state.keyboardPadding + this.props.wrapHeight + (Platform.OS == 'ios' ? 0 : 25) + 50,
            }]}
          >
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => {this.simplifyInsertImage()}}
                                style={{alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#eeeeee'}}>
                <Image
                  style={{width: 30, height: 30}}
                  source={require('../../../assets/images/insert_picture.png')}>
                </Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[styles.editToolView,
            {
              position: 'absolute',
              right: 50,
              bottom: this.state.keyboardPadding + this.props.wrapHeight + (Platform.OS == 'ios' ? 0 : 25) + 50,
            }]}
          >
            {this.renderHideEditToolView()}
          </View>
        </View>
      )
    } else {
      return (
        <View style={[styles.editToolView,
          {
            position: 'absolute',
            left: 0,
            bottom: this.state.keyboardPadding + (Platform.OS == 'ios' ? 0 : 25),
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
            {this.renderHideEditToolView()}
          </View>
        </View>
      )
    }
  }

  render() {
    const styleFocused = styles.mainContainerFocused
    const styleNormal = styles.mainContainer
    return (
      <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
        <View style={{height: 20}}></View>
        <View style={this.props.shouldFocus ? styleFocused : styleNormal}>
          {this.renderWebView()}
        </View>
        {(this.props.shouldFocus && this.state.keyboardPadding > 0) ? this.renderEditToolView() : <View />}
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
        this.loadDraft()
        break
      default:
        if (message.indexOf(COUNTER) == 0) {
          let number = message.substr(message.lastIndexOf('_') + 1, message.length)
          this.articleContentChange({wordCount: number})
        } else if (message.indexOf(CONTENTS) == 0) {
          let content = message.substr(message.lastIndexOf('_') + 1, message.length)
          this.articleContentChange({text: content})
        } else if (message.indexOf(HEIGHT) == 0) {
          const height = message.substr(message.lastIndexOf('_') + 1, message.length)
          let padding = (Platform.OS == 'ios' ? 0 : this.state.keyboardPadding)
          this.setState({
            webViewHeight: MIN_RTE_HEIGHT < parseInt(height) ? parseInt(height) + 200 + padding : MIN_RTE_HEIGHT,
          })
        } else if (message.indexOf(ABSTRACT) == 0) {
          let abstract = message.substr(message.lastIndexOf('_') + 1, message.length)
          this.articleContentChange({abstract: abstract})
        }
        break
    }
  }

  simplifyInsertImage = () => {
    this.webView.sendToBridge("preInsertImg_")
    selectPhotoTapped({
      start: this.pickAvatarStart,
      failed: this.pickAvatarFailed,
      cancelled: this.pickAvatarCancelled,
      succeed: this.pickImageSucceed
    })
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
      selectPhotoTapped({
        start: this.pickAvatarStart,
        failed: this.pickAvatarFailed,
        cancelled: this.pickAvatarCancelled,
        succeed: this.pickImageSucceed
      })
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
    let fileUri = ''
    if (Platform.OS === 'ios') {
      fileUri = fileUri.concat('file://')
    }
    fileUri = fileUri.concat(source.uri)

    let fileName = source.uri.split('/').pop()
    let uploadPayload = {
      fileUri: fileUri,
      fileName: fileName
    }

    uploadFile(uploadPayload).then((saved) => {
      let leanImgUrl = saved.savedPos
      if (this.props.getImages) {
        this.insertImages.push(leanImgUrl)
        this.props.getImages(this.insertImages)
      }
      this.webView.sendToBridge('editImg_' + leanImgUrl)

      this.scrollView.scrollTo({x: 0, y: this.state.webViewHeight-100})
      this.webView.sendToBridge('keyboard_hide')
    }).catch((error) => {
      console.log('upload failed:', error)
    })
  }
}

RichTextInput.defaultProps = {
  simplify: false,
  wrapHeight: 0,
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

class SimplifyEditToolView extends Component {

  render() {
    return (
      <View style={[
        {alignItems: 'center', justifyContent: 'center'},
        {width: 60, height: 60, borderRadius: 30, backgroundColor: '#50E3C2'}
        ]}
      >
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
            //lostFocus();
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
  initInputForm,
  inputFormUpdate,
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
    height: 40,
  },
  editToolImgView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editToolImg: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  editToolKeyboardHide: {
    alignItems: "center",
    justifyContent: 'center',
  }
})