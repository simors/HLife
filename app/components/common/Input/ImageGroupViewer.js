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
  ScrollView,
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
    let calImgSize = 107
    if('oneLine' != this.props.showMode) {
      calImgSize = (PAGE_WIDTH - (this.props.imageLineCnt + 1) * 2 * this.marginSize) / this.props.imageLineCnt
    }
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

  renderImageBrowse(src) {
    if (this.props.browse) {
      return (
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <Image style={{flex: 1}} source={{uri: src}}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <Image style={{flex: 1}} source={{uri: src}}/>
      )
    }
  }

  renderImage(src) {
    return (
      <View style={[
        styles.defaultContainerStyle,
        {margin: this.marginSize, width: this.calImgSize, height: this.calImgSize},
        this.props.imageStyle
        ]}>
        {this.renderImageBrowse(src)}
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

    if('oneLine' == this.props.showMode) {
      compList.push(imgComp)
    }else {
      for (let i = 0; i < imgComp.length; i++) {
        comp.push(imgComp[i])
        if ((i + 1) % this.props.imageLineCnt == 0) {
          compList.push(comp)
          comp = []
        }
      }
      compList.push(comp)
    }
    return compList
  }

  renderImageShow() {
    let compList = this.renderImageCollect()
    const showMode = this.props.showMode || 'multiLine' //照片显示模式: multiLine-多行, oneLint-单行

    if('oneLine' == showMode) {
      return (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.contentContainerStyle, this.props.contentContainerStyle]}
        >
          {compList.map((item, key) => {
            return (
            <View key={key} style={[styles.container, this.props.containerStyle]}>
            {item}
            </View>
            )
          })}
        </ScrollView>
      )
    }else {
      return (
        compList.map((item, key) => {
          return (
            <View key={key} style={[styles.container, {width: PAGE_WIDTH}, this.props.containerStyle]}>
              {item}
            </View>
          )
        })
      )
    }
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
  browse: true,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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