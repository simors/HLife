/**
 * Created by wanpeng on 2017/5/16.
 */

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  InteractionManager,
  ListView,
  ScrollView,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeH, normalizeW, normalizeBorder, em} from '../../util/Responsive'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../constants/themes/theme1'
import {searchTopicAction} from '../../action/searchActions'
import {getTopicSearchResult} from '../../selector/searchSelector'
import ImageGroupViewer from '../../components/common/Input/ImageGroupViewer'


const PAGE_WIDTH=Dimensions.get('window').width

const DS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})


class SearchTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: this.props.searchKey
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.searchTopicAction({
        key: this.props.searchKey,
        sid: this.props.sid
      })
    })
  }

  onLoadMore = () => {
    if(this.props.topics.hasMore) {
      this.props.searchTopicAction({
        key: this.state.searchKey,
        sid: this.props.topics.sid
      })
    }
  }

  onSearchTopic = () => {
    if(this.state.searchKey && this.state.searchKey.length > 0) {
      this.props.searchTopicAction({
        key: this.state.searchKey,
      })
    }
  }

  renderTopicHeader(sectionData, sectionID) {
    if(sectionData.length > 0) {
      return(
        <View style={styles.sectionHeader}>
          <Text style={{fontSize: 15, color: '#999999', marginTop: normalizeH(10), marginBottom: normalizeH(10)}}>话题</Text>
        </View>
      )
    } else {
      return(
        <View />
      )
    }
  }

  renderTopicItems(topic) {
    //没有图片的显示规则
    if ((!topic.imgGroup) || ((topic.imgGroup.length == 0))) {
      return (
        <TouchableOpacity style={styles.topicWrapStyle} onPress={()=> {}}>
          <Text style={styles.topicTitleStyle} numberOfLines={1}>
            {topic.title}
          </Text>
          <Text style={styles.topicStyle} numberOfLines={2}>
            {topic.abstract}
          </Text>
        </TouchableOpacity>
      )
    }
    //一张到2张图片的显示规则
    else if (topic.imgGroup && (topic.imgGroup.length < 3)) {
      let image = []
      image.push(topic.imgGroup[0])
      return (
        <TouchableOpacity style={[styles.topicWrapStyle, {flexDirection: 'row'}]}
                          onPress={()=> {}}>
          <View style={{flex: 1}}>
            <Text style={styles.topicTitleStyle} numberOfLines={2}>
              {topic.title}
            </Text>
            <Text style={styles.topicStyle} numberOfLines={3}>
              {topic.abstract}
            </Text>
          </View>
          <ImageGroupViewer browse={false}
                            images={image}
                            imageLineCnt={1}
                            containerStyle={{width: PAGE_WIDTH * 2 / 7, marginRight: 0}}/>
        </TouchableOpacity>
      )
    }
    //3张以上图片的显示规则
    else if (topic.imgGroup && (topic.imgGroup.length >= 3)) {
      let image = []
      image.push(topic.imgGroup[0])
      image.push(topic.imgGroup[1])
      image.push(topic.imgGroup[2])
      return (
        <TouchableOpacity style={styles.topicWrapStyle} onPress={()=> {}}>
          <Text style={styles.topicTitleStyle} numberOfLines={1}>
            {topic.title}
          </Text>
          <Text style={styles.topicStyle} numberOfLines={2}>
            {topic.abstract}
          </Text>
          <ImageGroupViewer browse={false}
                            images={image}
                            imageLineCnt={3}
                            containerStyle={{flex: 1, marginLeft: 0, marginRight: 0}}/>
        </TouchableOpacity>
      )
    }
  }

  renderTopicView() {
    return(
      <View style={styles.section}>
        <ListView
          style={{flex: 1}}
          keyboardDismissMode="on-drag"
          renderSectionHeader={this.renderTopicHeader}
          dataSource={DS.cloneWithRows(this.props.topics.result)}
          renderRow={(rowData) => this.renderTopicItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={10}

        />
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftWrap} onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-back" style={styles.left}/>
          </TouchableOpacity>
          <View style={styles.centerWrap}>
            <Image style={{marginLeft: normalizeW(10), marginRight: normalizeW(10)}} source={require('../../assets/images/search.png')}/>
            <TextInput
              style={{flex: 1, height: normalizeH(30), color: 'white'}}
              onChangeText={(text) => this.setState({searchKey: text})}
              value={this.state.searchKey}
              multiline={false}
              placeholder="搜索"
              placeholderTextColor='#FFFFFF'/>
          </View>
          <TouchableOpacity style={styles.rightWrap} onPress={this.onSearchTopic}>
            <Text style={{ fontSize: 17, color: '#FFFFFF', paddingRight: normalizeW(10)}}>搜索话题</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: normalizeH(64), flex: 1,backgroundColor: '#EBEBEB'}}>
          {this.renderTopicView()}
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let topics = getTopicSearchResult(state) || []
  return {
    topics: topics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchTopicAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchTopic)


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: THEME.base.mainColor,
    paddingTop: normalizeH(20),
    height: normalizeH(64),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor: '#B2B2B2',
  },
  leftWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  left: {
    fontSize: 28,
    color: '#FFF',
    marginLeft: normalizeW(10)
  },
  centerWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: normalizeW(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderRadius: 10,
  },
  rightWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: normalizeW(20)
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: normalizeH(30),
    color: 'white',
  },
  section: {
    flex: 1,
    paddingLeft: normalizeW(20),
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(10)
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  },

  topicWrapStyle: {
    flex: 1,
    marginTop: normalizeH(13),
    marginRight: normalizeW(12),
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  topicTitleStyle: {
    fontSize: em(17),
    fontWeight: 'bold',
    lineHeight: em(20),
    marginBottom: normalizeH(5),
    color: "#5A5A5A"
  },
  topicStyle: {
    marginBottom: normalizeH(13),
    fontSize: em(15),
    lineHeight: em(20),
    color: "#9b9b9b"
  },
})