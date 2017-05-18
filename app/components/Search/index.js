/**
 * Created by wanpeng on 2017/5/10.
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
import {searchKeyAction, searchClearAction} from '../../action/searchActions'
import {getUserSearchResult, getShopSearchResult, getTopicSearchResult} from '../../selector/searchSelector'
import ScoreShow from '../common/ScoreShow'
import ImageGroupViewer from '../../components/common/Input/ImageGroupViewer'


const PAGE_WIDTH=Dimensions.get('window').width

const DS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: undefined
    }
  }

  componentWillUnmount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.searchClearAction({})
    })
  }

  renderUserView() {
   return(
      <View style={styles.section}>
        <ListView
          renderSectionHeader={this.renderUserHeader}
          dataSource={DS.cloneWithRows(this.props.users.result)}
          renderRow={(rowData) => this.renderUserItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
        />
        {this.renderUserMore()}
      </View>
    )
  }

  renderUserHeader(sectionData, sectionID) {
    if(sectionData.length > 0) {
      return(
        <View style={styles.sectionHeader}>
          <Text style={{fontSize: 15, color: '#999999', marginTop: normalizeH(10), marginBottom: normalizeH(10)}}>用户</Text>
        </View>
      )
    } else {
      return(
        <View />
      )
    }
  }

  onUserSearchMore = () => {
    Actions.SEARCH_USER({
      searchKey: this.state.searchKey,
      sid: this.props.users.sid
    })
  }

  renderUserMore() {
    if(this.props.users.hasMore) {
      return(
        <TouchableOpacity style={styles.more} onPress={this.onUserSearchMore}>
          <Image source={require('../../assets/images/search.png')}/>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#65718D', fontSize: 15, marginLeft: normalizeW(10)}}>查看更多用户</Text>
          </View>
          <Image source={require('../../assets/images/arrow_left.png')}/>
        </TouchableOpacity>
      )
    } else {
      return(
        <View />
      )
    }
  }

  renderUserItems(user) {
    return(
      <TouchableOpacity style={styles.item} onPress={() => Actions.PERSONAL_HOMEPAGE({userId: user.id})}>
        <View>
          <Image style={{width: 40, height: 40, marginTop: normalizeH(10), marginBottom: normalizeH(10), marginRight: normalizeW(10)}}
                 source={user.avatar? {uri: user.avatar}: require('../../assets/images/defualt_user.png')}/>
        </View>
        <View>
          <Text style={{fontSize: 17}}>{user.nickname}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderShopView() {
    return(
      <View style={styles.section}>
        <ListView
          renderSectionHeader={this.renderShopHeader}
          dataSource={DS.cloneWithRows(this.props.shops.result)}
          renderRow={(rowData) => this.renderShopItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
        />
        {this.renderShopMore()}
      </View>
    )
  }

  renderShopHeader(sectionData, sectionID) {
    if(sectionData.length > 0) {
      return(
        <View style={styles.sectionHeader}>
          <Text style={{fontSize: 15, color: '#999999', marginTop: normalizeH(10), marginBottom: normalizeH(10)}}>店铺</Text>
        </View>
      )
    } else {
      return(
        <View />
      )
    }

  }

  onShopSearchMore = () => {
    Actions.SEARCH_SHOP({
      searchKey: this.state.searchKey,
      sid: this.props.shops.sid
    })
  }

  renderShopMore() {
    if(this.props.shops.hasMore) {
      return(
        <TouchableOpacity style={styles.more} onPress={this.onShopSearchMore}>
          <Image source={require('../../assets/images/search.png')}/>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#65718D', fontSize: 15, marginLeft: normalizeW(10)}}>查看更多店铺</Text>
          </View>
          <Image source={require('../../assets/images/arrow_left.png')}/>
        </TouchableOpacity>
      )
    } else {
      return(
        <View />
      )
    }
  }

  renderShopItems(rowData) {
    return (
      <TouchableOpacity onPress={() => {Actions.SHOP_DETAIL({id: rowData.id})}}>
        <View style={styles.item}>
          <View style={styles.coverWrap}>
            <Image style={styles.cover} source={{uri: rowData.coverUrl}}/>
          </View>
          <View style={styles.shopIntroWrap}>
            <View style={styles.shopInnerIntroWrap}>
              <Text style={styles.shopName} numberOfLines={1}>{rowData.shopName}</Text>
              <ScoreShow
                containerStyle={{flex:1}}
                score={rowData.score}
              />
              <View style={styles.subInfoWrap}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style={styles.subTxt}>{rowData.shopAddress}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderTopicView() {
    return(
      <View style={styles.section}>
        <ListView
          renderSectionHeader={this.renderTopicHeader}
          dataSource={DS.cloneWithRows(this.props.topics.result)}
          renderRow={(rowData) => this.renderTopicItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
        />
        {this.renderTopicMore()}
      </View>
    )
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
        <TouchableOpacity style={styles.topicWrapStyle} onPress={() => Actions.TOPIC_DETAIL({topic: topic})}>
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
                          onPress={() => Actions.TOPIC_DETAIL({topic: topic})}>
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
        <TouchableOpacity style={styles.topicWrapStyle} onPress={() => Actions.TOPIC_DETAIL({topic: topic})}>
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

  onTopicSearchMore = () => {
    Actions.SEARCH_TOPIC({
      searchKey: this.state.searchKey,
      sid: this.props.topics.sid
    })
  }

  renderTopicMore() {
    if(this.props.topics.hasMore) {
      return(
        <TouchableOpacity style={styles.more} onPress={this.onTopicSearchMore}>
          <Image source={require('../../assets/images/search.png')}/>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{color: '#65718D', fontSize: 15, marginLeft: normalizeW(10)}}>查看更多话题</Text>
          </View>
          <Image source={require('../../assets/images/arrow_left.png')}/>
        </TouchableOpacity>
      )
    } else {
      return(
        <View />
      )
    }
  }

  onSearch = () => {
    if(this.state.searchKey && this.state.searchKey.length > 0) {
      this.props.searchKeyAction({
        key: this.state.searchKey,
        limit: 3,
      })
    }
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
              style={{flex: 1, height: normalizeH(30), color: 'white', padding: 0}}
              onChangeText={(text) => this.setState({searchKey: text})}
              value={this.state.searchKey}
              autoFocus={true}
              multiline={false}
              placeholder="搜索"
              underlineColorAndroid="transparent"
              placeholderTextColor='#FFFFFF'/>
          </View>
          <TouchableOpacity style={styles.rightWrap} onPress={this.onSearch}>
            <Text style={{ fontSize: 17, color: '#FFFFFF', paddingRight: normalizeW(10)}}>搜索</Text>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardDismissMode="on-drag" style={{marginTop: normalizeH(64), flex: 1,backgroundColor: '#EBEBEB'}}>
          {this.renderUserView()}
          {this.renderShopView()}
          {this.renderTopicView()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let users = getUserSearchResult(state) || []
  let shops = getShopSearchResult(state) || []
  let topics = getTopicSearchResult(state) || []
  return {
    users: users,
    shops: shops,
    topics: topics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchKeyAction,
  searchClearAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Search)

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
    paddingLeft: normalizeW(20),
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(10)
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(40),
    paddingRight: normalizeW(10)
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  coverWrap: {
    width: 80,
    height: 80
  },
  cover: {
    flex: 1
  },
  shopIntroWrap: {
    flex: 1,
    paddingLeft: 10,
  },
  shopInnerIntroWrap: {
    height: 80,
  },
  shopName: {
    lineHeight: em(20),
    fontSize: em(17),
    color: '#8f8e94'
  },
  subInfoWrap: {
    flexDirection: 'row',
  },
  subTxt: {
    marginRight: normalizeW(10),
    color: '#d8d8d8',
    fontSize: em(12)
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