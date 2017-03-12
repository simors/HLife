/**
 * Created by yangyang on 2017/3/6.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Swiper from 'react-native-swiper'
import {fetchMainPageTopics} from '../../action/topicActions'
import {getMainPageTopics} from '../../selector/topicSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class NearbyTopicView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      swiperHeight: 60,
      swiperWidth: 300,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // TODO: 获取附近精选话题
      this.props.fetchMainPageTopics({limited: 6})
    })
  }

  getSwiperSize(event) {
    this.setState({
      swiperHeight: event.nativeEvent.layout.height,
      swiperWidth: event.nativeEvent.layout.width,
    })
  }

  renderSwiperView() {
    if (!this.props.mainPageTopics) {
      return <View/>
    }
    let topicGroup = []
    let len = this.props.mainPageTopics.length
    for (let i = 0; i < len; i += 2) {
      topicGroup.push(this.props.mainPageTopics.slice(i, i + 2))
    }
    return (
      topicGroup.map((topic, index) => {
        return (
          <View key={index} style={{flex: 1}}>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              <View style={[styles.topicLabel, {backgroundColor: '#F6A623'}]}>
                <Text style={styles.labelText}>{topic[0].categoryName}</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {Actions.TOPIC_DETAIL({topic: topic[0]})}}>
                  <Text style={styles.titleText} numberOfLines={1}>{topic[0].title}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 8}}>
              <View style={[styles.topicLabel, {backgroundColor: '#7ED321'}]}>
                <Text style={styles.labelText}>{topic[1].categoryName}</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'center'}}>
                <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {Actions.TOPIC_DETAIL({topic: topic[1]})}}>
                  <Text style={styles.titleText} numberOfLines={1}>{topic[1].title}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      })
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.moduleTitleView}>
          <Image source={require('../../assets/images/title_lingjiahuati.png')}/>
        </View>
        <View style={styles.moduleContentView} onLayout={(event) => this.getSwiperSize(event)}>
          <Swiper
            style={styles.swiperView}
            horizontal={false}
            autoplay={true}
            showsPagination={false}
            height={this.state.swiperHeight}
            width={this.state.swiperWidth}
          >
            {this.renderSwiperView()}
          </Swiper>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let mainPageTopics = getMainPageTopics(state)
  newProps.mainPageTopics = mainPageTopics
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchMainPageTopics,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NearbyTopicView)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalizeH(78),
    backgroundColor: THEME.base.backgroundColor,
  },
  moduleTitleView: {
    marginLeft: normalizeW(20),
    marginRight: normalizeW(10),
  },
  moduleContentView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: normalizeH(18),
    marginBottom: normalizeH(12),
    borderLeftWidth: 1,
    borderColor: '#F5F5F5',
    ...Platform.select({
      ios: {
        paddingLeft: 0,
      },
      android: {
        paddingLeft: 8,
      }
    }),
  },
  swiperView: {
    ...Platform.select({
      ios: {
        paddingLeft: 5,
      },
      android: {
        marginLeft: 8,
      }
    }),
  },
  topicLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  labelText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 15,
    margin: 2
  },
  titleText: {
    fontSize: 15,
    color: '#AAAAAA',
    marginLeft: 10,
    lineHeight: 15,
  },
})