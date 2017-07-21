/**
 * Created by yangyang on 2016/12/23.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import {getThumbUrl} from '../../../util/ImageUtil'
import {LazyloadScrollView, LazyloadView} from '../../common/Lazyload'
import Swiper from 'react-native-swiper';


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ImageGroupViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgModalShow: false,
      showImg: '',
      marginSize: 5,
      calImgSize: this.props.imgSize || 107,
    }
  }

  imageContainerOnLayout(event) {
    const containerWidth = event.nativeEvent.layout.width || PAGE_WIDTH
    this.calculateImageWidth(containerWidth)
  }

  calculateImageWidth(containerWidth) {
    let calImgSize = this.state.calImgSize
    if ('oneLine' != this.props.showMode) {
      calImgSize = (containerWidth - (this.props.imageLineCnt - 1) * this.state.marginSize) / this.props.imageLineCnt
    }
    this.setState({
      ...this.state,
      calImgSize: calImgSize
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
    // console.log('this.state.imageIndex',this.state.imageIndex)
    // console.log('index',index)

    return (
      <View>
        <Modal
          visible={this.state.imgModalShow}
          transparent={false}
          animationType='fade'
          onRequestClose={()=> {
            this.androidHardwareBackPress()
          }}
        >
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            {/*<Gallery*/}
              {/*style={{flex: 1, backgroundColor: 'black'}}*/}
              {/*images={this.props.images}*/}
              {/*initialPage={index}*/}
              {/*onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}*/}
            {/*/>*/}
            <Swiper style={styles.wrapper}
                    showsButtons={false}
                    index={index}
                    showsPagination={false}
                    autoplay={false}
                    loadMinimal={false}
                    loop={true}
            >
              {this.renderImageSwaper()}
            </Swiper>
          </View>
        </Modal>
      </View>
    )
  }

  renderImageSwaper(){
    if(this.props.images&&this.props.images.length){
      let imageViews = []
      imageViews = this.props.images.map((item,key)=>{
             return(
               <View  key={key} style={styles.slide1}>
         <TouchableWithoutFeedback  onPress={() => this.toggleModal(!this.state.imgModalShow, item)}>

               <CachedImage  source={{uri: item}} style={{flex:1,width:PAGE_WIDTH,maxHeight:normalizeH(400)}}/>

       </TouchableWithoutFeedback>
        </View>
        )
      })
      // console.log('')
      return imageViews
    }
  }

  toggleModal(isShow, src) {
    // console.log('this.props.images',this.props.images)
    // console.log('src',src)
    this.setState({
      ...this.state,
      imgModalShow: isShow,
      showImg: src,
      // imageIndex:key
    })
  }

  renderImageBrowse(src) {
    let imageSize = Math.floor(this.state.calImgSize)
    const imageStyle = {marginRight: this.state.marginSize, width: imageSize, height: imageSize}
    if (this.props.browse) {
      return (
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow, src)}>
          <CachedImage mutable style={imageStyle} source={{uri: getThumbUrl(src, imageSize, imageSize)}}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <LazyloadView name={this.props.lazyName ? this.props.lazyName : 'cacheImageView'}>
          <CachedImage mutable style={imageStyle} source={{uri: getThumbUrl(src, imageSize, imageSize)}}/>
        </LazyloadView>
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

    if ('oneLine' == this.props.showMode) {
      compList.push(imgComp)
    } else {
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

  handleOnScroll(e) {
    let offset = e.nativeEvent.contentOffset.y
    let comHeight = normalizeH(200)
    if (offset >= 0 && offset < 10) {
      Animated.timing(this.state.fade, {
        toValue: 0,
        duration: 100,
      }).start()
    } else if (offset > 10 && offset < comHeight) {
      Animated.timing(this.state.fade, {
        toValue: (offset - 10) / comHeight,
        duration: 100,
      }).start()
    } else if (offset >= comHeight) {
      Animated.timing(this.state.fade, {
        toValue: 1,
        duration: 100,
      }).start()
    }
  }

  renderImageShow() {
    let compList = this.renderImageCollect()
    const showMode = this.props.showMode || 'multiLine' //照片显示模式: multiLine-多行, oneLint-单行

    if ('oneLine' == showMode) {
      return (
        <LazyloadScrollView
          name={this.props.lazyName ? this.props.lazyName : 'cacheImageView'}
          contentContainerStyle={[styles.contentContainerStyle]}
          onScroll={e => this.handleOnScroll(e)}
          scrollEventThrottle={80}
        >
          {compList.map((item, key) => {
            return (
              <View key={key} style={[styles.container, this.props.containerStyle]}>
                {item}
              </View>
            )
          })}
        </LazyloadScrollView>
      )
    } else {
      return (
        compList.map((item, key) => {
          return (
            <View onLayout={this.imageContainerOnLayout.bind(this)} key={key}
                  style={[styles.container, this.props.containerStyle]}>
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
  wrapper: {
    backgroundColor:'black'
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }

})