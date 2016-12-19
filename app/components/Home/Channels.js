/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import Channel from './Channel'

export default class Channels extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{flexDirection: 'row',height: normalizeH(180),}}>
        <View style={{backgroundColor: 'white', width: normalizeW(174)}}>
          <Channel
            sourceImage={{uri: 'http://d.hiphotos.baidu.com/image/pic/item/242dd42a2834349b301f448bcbea15ce36d3bea6.jpg'}}
            channelTitle="美食诱惑"
            channelIntro="做生活的美食家"
            onPress={()=> {
              Actions.LOGIN()
            }}/>
        </View>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <Channel channelTitleStyle={styles.channelTitleStyle}
                   channelIntroStyle={styles.channelIntroStyle}
                   channelImageStyle={styles.channelImageStyle}
                   channelRightStyle={styles.channelTopStyle}
                   sourceImage={{uri: 'http://d.hiphotos.baidu.com/image/pic/item/242dd42a2834349b301f448bcbea15ce36d3bea6.jpg'}}
                   channelTitle="健康养生"
                   channelIntro="生命最好的礼物"
                   onPress={()=> {
                     Actions.LOGIN()
                   }}/>
          <Channel channelTitleStyle={styles.channelTitleStyle}
                   channelIntroStyle={styles.channelIntroStyle}
                   channelImageStyle={styles.channelImageStyle}
                   channelRightStyle={styles.channelTopStyle}
                   sourceImage={{uri: 'http://e.hiphotos.baidu.com/image/pic/item/024f78f0f736afc33532a065b119ebc4b74512f7.jpg'}}
                   channelTitle="相亲社区"
                   channelIntro="解决你下半生的烦恼"
                   onPress={()=> {
                     Actions.LOGIN()
                   }}/>
        </View>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <Channel channelTitleStyle={styles.channelTitleStyle}
                   channelIntroStyle={styles.channelIntroStyle}
                   channelImageStyle={styles.channelImageStyle}
                   channelRightStyle={styles.channelTopStyle}
                   sourceImage={{uri: 'http://dynamic-image.yesky.com/414x480/uploadImages/2015/107/47/24SH6H51T7HM.jpg'}}
                   channelTitle="足球世界"
                   channellIntro="球迷的天堂"
                   onPress={()=> {
                     Actions.LOGIN()
                   }}/>
          <Channel channelTitleStyle={styles.channelTitleStyle}
                   channelIntroStyle={styles.channelIntroStyle}
                   channelImageStyle={styles.channelImageStyle}
                   channelRightStyle={styles.channelTopStyle}
                   sourceImage={{uri: 'http://d.hiphotos.baidu.com/image/pic/item/242dd42a2834349b301f448bcbea15ce36d3bea6.jpg'}}
                   channelTitle="影视基地"
                   channelIntro="看世界风花雪月"
                   onPress={()=> {
                     Actions.LOGIN()
                   }}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  channelTitleStyle: {
    marginTop: normalizeH(8),
    fontSize: em(15),
    color: '#636363'
  },
  channelIntroStyle: {
    marginTop: normalizeH(4),
    fontSize: em(10),
    color: '#ababab'
  },
  channelTopStyle:{
    height:normalizeH(47),
    alignItems: 'flex-start',
    backgroundColor:'rgba(255, 255, 255, 0.7)',
    paddingLeft:4
  },
  channelImageStyle: {
    width: normalizeW(100),
    height:  normalizeH(63),
    marginBottom:0,
  },
})