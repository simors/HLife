/**
 * Created by yangyang on 2016/12/23.
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
import Gallery from 'react-native-gallery'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ImageGroupViewer extends Component {
  constructor(props) {
    super(props)
    this.marginSize = 5
    this.calImgSize = this.calculateImageWidth()
    this.state = {
      imgModalShow: false,
      showImg: '',
    }
  }

  calculateImageWidth() {
    let calImgSize = (PAGE_WIDTH - (this.props.imageLineCnt + 1) * 2 * this.marginSize) / this.props.imageLineCnt
    return calImgSize
  }

  renderImageModal() {
    let index = this.props.images.findIndex((val) => {
      return (val == this.state.showImg)
    })
    if (index == -1) {
      index = 0
    }
    return (
      <View>
        <Modal visible={this.state.imgModalShow} transparent={false} animationType='fade'>
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={this.props.images}
              initialPage={index}
              onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}
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
      <View style={[styles.defaultContainerStyle, {margin: this.marginSize, width: this.calImgSize, height: this.calImgSize}]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <Image style={{flex: 1}} source={{uri: src}}/>
        </TouchableOpacity>
      </View>
    )
  }

  renderImageRow() {
    let imgComp = this.props.images.map((item, key) => {
      return (
        <View key={key}>
          {this.renderImage(item)}
        </View>
      )
    })
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

  render() {
    return (
      <View>
        {this.renderImageModal()}
        {this.renderImageShow()}
      </View>
    )
  }
}

ImageGroupViewer.defaultProps = {
  imageLineCnt: 3,
}

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
    backgroundColor: '#F3F3F3',
    overflow:'hidden',
  },
})