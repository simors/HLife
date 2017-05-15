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
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {normalizeH, normalizeW, normalizeBorder} from '../../util/Responsive'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../constants/themes/theme1'
import {searchKeyAction} from '../../action/searchActions'
import {getUserSearchResult, getShopSearchResult, getTopicSearchResult} from '../../selector/searchSelector'


const PAGE_WIDTH=Dimensions.get('window').width



class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: undefined
    }
  }

  renderUserView() {
    if(this.props.users && this.props.users.length > 0) {
      return(
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={{fontSize: 17, color: '#999999'}}>用户</Text>
          </View>
          <ListView
            dataSource={this.props.dataSource}
            renderRow={(rowData) => this.renderUserItems(rowData)}
          />
          {this.props.users.length > 3?
            <TouchableOpacity style={styles.more}>
              <Image source={require('../../assets/images/search.png')}/>
              <Text style={{color: '#65718D', fontSize: 17}}>查看更多用户</Text>
              <Image source={require('../../assets/images/arrow_left.png')}/>
            </TouchableOpacity>:
            <View />
          }
        </View>
      )
    } else {
      return <View />
    }
  }

  renderUserItems(user) {
    return(
      <View style={styles.item}>
        <View>
          <Image source={{uri: user.avatar}}/>
        </View>
        <View>
          <Text>{user.nickname}</Text>
        </View>
      </View>
    )
  }

  renderShopView() {
    if(this.props.shops && this.props.shops.length > 0) {
      return(
        <View></View>
      )
    } else {
      return <View />
    }
  }

  renderTopicView() {
    if(this.props.topics && this.props.topics.length > 0) {
      return(
        <View></View>
      )
    } else {
      return <View />
    }
  }

  onSearch = () => {
    this.props.searchKeyAction({
      key: this.state.searchKey,
      limit: 3,
    })
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
              autoFocus={true}
              multiline={false}
              placeholder="搜索"
              placeholderTextColor='#FFFFFF'/>
          </View>
          <TouchableOpacity style={styles.rightWrap} onPress={this.onSearch}>
            <Text style={{ fontSize: 17, color: '#FFFFFF', paddingRight: normalizeW(10)}}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: normalizeH(64), flex: 1,backgroundColor: '#EBEBEB'}}>
          {this.renderUserView()}
          {this.renderShopView()}
          {this.renderTopicView()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

  let users = getUserSearchResult(state)
  let shops = getShopSearchResult(state)
  let topics = getTopicSearchResult(state)
  console.log("getUserSearchResult ", users)
  console.log("getUserSearchResult ", shops)
  console.log("getUserSearchResult ", topics)
  return {
    userDataSource: ds.cloneWithRows(users),
    shopDataSource: ds.cloneWithRows(shops),
    topicDataSource: ds.cloneWithRows(topics),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchKeyAction
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
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: normalizeW(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center'
  },
  rightWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  }
})