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
import Gallery from 'react-native-gallery'
import ImagePicker from 'react-native-image-picker'
import CommonButton from '../CommonButton'
import {selectPhotoTapped} from '../../../util/ImageSelector'
import * as ImageUtil from '../../../util/ImageUtil'
import {uploadFile} from '../../../api/leancloud/fileUploader'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import ActionSheet from 'react-native-actionsheet'
import * as Toast from '../Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class ImageGroupInput extends Component {
  constructor(props) {
    super(props)
    this.imgList = []
    this.marginSize = 5
    this.calImgSize = this.calculateImageWidth()
    this.state = {
      imgCnt: 0,
      imgModalShow: false,
      showImg: '',
      reSltImageIndex: -1
    }

    this.isUploadedImages = false

    this.pickerAndUploadImage = !!props.pickerAndUploadImage
  }

  componentDidMount() {
    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      checkValid: this.validInput,
      initValue: {text: this.props.initValue}
    }
    this.props.initInputForm(formInfo)
  }

  calculateImageWidth() {
    let calImgSize = (PAGE_WIDTH - (this.props.imageLineCnt + 1) * 2 * this.marginSize) / this.props.imageLineCnt
    return calImgSize
  }

  selectImg() {
    this.ActionSheet.show()
  }

  reSelectImg(index) {
    this.setState({
      reSltImageIndex: index
    })
    this.ActionSheet.show()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.initValue && nextProps.initValue.length) {
      if(this.props.initValue) {
        if(this.props.initValue.length != nextProps.initValue.length) {
          this.imgList = nextProps.initValue
          this.inputChange(this.imgList)
        }
      }else {
        this.imgList = nextProps.initValue
        this.inputChange(this.imgList)
      }
    }

    if(nextProps.shouldUploadImages && !this.isUploadedImages) {
      this.uploadImgs(this.imgList)
    }
  }

  inputChange(text) {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: text}
    }
    this.props.inputFormUpdate(inputForm)

    this.setState({imgCnt: text.length})
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  updateImageGroup(options) {
    this.imgList = this.imgList.concat(options.uris)
    this.inputChange(this.imgList)
    //用户拍照或从相册选择了照片
    if(typeof this.props.getImageList == 'function') {
      this.props.getImageList(this.imgList)
    }
    if(typeof options.success == 'function') {
      options.success(options)
    }
  }

  uploadImgs(uris) {
    if(uris && uris.length) {
      let localUris = []
      let leanUris = []
      uris.forEach((item)=>{
        if(/^https?:\/\//i.test(item)){
          leanUris.push(item)
        }else {
          localUris.push(item)
        }
      })
      if(localUris.length) {
        ImageUtil.uploadImgs({
          uris: localUris,
          success: (leanImgUrls) => {
            this.isUploadedImages = true
            this.imgList = leanUris.concat(leanImgUrls)
            this.inputChange(this.imgList)
            if( typeof this.props.uploadImagesCallback == 'function') {
              this.props.uploadImagesCallback({leanImgUrls: this.imgList})
            }
          }
        })
      }else {
        if( typeof this.props.uploadImagesCallback == 'function') {
          this.imgList = uris
          this.props.uploadImagesCallback({leanImgUrls: uris})
        }
      }
    }else {
      if( typeof this.props.uploadImagesCallback == 'function') {
        this.props.uploadImagesCallback({leanImgUrls: []})
      }
    }
  }

  renderReuploadBtn(index) {
    return (
      <View style={{position: 'absolute', bottom: normalizeH(50), left: normalizeW(17)}}>
        <CommonButton title="重新上传" onPress={() => this.reSelectImg(index)} />
      </View>
    )
  }

  androidHardwareBackPress() {
    this.toggleModal(false)
  }

  renderImageModal() {
    let index = this.imgList.findIndex((val) => {
      return (val == this.state.showImg)
    })
    if (index == -1) {
      index = 0
    }
    return (
      <View>
        <Modal
          visible={this.state.imgModalShow}
          transparent={false}
          animationType='fade'
          onRequestClose={()=>{this.androidHardwareBackPress()}}
        >
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={this.imgList}
              initialPage={index}
              onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}
            />
            {this.renderReuploadBtn(index)}
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
      <View style={[styles.defaultContainerStyle, {margin: this.marginSize, width: this.calImgSize, height: this.calImgSize}]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <Image style={{flex: 1}} source={{uri: src}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderImageButton() {
    return (
      <View style={[styles.defaultContainerStyle, {margin: this.marginSize, width: this.calImgSize, height: this.calImgSize}]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.selectImg()}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={[styles.defaultImgShow, this.props.imgShowStyle]}
                   source={this.props.addImage}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderImageRow() {
    if (this.props.data) {
      this.imgList = this.props.data
    }
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
      if ((i + 1) % this.props.imageLineCnt == 0) {
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

  _handleActionSheetPress(index) {
    if(0 == index) { //拍照
      ImageUtil.openPicker({
        openType: 'camera',
        success: (response) => {
          if(this.state.reSltImageIndex != -1) {
            this.toggleModal(false)
            this.imgList.splice(this.state.reSltImageIndex, 1)
            this.setState({
              reSltImageIndex: -1
            })
          }
          let uris = [response.path]
          if(this.pickerAndUploadImage) {
            this.uploadImgs({uris})
          }else {
            this.updateImageGroup({uris})
          }
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      })
    }else if(1 == index) { //从相册选择
      let option = {
        openType: 'gallery',
        multiple: false, //为了使用裁剪控制图片大小,必须关闭多选
        success: (response) => {
          let uris = []
          if(this.state.reSltImageIndex != -1) {
            this.toggleModal(false)
            this.imgList.splice(this.state.reSltImageIndex, 1)
            this.setState({
              reSltImageIndex: -1
            })
            uris.push(response.path)
          }else {
            if(option.multiple) {
              response.forEach((item) => {
                uris.push(item.path)
              })
            }else {
              uris.push(response.path)
            }
          }
          if(this.pickerAndUploadImage) {
            this.uploadImgs({uris})
          }else {
            this.updateImageGroup({uris})
          }
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      }

      if(this.state.reSltImageIndex != -1) { //重新选择
        option.multiple = false
      }

      ImageUtil.openPicker(option)
    }else if(2 == index) {
      this.setState({
        reSltImageIndex: -1
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
      <View>
        {this.renderImageModal()}
        {this.renderImageShow()}
        {this.renderActionSheet()}
      </View>
    )
  }
}

ImageGroupInput.defaultProps = {
  number: 1,
  imageLineCnt: 3,
  addImage: require('../../../assets/images/add_picture.png'),
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageGroupInput)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    marginLeft: 5,
    marginRight: 5,
  },
  defaultContainerStyle: {
    borderColor: '#E9E9E9',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    overflow:'hidden',
  },
  defaultImgShow: {
    width: normalizeW(60),
    height: normalizeH(60),
  },
})