/**
 * Created by wuxingyu on 2016/12/9.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  InteractionManager,
  TouchableHighlight,
  ListView,
} from 'react-native'
import Header from '../common/Header'
import CommonListView from '../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import {Actions} from 'react-native-router-flux'
import {getConversationTime} from '../../util/numberUtils'
import FollowUser from '../../components/common/FollowUser'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class LikeUserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSrc: ds.cloneWithRows(props.topicLikeUsers),
    }
  }

  renderTopicItem(value, key) {
    return (
      <View key={key} style={{borderBottomWidth: 2,borderColor: '#e5e5e5',}}>
        <View style={styles.introWrapStyle}>
          <View style={{flexDirection: 'row'}} onPress={()=> {
          }}>
            <TouchableOpacity>
              <Image style={styles.avatarStyle}
                     source={value.avatar ? {uri: value.avatar} : require("../../assets/images/default_portrait@2x.png")}/>
            </TouchableOpacity>
            <View>
              <TouchableOpacity>
                <Text style={styles.userNameStyle}>{value.nickname}</Text>
              </TouchableOpacity>
              <View style={styles.timeLocationStyle}>
                <Text style={styles.timeTextStyle}>
                  {getConversationTime(value.createdAt.valueOf())}
                </Text>
              </View>
            </View>

            <View style={styles.attentionStyle}>
              <FollowUser
                userId={value.userId}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  refreshTopic() {
  }

  loadMoreData() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="点赞的吾友"
          rightType="none"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={styles.itemLayout}
            dataSource={this.state.dataSrc}
            renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
            loadNewData={()=> {
              this.refreshTopic()
            }}
            loadMoreData={()=> {
              this.loadMoreData()
            }}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LikeUserList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
  },
  buttonImage: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 20,
    bottom: 61,
    height: 45,
    width: 45
  },
  body: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#ffffff',
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