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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Swiper from 'react-native-swiper'

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
    })
  }

  getSwiperSize(event) {
    this.setState({
      swiperHeight: event.nativeEvent.layout.height,
      swiperWidth: event.nativeEvent.layout.width,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.moduleTitleView}>
          <Text style={styles.moduleTitle}>邻家</Text>
          <Text style={styles.moduleTitle}>话题</Text>
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
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <View style={[styles.topicLabel, {backgroundColor: '#F6A623'}]}>
                  <Text style={styles.labelText}>情感</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {}}>
                    <Text style={styles.titleText} numberOfLines={1}>找个女朋友真的那么难吗？</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <View style={[styles.topicLabel, {backgroundColor: '#7ED321'}]}>
                  <Text style={styles.labelText}>美食</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {}}>
                    <Text style={styles.titleText} numberOfLines={1}>冬笋的神奇功效你都了解吗？</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <View style={[styles.topicLabel, {backgroundColor: '#7ED321'}]}>
                  <Text style={styles.labelText}>美容</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {}}>
                    <Text style={styles.titleText} numberOfLines={1}>这个SPA做的值！瞬间回到18岁，哈哈哈。。。</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <View style={[styles.topicLabel, {backgroundColor: '#F6A623'}]}>
                  <Text style={styles.labelText}>亲子</Text>
                </View>
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => {}}>
                    <Text style={styles.titleText} numberOfLines={1}>小朋友的这些行为要不得，但是家长往往束手无策！</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Swiper>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NearbyTopicView)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalizeH(78),
    backgroundColor: 'white',
  },
  moduleTitleView: {
    marginLeft: normalizeW(20),
    marginRight: normalizeW(10),
  },
  moduleTitle: {
    fontSize: 24,
    color: THEME.base.mainColor,
    lineHeight: 24,
  },
  moduleContentView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: normalizeH(18),
    marginBottom: normalizeH(15),
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