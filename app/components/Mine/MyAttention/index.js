/**
 * Created by lilu on 2017/1/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  InteractionManager,
  ListView,
  RefreshControl,
} from 'react-native'
import Header from '../../common/Header'
import {Actions} from 'react-native-router-flux'
import {em, normalizeW, normalizeH} from '../../../util/Responsive'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {selectUserFollowees} from '../../../selector/authSelector'
import {fetchUserFollowees} from '../../../action/authActions'
import CommonListView from '../../common/CommonListView'
import FollowUser from '../../../components/common/FollowUser'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class MyAttention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabType: 0
    }
  }

  refreshTopic() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchUserFollowees()
    })
  }

  loadMoreData() {
  }

  renderTopicItem(value, key) {
    return (
      <View key={key} style={{borderBottomWidth: 2, borderColor: '#e5e5e5',}}>
        <View style={styles.introWrapStyle}>
          <View style={{flexDirection: 'row'}} onPress={()=> {
          }}>
            <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: value.id})}>
              <Image style={styles.avatarStyle}
                     source={value.avatar ? {uri: value.avatar} : require("../../../assets/images/default_portrait@2x.png")}/>
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE({userId: value.id})}>
                <Text style={styles.userNameStyle}>{value.nickname}</Text>
              </TouchableOpacity>
              <View style={styles.timeLocationStyle}>
                <Text style={styles.timeTextStyle}>
                  粉丝: 3
                </Text>
              </View>
            </View>

            <View style={styles.attentionStyle}>
              <FollowUser
                userId={value.id}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  renderAttentionList() {
    return (
      <CommonListView
        contentContainerStyle={styles.itemLayout}
        dataSource={this.props.userFollowees}
        renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
        loadNewData={()=> {
          this.refreshTopic()
        }}
        loadMoreData={()=> {
          this.loadMoreData()
        }}
      />
    )
  }

  renderShopList() {
    return (
      <View />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header headerContainerStyle={styles.header}
                leftType='icon'
                leftPress={() => Actions.pop()}
                title="我的关注"
                titleStyle={styles.title}>
        </Header>
        <View style={styles.body}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={()=> {
                this.setState({tabType: 0})
              }}>
              <Text style={{
                fontSize: em(15),
                color: this.state.tabType == 0 ? '#50E3C2' : '#4A4A4A',
                marginLeft: normalizeW(86)
              }}>吾友</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=> {
                this.setState({tabType: 1})
              }}>
              <Text style={{
                fontSize: em(15),
                color: this.state.tabType == 1 ? '#50E3C2' : '#4A4A4A',
                marginLeft: normalizeW(143)
              }}>店铺</Text>
            </TouchableOpacity>
          </View>
          {this.state.tabType == 0?this.renderAttentionList():this.renderShopList()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userFollowees = selectUserFollowees(state)
  return {
    userFollowees: ds.cloneWithRows(userFollowees),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchUserFollowees,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyAttention)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#F9F9F9'
  },
  title: {
    fontSize: em(17),
    color: '#030303'
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  tabBar: {
    height: normalizeH(44),
    width: PAGE_WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent:'center',
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(15),
  },
  //用户、时间、地点信息
  introWrapStyle: {
    marginTop: normalizeH(12),
    marginBottom: normalizeH(12),
    backgroundColor: '#ffffff',
  },
  userNameStyle: {
    fontSize: em(15),
    marginTop: 1,
    marginLeft: 10,
    color: "#4a4a4a"
  },
  attentionStyle: {
    position: "absolute",
    right: normalizeW(10),
    top: normalizeH(6),
    width: normalizeW(56),
    height: normalizeH(25)
  },
  timeLocationStyle: {
    marginLeft: normalizeW(11),
    marginTop: normalizeH(9),
    flexDirection: 'row'
  },
  avatarStyle: {
    height: normalizeH(44),
    width: normalizeW(44),
    marginLeft: normalizeW(12),
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeTextStyle: {
    marginRight: normalizeW(26),
    fontSize: em(12),
    color: THEME.colors.lighter
  },
  positionStyle: {
    marginRight: normalizeW(4),
    width: normalizeW(8),
    height: normalizeH(12)
  },
})