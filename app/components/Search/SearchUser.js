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
import {normalizeH, normalizeW, normalizeBorder} from '../../util/Responsive'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../constants/themes/theme1'
import {searchUserAction} from '../../action/searchActions'
import {getUserSearchResult} from '../../selector/searchSelector'


const PAGE_WIDTH=Dimensions.get('window').width

const DS = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})


class SearchUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKey: this.props.searchKey
    }
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.searchUserAction({
        key: this.props.searchKey,
        sid: this.props.sid
      })
    })
  }

  onLoadMore = () => {
     if(this.props.users.hasMore) {
      this.props.searchUserAction({
        key: this.state.searchKey,
        sid: this.props.users.sid
      })
    }
  }

  renderUserView() {
    return(
      <View style={styles.section}>
        <ListView
          style={{flex: 1}}
          keyboardDismissMode="on-drag"
          renderSectionHeader={this.renderUserHeader}
          dataSource={DS.cloneWithRows(this.props.users.result)}
          renderRow={(rowData) => this.renderUserItems(rowData)}
          enableEmptySections={true}
          stickySectionHeadersEnabled= {true}
          onEndReached={this.onLoadMore}
          onEndReachedThreshold={10}
        />
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

  renderUserItems(user) {
    return(
      <TouchableOpacity style={styles.item}>
        <View>
          <Image style={{width: 40, height: 40, marginTop: normalizeH(10), marginBottom: normalizeH(10), marginRight: normalizeW(10)}}
                 source={user.avatar? {uri: user.avatar}: require('../../assets/images/defualt_user.png')}/>
        </View>
        <View>
          <Text style={{fontSize: 17}}>{user.nickname || '汇邻优客'}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  onSearchUser = () => {
    if(this.state.searchKey && this.state.searchKey.length > 0) {
      this.props.searchUserAction({
        key: this.state.searchKey,
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
              style={{flex: 1, height: normalizeH(30), color: 'white', textAlignVertical: 'center', padding: 0}}
              onChangeText={(text) => this.setState({searchKey: text})}
              value={this.state.searchKey}
              multiline={false}
              placeholder="搜索用户"
              underlineColorAndroid="transparent"
              placeholderTextColor='#FFFFFF'/>
          </View>
          <TouchableOpacity style={styles.rightWrap} onPress={this.onSearchUser}>
            <Text style={{ fontSize: 17, color: '#FFFFFF', paddingRight: normalizeW(10)}}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: normalizeH(64), flex: 1,backgroundColor: '#EBEBEB'}}>
          {this.renderUserView()}
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let users = getUserSearchResult(state) || []
  console.log("getUserSearchResult ", users)
  return {
    users: users,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUserAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser)

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
    borderRadius: 10
  },
  rightWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: normalizeW(20),
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
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    alignItems: 'center'
  }
})