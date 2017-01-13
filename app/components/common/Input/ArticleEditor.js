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
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import {selectPhotoTapped} from '../../../util/ImageSelector'
import {uploadFile} from '../../../api/leancloud/fileUploader'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const COMP_TEXT = 'COMP_TEXT'
const COMP_IMG = 'COMP_IMG'


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
      subComp: [this.renderTextInput("", 0, true)],
      imgWidth: 200,
      imgHeight: 200,
      cursor: 0,        // 光标所在组件的索引
      start: 0,         // 光标所在文字的起始位置
    }
    this.comp = [this.renderTextInput("", 0, true)]
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

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
    if (this.props.data != newProps.data) {
      this.comp = []
      if (!newProps.data) {
        this.comp.push(this.renderTextInput("", 0, true))
      } else {
        newProps.data.map((comp, index) => {
          if (comp.type === COMP_TEXT) {
            this.comp.push(this.renderTextInput(comp.text, index, true))
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
    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })
  }

  keyboardWillHide = (e) => {
    this.setState({
      keyboardPadding: 0,
    })
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

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text}
    }
    this.props.inputFormUpdate(inputForm)
  }

  insertImage() {
    selectPhotoTapped({
      start: this.pickImageStart,
      failed: this.pickImageFailed,
      cancelled: this.pickImageCancelled,
      succeed: this.pickImageSucceed
    })
  }

  pickImageStart = () => {
  }

  pickImageFailed = () => {
  }

  pickImageCancelled = () => {
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

    Image.getSize(uploadPayload.fileUri, (width, height) => {
      let imgWidth = width
      let imgHeight = height
      let maxWidth = PAGE_WIDTH - 15
      if (width > maxWidth) {
        imgWidth = maxWidth
        imgHeight = Math.floor((height / width) * height)
      }
      this.setState({imgWidth, imgHeight})
    })

    uploadFile(uploadPayload).then((saved) => {
      let leanImgUrl = saved.savedPos
      this.insertImageComponent(leanImgUrl)
    }).catch((error) => {
      console.log('upload failed:', error)
    })
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
  }

  updateTextInput(index, content) {
    let data = this.props.data
    data[index].text = content
    this.inputChange(data)
  }

  selectChange(event) {
    let start = event.nativeEvent.selection.start
    this.setState({start: start})
  }

  renderTextInput(content, index, autoFocus = false) {
    return (
      <AutoGrowingTextInput
        style={styles.InputStyle}
        placeholder={autoFocus ? "" : this.props.placeholder}
        editable={this.props.editable}
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        value={content}
        onChangeText={(text) => this.updateTextInput(index, text)}
        onFocus={() => this.setState({cursor: index})}
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
        <View style={{position: 'absolute', top: -8, right: 8}}>
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
            {component}
          </View>
        )
      })
    )
  }

  renderEditToolView() {
    return (
      <View style={[styles.editToolView,
        {
          position: 'absolute',
          right: 50,
          bottom: this.state.keyboardPadding + this.props.wrapHeight + 50,
        }]}
      >
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => {this.insertImage()}}
                            style={styles.toolBtn}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../../../assets/images/insert_picture.png')}>
            </Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardDismissMode="on-drag"
          automaticallyAdjustContentInsets={false}
        >
          {this.renderComponents()}
        </KeyboardAwareScrollView>
        {this.renderEditToolView()}
      </View>
    )
  }
}

ArticleEditor.defaultProps = {
  editable: true,
  placeholder: '输入文字...',
  wrapHeight: 0,
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
    borderRadius: 25,
    overflow: 'hidden'
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