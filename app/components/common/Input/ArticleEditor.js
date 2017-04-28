/**
 * Created by yangyang on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  findNodeHandle
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import AutoGrowingTextInput from '../../common/Input/AutoGrowingTextInput'
import * as ImageUtil from '../../../util/ImageUtil'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import ActionSheet from 'react-native-actionsheet'
import * as Toast from '../Toast'
import * as DeviceInfo from 'react-native-device-info'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const COMP_TEXT = 'COMP_TEXT'
const COMP_IMG = 'COMP_IMG'

const androidStatusbarHeight = normalizeH(20)

/****************************************************************
 *
 * 数据格式：将所有组件中的数据组织为一个数组，每一个数组中数据结构如下：
 * {
 *    type: [COMP_TEXT | COMP_IMG],
 *    text: 当type为COMP_TEXT时有效，为<Text>元素中的文本内容
 *    url: 当type为COMP_IMG时有效，为<Image>元素的图片地址
 *    width: 当type为COMP_IMG时有效，表示图片的宽度
 *    height: 当type为COMP_IMG时有效，表示图片的高度
 * }
 *
 **/

class ArticleEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardPadding: 0,
      subComp: [this.renderTextInput("", 0, false)],
      imgWidth: 200,
      imgHeight: 200,
      cursor: 0,        // 光标所在组件的索引
      start: 0,         // 光标所在文字的起始位置
      editorHeight: new Animated.Value(0),
      scrollViewHeight: 0,
      contentHeight: 0,
      showToolbar: false,
      compHeight: 0,
    }
    this.comp = [this.renderTextInput("", 0, false)]
    // this.compHeight = 0
    this.inputRef = []
    this.toolbarHeight = normalizeH(40)
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    // this.compHeight = PAGE_HEIGHT - this.props.wrapHeight - (Platform.OS === 'ios' ? 0 : androidStatusbarHeight)
    let compHeight = PAGE_HEIGHT - this.props.wrapHeight - (Platform.OS === 'ios' ? 0 : androidStatusbarHeight)
    this.setState({
      compHeight: compHeight,
      editorHeight: new Animated.Value(compHeight - this.state.keyboardPadding - this.toolbarHeight)
    })

    let initText = []
    if (this.props.initValue) {
      initText = this.props.initValue
    } else {
      initText = [
        {
          type: COMP_TEXT,
          text: ""
        }
      ]
    }

    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: initText},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.wrapHeight != newProps.wrapHeight) {
      let compHeight = PAGE_HEIGHT - newProps.wrapHeight - (Platform.OS === 'ios' ? 0 : androidStatusbarHeight)
      this.setState({
        compHeight: compHeight,
        editorHeight: new Animated.Value(compHeight - this.state.keyboardPadding- this.toolbarHeight)
      })
    }

    if (this.props.data != newProps.data) {
      this.comp = []
      this.inputRef = []
      if (!newProps.data) {
        this.comp.push(this.renderTextInput("", 0, false))
      } else {
        newProps.data.map((comp, index) => {
          if (comp.type === COMP_TEXT) {
            this.comp.push(this.renderTextInput(comp.text, index, (this.props.mode == 'edit') ? true : false))
          } else if (comp.type === COMP_IMG) {
            this.comp.push(this.renderImageInput(comp.url, comp.width, comp.height, index))
          }
        })
      }
      this.setState({subComp: this.comp})

      if (this.props.getImages) {
        this.props.getImages(this.getImageCollection(newProps.data))
      }
    }

    if(newProps.shouldUploadImgComponent && !this.isUploadedImgComponent) {
      this.uploadImgComponent(newProps.data)
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
    let isFocus = this.inputRef.find((input) => {
      if (input.isFocused()) {
        return true
      }
      return false
    })
    if (isFocus) {
      this.setState({showToolbar: true})
    }
    this.toolbarHeight = normalizeH(40)

    let newEditorHeight = this.state.compHeight - e.endCoordinates.height - this.toolbarHeight
    Animated.timing(this.state.editorHeight, {
      toValue: newEditorHeight,
      duration: 210,
    }).start();

    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.inputRef.forEach((input) => {
      if (input) {
        input.blur()
      }
    })
    if (this.props.onBlurEditor) {
      this.props.onBlurEditor()
    }
    Animated.timing(this.state.editorHeight, {
      toValue: this.state.compHeight,
      duration: 210,
    }).start();

    this.setState({
      keyboardPadding: 0,
      showToolbar: false,
    })
    this.toolbarHeight = 0
  }

  getImageCollection(data) {
    let images = []
    data.forEach((item) => {
      if (item.type === COMP_IMG) {
        images.push(item.url)
      }
    })
    return images
  }

  updateImageCollection(data, leanImgUrls) {
    let index = 0
    data.forEach((item) => {
      if (item.type === COMP_IMG) {
        item.url = leanImgUrls[index++]
      }
    })
    this.inputChange(data)
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  getAbstract(n) {
    let data = this.props.data
    let text = ""
    data.forEach((item) => {
      if (item.type === COMP_TEXT) {
        text += item.text
      }
    })
    if (text.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
      return text;
    } else {
      let len = 0;
      let tmpStr = "";
      for (var i = 0; i < text.length; i++) {//遍历字符串
        if (/[\u4e00-\u9fa5]/.test(text[i])) {//中文 长度为两字节
          len += 2;
        } else {
          len += 1;
        }
        if (len > n) {
          break;
        } else {
          tmpStr += text[i];
        }
      }
      return tmpStr + "...";
    }
  }

  inputChange(text) {
    let abstract = this.getAbstract(100)
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text, abstract}
    }
    this.props.inputFormUpdate(inputForm)
  }

  insertImage() {
    this.ActionSheet.show()
  }

  uploadImgComponent(data) {
    let localImgs = this.getImageCollection(data)
    if(localImgs && localImgs.length) {
      ImageUtil.batchUploadImgs(localImgs).then((leanUris) => {
        this.isUploadedImgComponent = true
        this.updateImageCollection(data, leanUris)
        if(this.props.uploadImgComponentCallback) {
          this.props.uploadImgComponentCallback(leanUris)
        }
      })
    } else {
      if(this.props.uploadImgComponentCallback) {
        this.props.uploadImgComponentCallback([])
      }
    }
  }

  deleteImageComponent(index) {
    let data = this.props.data
    let len = data.length
    if (index + 1 < len && index - 1 >= 0) {
      if (data[index+1].type === COMP_TEXT && data[index-1].type === COMP_TEXT) {
        data[index-1].text += '\n' + data[index+1].text
        data.splice(index, 2)
      } else {
        data.splice(index, 1)
      }
    } else {
      data.splice(index, 1)
    }

    this.inputChange(data)
  }

  insertImageComponent(src) {
    ImageUtil.getImageSize({
      uri: src,
      success: (imgWidth, imgHeight) => {
        this.setState({imgWidth, imgHeight}, ()=> {
          let data = this.props.data
          let imgData = {
            type: COMP_IMG,
            url: src,
            width: this.state.imgWidth,
            height: this.state.imgHeight,
          }
          let textData = {
            type: COMP_TEXT,
            text: ""
          }
          let content = data[this.state.cursor].text
          let begin = content.substring(0, this.state.start)
          let end = content.substring(this.state.start)
          data[this.state.cursor].text = begin
          textData.text = end
          data.splice(this.state.cursor + 1, 0, imgData, textData)
          this.inputChange(data)
        })
      }
    })
  }

  updateTextInput(index, content) {
    let data = this.props.data
    data[index].text = content
    this.inputChange(data)

    let refName = "content_" + index
    if (this.state.start == content.length) {
      setTimeout(() => {
        let scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          findNodeHandle(this.refs[refName]),
          this.toolbarHeight + 80, //additionalOffset
          true
        );
      }, 50);
    }

    // 内容高度小于显示高度是，不调整光标位置
    /*if (this.state.contentHeight < this.state.scrollViewHeight) {
      return
    }
    let len = data.length
    if (len - 1 == index) {
      this.refs.scrollView.scrollTo({y: this.state.contentHeight - this.state.scrollViewHeight})
    }*/
  }

  selectChange(event) {
    let start = event.nativeEvent.selection.start
    this.setState({start: start})
  }

  inputFocused(refName) {
    // 内容高度小于显示高度是，不调整光标位置
    if (this.state.contentHeight < this.state.scrollViewHeight) {
      return
    }
    let focusInput = this.inputRef.find((input) => {
      if (input.isFocused()) {
        return true
      }
      return false
    })
    let selectIndex = this.state.cursor
    let content = this.props.data[selectIndex].text
    if (focusInput) {
      let textInputHeight = focusInput.getInputHeight()
      let textLen = content.length
      // 计算当前光标距离底部的高度
      let bottomHeight = textInputHeight - (textInputHeight * this.state.start) / textLen
      if (bottomHeight < normalizeH(300)) {
        setTimeout(() => {
          let scrollResponder = this.refs.scrollView.getScrollResponder();
          scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
            findNodeHandle(this.refs[refName]),
            this.toolbarHeight + 80, //additionalOffset
            true
          );
        }, 50);
      }
    }
  }

  renderTextInput(content, index, autoFocus = false) {
    return (
      <AutoGrowingTextInput
        ref={(o) => {
          if (o && !this.inputRef.includes(o)) {
            this.inputRef.push(o)
          }
        }}
        style={styles.InputStyle}
        placeholder={this.props.placeholder}
        editable={this.props.editable}
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        value={content}
        onChangeText={(text) => this.updateTextInput(index, text)}
        onFocus={() => {
          if (this.props.onFocusEditor) {
            this.props.onFocusEditor()
          }
          this.setState({cursor: index, showToolbar: true})
          this.inputFocused("content_" + index)
        }}
        onSelectionChange={(event) => this.selectChange(event)}
      />
    )
  }

  renderImageInput(src, width, height, index) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image style={[styles.imgInputStyle, {width, height}]}
               source={{uri: src}}>
        </Image>
        <View style={{position: 'absolute', top: 0, right: 0}}>
          <TouchableOpacity onPress={() => this.deleteImageComponent(index)}>
            <Image style={{width: 30, height: 30, borderRadius: 15, overflow: 'hidden'}}
                   source={require('../../../assets/images/delete.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderComponents() {
    return (
      this.state.subComp.map((component, index) => {
        return (
          <View key={index}>
            <View ref={"content_" + index}>
              {component}
            </View>
          </View>
        )
      })
    )
  }

  renderEditToolView() {
    let extHeight = 0
    if ('honor' == DeviceInfo.getBrand()) {   // 华为荣耀手机特殊处理
      extHeight = 8
    }
    return (
      <View style={[styles.editToolView,
        {
          position: 'absolute',
          left: 0,
          bottom: this.state.keyboardPadding + extHeight,
          width: PAGE_WIDTH,
          height: this.toolbarHeight,
        }]}
      >
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
            <TouchableOpacity onPress={() => {this.insertImage()}}
                              style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/insert_picture.png')}>
              </Image>
              <Text style={{fontSize: 15, color: '#AAAAAA', marginLeft: normalizeW(10)}}>添加图片</Text>
            </TouchableOpacity>
          </View>
          {this.props.renderCustomToolbar ? this.props.renderCustomToolbar() : <View/>}
        </View>
      </View>
    )
  }

  _handleActionSheetPress(index) {
    if(0 == index) { //拍照
      ImageUtil.openPicker({
        openType: 'camera',
        success: (response) => {
          this.insertImageComponent(response.path)
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      })
    }else if(1 == index) { //从相册选择
      ImageUtil.openPicker({
        openType: 'gallery',
        success: (response) => {
          this.insertImageComponent(response.path)
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      })
    }
  }

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => this.ActionSheet = o}
        title=""
        options={['拍照', '从相册选择', '取消']}
        cancelButtonIndex={2}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    )
  }

  render() {
    return (
      <View style={{width: PAGE_WIDTH, height: this.state.compHeight, backgroundColor: 'white'}}>
        <Animated.View style={{height: this.state.editorHeight}}>
          <ScrollView
            ref="scrollView"
            style={{flex: 1}}
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps={true}
            onContentSizeChange={ (contentWidth, contentHeight) => {
              this.setState({contentHeight: contentHeight })
            }}
            onLayout={ (e) => {
              const height = e.nativeEvent.layout.height
              this.setState({scrollViewHeight: height })
            }}
          >
            {this.renderComponents()}
          </ScrollView>
        </Animated.View>
        {this.state.showToolbar ? this.renderEditToolView() : <View/>}
        {this.renderActionSheet()}
      </View>
    )
  }
}

ArticleEditor.defaultProps = {
  editable: true,
  placeholder: '输入文字...',
  wrapHeight: 0,
  mode: 'edit',   // edit: edit at the first time; modify: edit with the given content
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEditor)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  InputStyle: {
    width: PAGE_WIDTH,
    fontSize: em(16),
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#E6E6E6',
    textAlign: "left",
    textAlignVertical: "top"
  },
  editToolView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    // borderRadius: 25,
    // overflow: 'hidden'
  },
  imgInputStyle: {
    maxWidth: PAGE_WIDTH,
    marginTop: 10,
    marginBottom: 10,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eeeeee',
    overflow: 'hidden'
  }
})