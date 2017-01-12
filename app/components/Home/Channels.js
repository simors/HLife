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
import ChannelItem from './ChannelItem'
import {Actions} from 'react-native-router-flux'

export default class Channels extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{flexDirection: 'row', height: normalizeH(180),}}>
        <View style={{backgroundColor: 'white', width: normalizeW(174)}}>
          <ChannelItem
            sourceImage={{uri: this.props.topics[0].image}}
            channelTitle={this.props.topics[0].title}
            channelIntro={this.props.topics[0].introduction}
            onPress={()=> {
              Actions.FIND_INDEX({topicId: this.props.topics[0].objectId})
            }}/>
        </View>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <ChannelItem channelTitleStyle={styles.channelTitleStyle}
                       channelIntroStyle={styles.channelIntroStyle}
                       channelImageStyle={styles.channelImageStyle}
                       channelRightStyle={styles.channelTopStyle}
                       sourceImage={{uri: this.props.topics[1].image}}
                       channelTitle={this.props.topics[1].title}
                       channelIntro={this.props.topics[1].introduction}
                       onPress={()=> {
                         Actions.FIND_INDEX({topicId: this.props.topics[1].objectId})
                       }}/>
          <ChannelItem channelTitleStyle={styles.channelTitleStyle}
                       channelIntroStyle={styles.channelIntroStyle}
                       channelImageStyle={styles.channelImageStyle}
                       channelRightStyle={styles.channelTopStyle}
                       sourceImage={{uri: this.props.topics[2].image}}
                       channelTitle={this.props.topics[2].title}
                       channelIntro={this.props.topics[2].introduction}
                       onPress={()=> {
                         Actions.FIND_INDEX({topicId: this.props.topics[2].objectId})
                       }}/>
        </View>
        <View style={{backgroundColor: 'white', flex: 1}}>
          <ChannelItem channelTitleStyle={styles.channelTitleStyle}
                       channelIntroStyle={styles.channelIntroStyle}
                       channelImageStyle={styles.channelImageStyle}
                       channelRightStyle={styles.channelTopStyle}
                       sourceImage={{uri: this.props.topics[3].image}}
                       channelTitle={this.props.topics[3].title}
                       channelIntro={this.props.topics[3].introduction}
                       onPress={()=> {
                         Actions.FIND_INDEX({topicId: this.props.topics[3].objectId})
                       }}/>
          <ChannelItem channelTitleStyle={styles.channelTitleStyle}
                       channelIntroStyle={styles.channelIntroStyle}
                       channelImageStyle={styles.channelImageStyle}
                       channelRightStyle={styles.channelTopStyle}
                       sourceImage={{uri: this.props.topics[4].image}}
                       channelTitle={this.props.topics[4].title}
                       channelIntro={this.props.topics[4].introduction}
                       onPress={()=> {
                         Actions.FIND_INDEX({topicId: this.props.topics[4].objectId})
                       }}/>
        </View>
        <Image style={styles.badgeStyle} source={require("../../assets/images/background_everyday.png")}>
          <Text style={styles.badgeTextStyle}>精选话题</Text>
        </Image>
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
    color: '#636363'
  },
  channelTopStyle: {
    height: normalizeH(47),
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingLeft: 4
  },
  channelImageStyle: {
    width: normalizeW(100),
    height: normalizeH(63),
    marginBottom: 0,
  },
  badgeStyle: {
    position: 'absolute',
    left: 0,
    top: -10,
    width: 65,
    height: 20,
    justifyContent:"center",
  },
  badgeTextStyle: {
    backgroundColor:"transparent",
    fontSize:11,
    paddingLeft:10,
    color:"#ffffff",
    fontFamily:".PingFangSC-Regular",
    letterSpacing:0.13
  },
})