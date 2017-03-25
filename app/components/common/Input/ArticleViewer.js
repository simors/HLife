/**
 * Created by yangyang on 2017/1/13.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Modal
} from 'react-native'
import Gallery from 'react-native-gallery'
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

export default class ArticleViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgModalShow: false,
      showImg: '',
    }
    this.images = []
  }

  componentDidMount() {
    this.props.artlcleContent.map((section) => {
      if (section.type === COMP_IMG) {
        this.images.push(section.url)
      }
    })
  }

  toggleModal(isShow, src) {
    this.setState({
      ...this.state,
      imgModalShow: isShow,
      showImg: src
    })
  }

  renderImageModal() {
    let index = this.images.findIndex((val) => {
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
          onRequestClose={()=>{}}
        >
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={this.images}
              initialPage={index}
              onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}
            />
          </View>
        </Modal>
      </View>
    )
  }

  renderText(content, index) {
    return (
      <View key={index}>
        <Text style={styles.textStyle}>{content}</Text>
      </View>
    )
  }

  renderImage(url, width, height, index) {
    let imgWidth = width
    let imgHeight = height
    let maxWidth = PAGE_WIDTH - 15
    if (width > maxWidth) {
      imgWidth = maxWidth
      imgHeight = Math.floor((imgWidth / width) * height)
    }
    return (
      <View key={index} style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableWithoutFeedback style={{flex:1}} onPress={() => this.toggleModal(!this.state.imgModalShow, url)}>
          <Image style={[styles.imgInputStyle, {width: imgWidth, height: imgHeight}]}
                 source={{uri: url}}>
          </Image>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderComponents() {
    return (
      this.props.artlcleContent.map((section, index) => {
        if (section.type === COMP_TEXT) {
          return this.renderText(section.text, index)
        } else if (section.type === COMP_IMG) {
          return this.renderImage(section.url, section.width, section.height, index)
        } else {
          return <View/>
        }
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderComponents()}
        {this.renderImageModal()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
  },
  textStyle: {
    width: PAGE_WIDTH,
    fontSize: em(16),
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#E6E6E6',
    textAlign: "left",
    textAlignVertical: "top",
    flexWrap: 'wrap',
    lineHeight: em(24),
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