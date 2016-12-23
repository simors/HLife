/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import MultilineText from './MultilineText'
import ImageGroupInput from './ImageGroupInput'
import ImageGroupViewer from './ImageGroupViewer'
import TopicImageViewer from '../TopicImageViewer'
import Symbol from 'es6-symbol'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let formKey = Symbol('multiForm')
const multiInput = {
  formKey: formKey,
  stateKey: Symbol('multiInput'),
  type: 'content'
}

const imageGroupInput = {
  formKey: formKey,
  stateKey: Symbol('imageGroupInput'),
  type: 'imgGroup'
}

const images = [
  'http://c.hiphotos.baidu.com/image/pic/item/64380cd7912397dd5393db755a82b2b7d1a287dd.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/d009b3de9c82d1585e277e5f840a19d8bd3e42b2.jpg',
  'http://g.hiphotos.baidu.com/image/pic/item/83025aafa40f4bfb1530a905014f78f0f63618fa.jpg',
  'http://c.hiphotos.baidu.com/image/pic/item/f7246b600c3387448982f948540fd9f9d72aa0bb.jpg'
]

const topicImgs = [
  'http://a.hiphotos.baidu.com/image/pic/item/730e0cf3d7ca7bcb32e5fb00bf096b63f624a806.jpg',
  'http://g.hiphotos.baidu.com/image/pic/item/6d81800a19d8bc3e7763d030868ba61ea9d345e5.jpg',
  'http://d.hiphotos.baidu.com/image/pic/item/5bafa40f4bfbfbed88e0cfa07cf0f736aec31fb7.jpg',
  'http://h.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd2c5e14680db30f2443a70fd4.jpg',
  'http://b.hiphotos.baidu.com/image/pic/item/f9198618367adab46341cd4a89d4b31c8701e422.jpg',
  'http://a.hiphotos.baidu.com/image/pic/item/9358d109b3de9c82d94b518a6e81800a19d8438c.jpg',
  'http://a.hiphotos.baidu.com/image/pic/item/203fb80e7bec54e7e6be8429bc389b504fc26ab3.jpg'
]

export default class TextImageTest extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <KeyboardAwareScrollView>
          <View style={{marginTop: 30}}>
            <MultilineText {...multiInput} initValue='yangyang'/>
          </View>
          <View style={{marginTop: 30}}>
            <ImageGroupInput {...imageGroupInput} number={9} imageLineCnt={2}/>
          </View>
          <View style={{marginTop: 30}}>
            <ImageGroupViewer images={images} imageLineCnt={2}/>
          </View>
          <View style={{marginTop: 30}}>
            <TopicImageViewer images={topicImgs} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}