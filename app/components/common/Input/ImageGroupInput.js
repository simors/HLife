/**
 * Created by yangyang on 2016/12/22.
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
  Modal,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ImageViewer from 'react-native-image-zoom-viewer'
import CommonButton from '../CommonButton'
import {selectPhotoTapped} from '../../../util/ImageSelector'
import {uploadFile} from '../../../api/leancloud/fileUploader'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ImageGroupInput extends Component {
  constructor(props) {
    super(props)
    this.imgList = []
    this.state = {
      imgCnt: 0,
      imgModalShow: false,
      showImg: '',
    }
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
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
    this.imgList.push(url)
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: this.imgList}
    }
    this.props.inputFormUpdate(inputForm)

    this.setState({imgCnt: this.imgList.length})
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

  renderReuploadBtn() {
    return (
      <View style={{borderWidth: 2, borderColor: 'red'}}>
        <CommonButton title="重新上传" onPress={() => this.selectImg()} />
      </View>
    )
  }

  renderImageModal() {
    let imgs = []
    this.imgList.map((item) => {
      imgs.push({url: item})
    })
    let index = this.imgList.findIndex((val) => {
      console.log('val', val)
      return (val == this.state.showImg)
    })
    if (index == -1) {
      index = 0
    }
    return (
      <View>
        <Modal visible={this.state.imgModalShow} transparent={false} animationType='fade'>
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <ImageViewer
              imageUrls={imgs}
              index={index}
              onClick={() => this.toggleModal(!this.state.imgModalShow)}
              renderFooter={() => this.renderReuploadBtn()}
            />
          </View>
        </Modal>
      </View>
    )
  }

  toggleModal(isShow, src) {
    this.setState({imgModalShow: isShow, showImg: src})
  }

  renderImage(src) {
    return (
      <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <Image style={{flex: 1}} source={{uri: src}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderImageButton() {
    return (
      <View style={[styles.defaultContainerStyle, this.props.containerStyle]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.selectImg()}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={[styles.defaultImgShow, this.props.imgShowStyle]}
                   source={require('../../../assets/images/add_picture.png')}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderImageRow() {
    let imgComp = this.imgList.map((item, key) => {
      return (
        <View key={key}>
          {this.renderImage(item)}
        </View>
      )
    })
    if (this.state.imgCnt < this.props.number) {
      imgComp.push(
        <View key="imgBtn">
          {this.renderImageButton()}
        </View>
      )
    }
    return imgComp
  }

  renderImageCollect() {
    let imgComp = this.renderImageRow()
    let compList = []
    let comp = []

    for (let i = 0; i < imgComp.length; i++) {
      comp.push(imgComp[i])
      if ((i + 1) % 3 == 0) {
        compList.push(comp)
        comp = []
      }
    }
    compList.push(comp)
    return compList
  }

  renderImageShow() {
    let compList = this.renderImageCollect()
    return (
      compList.map((item, key) => {
        return (
          <View key={key} style={styles.container}>
            {item}
          </View>
        )
      })
    )
  }

  render() {
    return (
      <View>
        {this.renderImageModal()}
        {this.renderImageShow()}
      </View>
    )
  }
}

ImageGroupInput.defaultProps = {
  number: 1,
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageGroupInput)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    marginLeft: 10,
    marginRight: 10,
  },
  defaultContainerStyle: {
    height: normalizeH(106),
    width: normalizeW(106),
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#F3F3F3',
    overflow:'hidden',
    margin: 5,
  },
  defaultImgShow: {
    width: 60,
    height: 60,
  },
})