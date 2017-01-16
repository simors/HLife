/**
 * Created by yangyang on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native'
import Symbol from 'es6-symbol'
import ArticleEditor from './ArticleEditor'
import ArticleViewer from './ArticleViewer'

const COMP_TEXT = 'COMP_TEXT'
const COMP_IMG = 'COMP_IMG'

let formKey = Symbol('articleForm')
const articleEditor = {
  formKey: formKey,
  stateKey: Symbol('articleEditor'),
  type: 'articleEditor',
}

const articleData = [
  {
    type: COMP_TEXT,
    text: '请注意，这不是演习，再次声明，这不是演习！请各单位保持高度警惕，时刻注意敌人动向，发现异常情况立即上报上级，如遇特殊情况，可直接向总部报告！'
  },
  {
    type: COMP_IMG,
    url: 'http://a.hiphotos.baidu.com/image/pic/item/730e0cf3d7ca7bcb32e5fb00bf096b63f624a806.jpg',
    width: 300,
    height: 400,
  },
  {
    type: COMP_TEXT,
    text: '实现过程：首先通过 document.location 获得网址，然后以 // 为分隔符用 split 方法把网址分为两部分；再在后一部分 arrObj[1] 中找到 /  的位置，然后用 substring 方法从此位置开始截取到结尾的所有字符。代码如下'
  },
  {
    type: COMP_IMG,
    url: 'http://h.hiphotos.baidu.com/image/pic/item/962bd40735fae6cd2c5e14680db30f2443a70fd4.jpg',
    width: 300,
    height: 400,
  },
]

export default class ArticleInputTest extends Component {
  constructor(props) {
    super(props)
    this.imgList = []
  }

  getImageList(imgs) {
    this.imgList = imgs
    console.log('images:', this.imgList)
  }

  render() {
    return (
      <View>
          <ArticleEditor {...articleEditor} getImages={(images) => this.getImageList(images)}/>
          {/*<ArticleViewer artlcleContent={articleData} />*/}
      </View>
    )
  }
}