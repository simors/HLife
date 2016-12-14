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
//import  ImagePicker from 'react-native-image-crop-picker'
//import ActionSheet from 'react-native-actionsheet'

class ImageInput extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: this.props.initValue
    }
    this.props.initInputForm(formInfo)
  }

  selectImg() {
    selectPhotoTapped({
      start: this.pickAvatarStart,
      failed: this.pickAvatarFailed,
      cancelled: this.pickAvatarCancelled,
      succeed: this.pickImageSucceed
    })
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
      this.webView.sendToBridge('editImg_' + leanImgUrl)
    }).catch((error) => {
      console.log('upload failed:', error)
    })
  }

  render() {
    if (this.pickImageSucceed())
    {
    return (
      <View style={styles.container}>
        <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
          <TouchableOpacity style={{flex: 1}} onPress={this.selectImg.bind(this)}>
             <View>
              <Image style={[styles.defaultAddImageBtnStyle, this.props.addImageBtnStyle]}
                     source={this.}/>
              <Text style={[styles.defaultAddImageTextStyle, this.props.addImageTextStyle]}>{this.props.prompt}</Text>
          </View>
          </TouchableOpacity>

        </View>
      </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
            <TouchableOpacity style={{flex: 1}} onPress={this.selectImg.bind(this)}>
              <View>
                <Image style={[styles.defaultAddImageBtnStyle, this.props.addImageBtnStyle]}
                       source={[require('../../../assets/images/default_picture.png'),]}/>
                <Text style={[styles.defaultAddImageTextStyle, this.props.addImageTextStyle]}>{this.props.prompt}</Text>
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
  addImage: '../../../assets/images/home_more.png',
  prompt: "选择图片",
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
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
  defaultContainerStyle: {
    height: 100,
    width: 100,
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#F3F3F3',
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