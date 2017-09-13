/**
 * Created by yangyang on 2017/4/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
  StatusBar,
  ListView,
  InteractionManager,
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Actions} from 'react-native-router-flux'
import THEME from '../../../constants/themes/theme1'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import Header from '../../common/Header'
import CommonListView from '../../common/CommonListView'
import PromoterLevelIcon from './PromoterLevelIcon'
import PromoterTeamItem from './PromoterTeamItem'
import {getPromoterTeamById} from '../../../action/promoterAction'
import {getPromoterById, activePromoter, getTeamMember} from '../../../selector/promoterSelector'
import {userInfoById} from '../../../selector/authSelector'
import {getConversationTime} from '../../../util/numberUtils'
import {CachedImage} from 'react-native-img-cache'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PromoterSecondTeam extends Component {
  constructor(props) {
    super(props)
    this.lastUpdatedAt = undefined
  }

  componentWillMount() {
    this.refreshData()
  }

  refreshData() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    if(this.isQuering) {
      return
    }
    this.isQuering = true

    InteractionManager.runAfterInteractions(()=>{
      this.props.getPromoterTeamById({
        limit: 10,
        more: !isRefresh,
        promoterId: this.props.promoter.id,
        lastUpdatedAt: !!isRefresh ? undefined : this.lastUpdatedAt,
        success: (isEmpty) => {
          this.isQuering = false
          if(!this.listView) {
            return
          }
          this.listView.isLoadUp(!isEmpty)
        },
        error: (message) => {
          this.isQuering = false
        }
      })
    })
  }

  renderPromoterView() {
    let user = this.props.user
    let promoter = this.props.promoter
    if (!user || !user) {
      return <View/>
    }
    return (
      <View>
        <View style={styles.tipView}>
          <Text style={styles.tipText}>我的好友</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.infoView} onPress={() => {Actions.PERSONAL_HOMEPAGE({userId: user.id})}}>
            <View style={{paddingLeft: normalizeW(15), paddingRight: normalizeW(9)}}>
              <CachedImage mutable style={styles.avatarStyle} resizeMode="contain"
                     source={user.avatar ? {uri: user.avatar} : require("../../../assets/images/default_portrait.png")} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.usernameText}>{user.nickname}</Text>
              <View style={styles.promoterInfoView}>
                <PromoterLevelIcon level={promoter.level} mode="tiny"/>
                <Text style={styles.promoterDealText}>最新业绩： {getConversationTime(new Date(promoter.updatedAt))}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderTeamList() {
    return (
      this.props.team.map((promoter, index) => {
        this.lastUpdatedAt = promoter.updatedAt
        return (
          <PromoterTeamItem key={index} promoter={promoter} showDetail={false} />
        )
      })
    )
  }

  renderTeamView() {
    let promoter = this.props.promoter
    if (!promoter) {
      return <View/>
    }
    return (
      <View>
        <View style={[styles.tipView, {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}]}>
          <Text style={styles.tipText}>我的熟人</Text>
          <Text style={{fontSize: em(15), color: THEME.base.mainColor, paddingLeft: normalizeW(8)}}>{promoter.teamMemNum}</Text>
          <Text style={[styles.tipText, {paddingLeft: normalizeW(8)}]}>人</Text>
        </View>
        {this.renderTeamList()}
      </View>
    )
  }

  renderRow(rowData, index) {
    if (rowData.type == 'SHOW_PROMOTER') {
      return this.renderPromoterView()
    } else if (rowData.type == 'PROMOTER_TEAM') {
      return this.renderTeamView()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<StatusBar barStyle="dark-content" />*/}
        <Header leftType="icon"
                leftIconName="ios-arrow-back"
                leftPress={()=> {
                  Actions.pop()
                }}
                title="我的熟人"
        />
        <View style={styles.body}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#FFF'}}
            dataSource={this.props.dataSource}
            renderRow={(rowData, rowId) => this.renderRow(rowData, rowId)}
            loadNewData={()=> {
              this.refreshData()
            }}
            loadMoreData={()=> {
              this.loadMoreData(false)
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let ds = undefined
  if (ownProps.ds) {
    ds = ownProps.ds
  } else {
    ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
    })
  }

  let comps = [{type: 'SHOW_PROMOTER'}, {type: 'PROMOTER_TEAM'}]

  let team = getTeamMember(state, ownProps.promoter.id)

  return {
    dataSource: ds.cloneWithRows(comps),
    team: team,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getPromoterTeamById,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PromoterSecondTeam)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.base.backgroundColor,
  },
  explainBtnStyle: {
    width: normalizeW(40),
    height: normalizeH(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalizeW(5)
  },
  body: {
    marginTop: normalizeH(64),
    flex: 1,
    width: PAGE_WIDTH,
    backgroundColor: '#FFF',
  },
  tipView: {
    justifyContent: 'center',
    height: normalizeH(45),
    backgroundColor: '#F5F5F5',
  },
  tipText: {
    fontSize: em(15),
    color: '#4a4a4a',
    paddingLeft: normalizeW(15),
  },
  usernameText: {
    fontSize: em(17),
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  promoterInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalizeH(10),
  },
  promoterDealText: {
    fontSize: em(12),
    color: '#B6B6B6',
    paddingLeft: normalizeW(10),
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: normalizeH(20),
    paddingBottom: normalizeH(20),
  },
  avatarStyle: {
    width: normalizeW(44),
    height: normalizeH(44),
    borderRadius: normalizeW(22),
    overflow: 'hidden',
  },
})