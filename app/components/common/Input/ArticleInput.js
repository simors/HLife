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

class ArticleInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardPadding: 0,
      subComp: [this.renderTextInput()],
      imgWidth: 200,
      imgHeight: 200,
    }
    this.comp = []
    this.comp.push(this.renderTextInput())
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

  deleteImageComponent() {

  }

  insertImageComponent(src) {
    this.comp.push([this.renderImageInput(src), this.renderTextInput(true)])
    this.setState({subComp: this.comp})
  }

  renderTextInput(autoFocus = false) {
    return (
      <AutoGrowingTextInput
        style={styles.InputStyle}
        placeholder={autoFocus ? "" : this.props.placeholder}
        editable={this.props.editable}
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
      />
    )
  }

  renderImageInput(src) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image resizeMode='contain'
               style={[styles.imgInputStyle, {width: this.state.imgWidth, height: this.state.imgHeight}]}
               source={{uri: src}}>
        </Image>
        <View style={{position: 'absolute', top: -8, right: 8}}>
          <TouchableOpacity onPress={() => this.deleteImageComponent()}>
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

ArticleInput.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ArticleInput)

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