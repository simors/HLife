/**
 * Created by yangyang on 2016/12/7.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {selectPhotoTapped} from '../../../util/ImageSelector'
import {uploadFile} from '../../../api/leancloud/fileUploader'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'

class ImageInput extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: this.props.initValue,
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  selectImg() {
    selectPhotoTapped({
      start: this.pickImageStart,
      failed: this.pickImageFailed,
      cancelled: this.pickImageCancel,
      succeed: this.pickImageSucceed
    })
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  pickImageStart = () => {
  }

  pickImageFailed = () => {
  }

  pickImageCancel = () => {
  }

  pickImageSucceed = (source) => {
    this.uploadImg(source)
  }

  imageSelectedChange(url) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: url}
    }
    this.props.inputFormUpdate(inputForm)
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
      this.imageSelectedChange(leanImgUrl)
    }).catch((error) => {
      console.log('upload failed:', error)
    })
  }

  render() {
    if (this.props.data) {
      return (
        <View style={styles.container}>
          <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
            <TouchableOpacity style={{flex: 1}} onPress={this.selectImg.bind(this)}>
              <Image style={[styles.choosenImageStyle, this.props.choosenImageStyle]} source={{uri: this.props.data}}/>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
            <TouchableOpacity style={{flex: 1}} onPress={this.selectImg.bind(this)}>
              <View>
                <Image style={[styles.defaultAddImageBtnStyle, this.props.addImageBtnStyle]}
                       source={this.props.addImage}/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }
}

ImageInput.defaultProps = {
  containerStyle: {},
  addImageViewStyle: {},
  addImageBtnStyle: {},
  addImageTextStyle: {},
  choosenImageStyle:{},
  addImage: require('../../../assets/images/default_picture.png'),
  prompt: "选择图片",
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ImageInput)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  choosenImageStyle:{
  //  position: 'absolute',
    //top: 20,
    //left: 25,
    width: 100,
    height: 100,
    flex:1,

  },
  defaultContainerStyle: {
    height: 100,
    width: 100,
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#F3F3F3',
    overflow:'hidden',
  },
  defaultAddImageBtnStyle: {
    position: 'absolute',
    top: 20,
    left: 25,
    width: 50,
    height: 50,
  },
  defaultAddImageTextStyle: {
    fontSize: 12,
    position: 'absolute',
    bottom: 6,
    left: 25,
  },
})