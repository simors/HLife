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
  BackAndroid
} from 'react-native'
import Gallery from 'react-native-gallery'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {CachedImage} from "react-native-img-cache"

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ImageGroupViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgModalShow: false,
      showImg: '',
      marginSize: 5,
      calImgSize: this.props.imgSize || 107
    }
  }

  imageContainerOnLayout(event) {
    const containerWidth = event.nativeEvent.layout.width || PAGE_WIDTH
    this.calculateImageWidth(containerWidth)
  }

  calculateImageWidth(containerWidth) {
    let calImgSize = 107
    if('oneLine' != this.props.showMode) {
      calImgSize = (containerWidth - (this.props.imageLineCnt - 1) * this.state.marginSize) / this.props.imageLineCnt
    }
    this.setState({
      ...this.state,
      calImgSize : calImgSize
    })
  }

  androidHardwareBackPress() {
    this.toggleModal(false)
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
        <Modal
          visible={this.state.imgModalShow}
          transparent={false}
          animationType='fade'
          onRequestClose={()=>{this.androidHardwareBackPress()}}
        >
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
      this.setState({
        ...this.state,
        imgModalShow: isShow,
        showImg: src
      })
  }

  renderImageBrowse(src) {
    const imageStyle = {marginRight:this.state.marginSize, width: this.state.calImgSize, height: this.state.calImgSize}
    if (this.props.browse) {
      return (
        <TouchableOpacity style={{flex:1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <CachedImage mutable style={imageStyle} source={{uri: src}}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <CachedImage mutable style={imageStyle} source={{uri: src}}/>
      )
    }
  }

  renderImage(src) {
    return (
      <View style={[
        styles.defaultContainerStyle,
        {flex: 1},
        this.props.imageStyle
        ]}>
        {this.renderImageBrowse(src)}
      </View>
    )
  }

  renderImageRow() {
    const imageStyle = {width: this.state.calImgSize + this.state.marginSize, height: this.state.calImgSize}
    let imgComp = this.props.images.map((item, key) => {
      return (
        <View key={key} style={imageStyle}>
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
            <View onLayout={this.imageContainerOnLayout.bind(this)} key={key} style={[styles.container, this.props.containerStyle]}>
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
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },

})